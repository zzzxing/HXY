import json
import os
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, Request, Depends, Form, UploadFile, File
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy.orm import Session

from .config import settings
from .database import get_db
from .models import (
    User, Activity, ActivitySite, Task, ActivityMember, QuestionItem, Evidence,
    Portfolio, PortfolioItem, School, Class
)
from .services.auth import verify_password, get_current_user, require_role
from .services.ai import ask_deepseek
from .services.portfolio import generate_portfolio

app = FastAPI(title=settings.app_name)
app.add_middleware(SessionMiddleware, secret_key=settings.secret_key)

templates = Jinja2Templates(directory="pyapp/templates")
app.mount("/static", StaticFiles(directory="pyapp/static"), name="static")

upload_dir = Path(settings.upload_dir)
upload_dir.mkdir(parents=True, exist_ok=True)


def render(request: Request, template_name: str, **ctx):
    return templates.TemplateResponse(template_name, {"request": request, **ctx})


@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    if request.session.get("user_id"):
        return RedirectResponse("/dashboard", status_code=303)
    return RedirectResponse("/login", status_code=303)


@app.get("/login", response_class=HTMLResponse)
def login_page(request: Request, error: str | None = None):
    return render(request, "auth/login.html", error=error)


@app.post("/login")
def login(request: Request, username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.password_hash):
        return render(request, "auth/login.html", error="账号或密码错误")
    request.session["user_id"] = user.id
    return RedirectResponse("/dashboard", status_code=303)


@app.get("/logout")
def logout(request: Request):
    request.session.clear()
    return RedirectResponse("/login", status_code=303)


@app.get("/dashboard", response_class=HTMLResponse)
def dashboard(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)
    if user.role == "student":
        return RedirectResponse("/student/activities", status_code=303)
    if user.role == "teacher":
        return RedirectResponse("/teacher/activities", status_code=303)
    return RedirectResponse("/admin", status_code=303)


# student pages
@app.get("/student/activities", response_class=HTMLResponse)
def student_activities(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    rows = db.query(Activity).join(ActivityMember, ActivityMember.activity_id == Activity.id).filter(ActivityMember.student_id == user.id).all()
    return render(request, "student/activities.html", user=user, activities=rows)


@app.get("/student/activities/{activity_id}", response_class=HTMLResponse)
def student_activity_detail(activity_id: int, request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    sites = db.query(ActivitySite).filter(ActivitySite.activity_id == activity_id).order_by(ActivitySite.order_index.asc()).all()
    return render(request, "student/activity_detail.html", user=user, activity=activity, sites=sites)


@app.get("/student/activities/{activity_id}/learn", response_class=HTMLResponse)
def student_learn(activity_id: int, request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    questions = db.query(QuestionItem).filter_by(activity_id=activity_id, student_id=user.id, phase="learn").all()
    return render(request, "student/learn.html", user=user, activity_id=activity_id, questions=questions)


@app.post("/student/activities/{activity_id}/learn/ask")
def student_ask(activity_id: int, request: Request, question: str = Form(...), db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    reply = ask_deepseek(db, activity_id=activity_id, site_id=None, phase="learn", task_text=None, question=question, student_id=user.id)
    db.add(QuestionItem(activity_id=activity_id, student_id=user.id, phase="learn", content=question, category="inquiry", source="student_manual"))
    db.commit()
    request.session["last_ai_reply"] = reply
    return RedirectResponse(f"/student/activities/{activity_id}/learn", status_code=303)


@app.get("/student/activities/{activity_id}/research", response_class=HTMLResponse)
def student_research(activity_id: int, request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    tasks = db.query(Task).filter_by(activity_id=activity_id, phase="research").order_by(Task.sort_order.asc()).all()
    questions = db.query(QuestionItem).filter_by(activity_id=activity_id, student_id=user.id, phase="research").all()
    return render(request, "student/research.html", user=user, activity_id=activity_id, tasks=tasks, questions=questions)


@app.post("/student/activities/{activity_id}/research/question")
def student_research_q(activity_id: int, request: Request, content: str = Form(...), db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    db.add(QuestionItem(activity_id=activity_id, student_id=user.id, phase="research", content=content, category="inquiry", source="student_manual"))
    db.commit()
    return RedirectResponse(f"/student/activities/{activity_id}/research", status_code=303)


@app.get("/student/sites/{site_id}", response_class=HTMLResponse)
def student_site(site_id: int, request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    site = db.query(ActivitySite).filter(ActivitySite.id == site_id).first()
    evidences = db.query(Evidence).filter_by(site_id=site_id, student_id=user.id).order_by(Evidence.created_at.desc()).all()
    return render(request, "student/site.html", user=user, site=site, evidences=evidences, ai_reply=request.session.pop("site_ai_reply", None))


@app.post("/student/sites/{site_id}/ask")
def site_ask(site_id: int, request: Request, question: str = Form(...), db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    site = db.query(ActivitySite).filter_by(id=site_id).first()
    reply = ask_deepseek(db, activity_id=site.activity_id, site_id=site_id, phase="visit", task_text=None, question=question, student_id=user.id)
    request.session["site_ai_reply"] = reply
    return RedirectResponse(f"/student/sites/{site_id}", status_code=303)


@app.post("/student/sites/{site_id}/evidence")
def upload_evidence(
    site_id: int,
    request: Request,
    note: str = Form(""),
    text_content: str = Form(""),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    user = get_current_user(request, db); require_role(user, ["student"])
    site = db.query(ActivitySite).filter_by(id=site_id).first()

    if image and image.filename:
      ext = os.path.splitext(image.filename)[1]
      filename = f"{datetime.utcnow().timestamp()}_{user.id}{ext}"
      filepath = upload_dir / filename
      with open(filepath, "wb") as f:
          f.write(image.file.read())
      db.add(Evidence(activity_id=site.activity_id, student_id=user.id, site_id=site_id, evidence_type="image", file_url=str(filepath), note=note))

    if text_content.strip():
      db.add(Evidence(activity_id=site.activity_id, student_id=user.id, site_id=site_id, evidence_type="text", text_content=text_content, note=note))

    db.commit()
    return RedirectResponse(f"/student/sites/{site_id}", status_code=303)


@app.get("/student/activities/{activity_id}/portfolio", response_class=HTMLResponse)
def student_portfolio(activity_id: int, request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    pf = generate_portfolio(db, activity_id, user.id)
    items = db.query(PortfolioItem).filter_by(portfolio_id=pf.id).order_by(PortfolioItem.sort_order.asc()).all()
    return render(request, "student/portfolio.html", user=user, portfolio=pf, items=items)


# teacher pages
@app.get("/teacher/activities", response_class=HTMLResponse)
def teacher_activities(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["teacher"])
    activities = db.query(Activity).filter_by(teacher_id=user.id).order_by(Activity.created_at.desc()).all()
    classes = db.query(Class).filter_by(school_id=user.school_id).all()
    return render(request, "teacher/activities.html", user=user, activities=activities, classes=classes)


@app.post("/teacher/activities")
def teacher_create_activity(request: Request, title: str = Form(...), theme: str = Form(""), description: str = Form(""), db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["teacher"])
    act = Activity(title=title, theme=theme, description=description, teacher_id=user.id, status="draft")
    db.add(act); db.commit(); db.refresh(act)
    return RedirectResponse(f"/teacher/activities/{act.id}/edit", status_code=303)


@app.get("/teacher/activities/{activity_id}/edit", response_class=HTMLResponse)
def teacher_edit_activity(activity_id: int, request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["teacher"])
    activity = db.query(Activity).filter_by(id=activity_id, teacher_id=user.id).first()
    sites = db.query(ActivitySite).filter_by(activity_id=activity_id).order_by(ActivitySite.order_index.asc()).all()
    tasks = db.query(Task).filter_by(activity_id=activity_id).order_by(Task.sort_order.asc()).all()
    return render(request, "teacher/activity_edit.html", user=user, activity=activity, sites=sites, tasks=tasks)


@app.post("/teacher/activities/{activity_id}/site")
def teacher_add_site(activity_id: int, request: Request, name: str = Form(...), intro: str = Form(""), db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["teacher"])
    order_index = db.query(ActivitySite).filter_by(activity_id=activity_id).count() + 1
    site = ActivitySite(activity_id=activity_id, name=name, order_index=order_index, intro=intro, problem_chain=json.dumps([{"level":"核心问题","content":"你看到了什么关键现象？"}], ensure_ascii=False), evidence_checklist=json.dumps(["拍照","记录文字"], ensure_ascii=False))
    db.add(site); db.commit()
    return RedirectResponse(f"/teacher/activities/{activity_id}/edit", status_code=303)


@app.post("/teacher/activities/{activity_id}/task")
def teacher_add_task(activity_id: int, request: Request, phase: str = Form(...), title: str = Form(...), description: str = Form(""), db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["teacher"])
    sort_order = db.query(Task).filter_by(activity_id=activity_id).count() + 1
    task = Task(activity_id=activity_id, phase=phase, title=title, description=description, task_type="mixed", sort_order=sort_order, required=True)
    db.add(task); db.commit()
    return RedirectResponse(f"/teacher/activities/{activity_id}/edit", status_code=303)


@app.post("/teacher/activities/{activity_id}/publish")
def teacher_publish_activity(activity_id: int, request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["teacher"])
    act = db.query(Activity).filter_by(id=activity_id, teacher_id=user.id).first()
    act.status = "published"
    db.commit()
    return RedirectResponse(f"/teacher/activities/{activity_id}/edit", status_code=303)


@app.get("/teacher/activities/{activity_id}/students", response_class=HTMLResponse)
def teacher_students(activity_id: int, request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["teacher"])
    evidences = db.query(Evidence, User.name).join(User, User.id == Evidence.student_id).filter(Evidence.activity_id == activity_id).all()
    portfolios = db.query(Portfolio, User.name).join(User, User.id == Portfolio.student_id).filter(Portfolio.activity_id == activity_id).all()
    return render(request, "teacher/students.html", user=user, activity_id=activity_id, evidences=evidences, portfolios=portfolios)


@app.post("/teacher/portfolios/{portfolio_id}/review")
def teacher_review_portfolio(portfolio_id: int, request: Request, teacher_score: float = Form(...), teacher_comment: str = Form(...), db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["teacher"])
    pf = db.query(Portfolio).filter_by(id=portfolio_id).first()
    pf.teacher_score = teacher_score
    pf.teacher_comment = teacher_comment
    pf.status = "reviewed"
    pf.updated_at = datetime.utcnow()
    db.commit()
    return RedirectResponse(f"/teacher/activities/{pf.activity_id}/students", status_code=303)


# admin pages
@app.get("/admin", response_class=HTMLResponse)
def admin_index(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["admin"])
    users = db.query(User).order_by(User.created_at.desc()).all()
    classes = db.query(Class).all()
    activities = db.query(Activity).order_by(Activity.created_at.desc()).all()
    return render(request, "admin/index.html", user=user, users=users, classes=classes, activities=activities)
