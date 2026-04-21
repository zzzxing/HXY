import json
import os
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, Request, Depends, Form, UploadFile, File
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy import func
from sqlalchemy.orm import Session

from .config import settings
from .database import get_db
from .models import (
    User, Activity, ActivitySite, Task, ActivityMember, QuestionItem, Evidence,
    Portfolio, PortfolioItem, Class, BackpackItem, IdentityQuest, StudentQuest,
    Badge, UserBadge, FeaturedItem, AIConversation, SiteCompletion,
)
from .services.auth import verify_password, get_current_user, require_role
from .services.ai import ask_deepseek
from .services.portfolio import generate_portfolio
from .startup import run_preflight, ensure_runtime_dirs

run_preflight(allow_weak_secret=True)
ensure_runtime_dirs()

app = FastAPI(title=settings.app_name)
from starlette.middleware.sessions import SessionMiddleware
app.add_middleware(SessionMiddleware, secret_key=settings.secret_key)

templates = Jinja2Templates(directory="pyapp/templates")
app.mount("/static", StaticFiles(directory="pyapp/static"), name="static")

upload_dir = Path(settings.upload_dir)
upload_dir.mkdir(parents=True, exist_ok=True)


def render(request: Request, template_name: str, **ctx):
    return templates.TemplateResponse(template_name, {"request": request, **ctx})


def grant_badge(db: Session, user_id: int, badge_code: str):
    badge = db.query(Badge).filter_by(code=badge_code).first()
    if not badge:
        return
    existing = db.query(UserBadge).filter_by(user_id=user_id, badge_id=badge.id).first()
    if existing:
        return
    db.add(UserBadge(user_id=user_id, badge_id=badge.id))
    db.commit()


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
        return RedirectResponse("/student/home", status_code=303)
    if user.role == "teacher":
        return RedirectResponse("/teacher/dashboard", status_code=303)
    return RedirectResponse("/admin", status_code=303)


# -------- Student V2 --------
@app.get("/student/home", response_class=HTMLResponse)
def student_home(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    activities = db.query(Activity).join(ActivityMember, ActivityMember.activity_id == Activity.id).filter(ActivityMember.student_id == user.id).all()
    active = activities[0] if activities else None
    progress = 0
    if active:
        total_sites = db.query(ActivitySite).filter_by(activity_id=active.id).count()
        finished_sites = db.query(Evidence).filter_by(activity_id=active.id, student_id=user.id).with_entities(Evidence.site_id).distinct().count()
        progress = int((finished_sites / total_sites) * 100) if total_sites else 0
    badges = db.query(Badge, UserBadge).join(UserBadge, UserBadge.badge_id == Badge.id).filter(UserBadge.user_id == user.id).all()
    featured = db.query(FeaturedItem, User.name).join(User, User.id == FeaturedItem.student_id).order_by(FeaturedItem.created_at.desc()).limit(5).all()
    return render(request, "student/home.html", user=user, activities=activities, active=active, progress=progress, badges=badges, featured=featured)


@app.get("/student/map", response_class=HTMLResponse)
def student_map(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    activity = db.query(Activity).join(ActivityMember, ActivityMember.activity_id == Activity.id).filter(ActivityMember.student_id == user.id).first()
    sites = db.query(ActivitySite).filter_by(activity_id=activity.id).order_by(ActivitySite.order_index.asc()).all() if activity else []
    completion_site_ids = {x[0] for x in db.query(SiteCompletion.site_id).filter(SiteCompletion.activity_id == activity.id, SiteCompletion.student_id == user.id).all()} if activity else set()
    return render(request, "student/map.html", user=user, activity=activity, sites=sites, completion_site_ids=completion_site_ids)


@app.get("/student/tasks", response_class=HTMLResponse)
def student_tasks(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    activity = db.query(Activity).join(ActivityMember, ActivityMember.activity_id == Activity.id).filter(ActivityMember.student_id == user.id).first()
    tasks = db.query(Task).filter(Task.activity_id == activity.id).order_by(Task.required.desc(), Task.sort_order.asc()).all() if activity else []
    quests = db.query(IdentityQuest).all()
    my_quests = db.query(StudentQuest).filter_by(student_id=user.id).all()
    return render(request, "student/tasks.html", user=user, activity=activity, tasks=tasks, quests=quests, my_quests=my_quests)


@app.post("/student/tasks/select-quest")
def select_quest(request: Request, quest_id: int = Form(...), db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    sq = db.query(StudentQuest).filter_by(student_id=user.id, quest_id=quest_id).first()
    if not sq:
        db.add(StudentQuest(student_id=user.id, quest_id=quest_id, status="selected", progress=0))
        db.commit()
    return RedirectResponse("/student/tasks", status_code=303)


@app.post("/student/tasks/complete-quest")
def complete_quest(request: Request, student_quest_id: int = Form(...), db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    sq = db.query(StudentQuest).filter_by(id=student_quest_id, student_id=user.id).first()
    if sq:
        sq.status = "done"; sq.progress = 100
        db.commit()
        grant_badge(db, user.id, "continuous_explorer")
    return RedirectResponse("/student/tasks", status_code=303)


@app.get("/student/backpack", response_class=HTMLResponse)
def student_backpack(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    evidences = db.query(Evidence).filter_by(student_id=user.id).order_by(Evidence.created_at.desc()).all()
    questions = db.query(QuestionItem).filter_by(student_id=user.id).order_by(QuestionItem.created_at.desc()).all()
    cards = db.query(BackpackItem).filter_by(student_id=user.id).order_by(BackpackItem.created_at.desc()).all()
    return render(request, "student/backpack.html", user=user, evidences=evidences, questions=questions, cards=cards)


@app.post("/student/backpack/card")
def add_backpack_card(request: Request, item_type: str = Form(...), content: str = Form(...), db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    activity = db.query(Activity).join(ActivityMember, ActivityMember.activity_id == Activity.id).filter(ActivityMember.student_id == user.id).first()
    db.add(BackpackItem(activity_id=activity.id if activity else 0, student_id=user.id, item_type=item_type, content=content))
    db.commit()
    return RedirectResponse("/student/backpack", status_code=303)


@app.get("/student/me", response_class=HTMLResponse)
def student_me(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    portfolios = db.query(Portfolio).filter_by(student_id=user.id).order_by(Portfolio.updated_at.desc()).all()
    badges = db.query(Badge, UserBadge).join(UserBadge, UserBadge.badge_id == Badge.id).filter(UserBadge.user_id == user.id).all()
    return render(request, "student/me.html", user=user, portfolios=portfolios, badges=badges)


@app.get("/student/activities/{activity_id}/portfolio", response_class=HTMLResponse)
def student_portfolio(activity_id: int, request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    pf = generate_portfolio(db, activity_id, user.id)
    items = db.query(PortfolioItem).filter_by(portfolio_id=pf.id).order_by(PortfolioItem.sort_order.asc()).all()
    q_count = db.query(QuestionItem).filter_by(activity_id=activity_id, student_id=user.id).count()
    e_count = db.query(Evidence).filter_by(activity_id=activity_id, student_id=user.id).count()
    t_count = db.query(Task).filter_by(activity_id=activity_id).count()
    return render(request, "student/portfolio.html", user=user, portfolio=pf, items=items, q_count=q_count, e_count=e_count, t_count=t_count)


@app.get("/student/sites/{site_id}", response_class=HTMLResponse)
def student_site(site_id: int, request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    site = db.query(ActivitySite).filter_by(id=site_id).first()
    evidences = db.query(Evidence).filter_by(site_id=site_id, student_id=user.id).order_by(Evidence.created_at.desc()).all()
    completed = db.query(SiteCompletion).filter_by(site_id=site_id, student_id=user.id).first() is not None
    hotspots = json.loads(site.hotspots or "[]") if site else []
    return render(request, "student/site_explore.html", user=user, site=site, hotspots=hotspots, evidences=evidences, completed=completed, guide_reply=request.session.pop("guide_reply", None), coach_reply=request.session.pop("coach_reply", None))


@app.post("/student/sites/{site_id}/ask-guide")
def site_ask_guide(site_id: int, request: Request, question: str = Form(...), db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    site = db.query(ActivitySite).filter_by(id=site_id).first()
    reply = ask_deepseek(db, activity_id=site.activity_id, site_id=site_id, phase="visit", task_text=None, question=question, student_id=user.id, mode="guide")
    request.session["guide_reply"] = reply
    grant_badge(db, user.id, "first_question")
    return RedirectResponse(f"/student/sites/{site_id}", status_code=303)


@app.post("/student/sites/{site_id}/ask-coach")
def site_ask_coach(site_id: int, request: Request, question: str = Form(...), db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    site = db.query(ActivitySite).filter_by(id=site_id).first()
    reply = ask_deepseek(db, activity_id=site.activity_id, site_id=site_id, phase="visit", task_text=None, question=question, student_id=user.id, mode="coach")
    db.add(QuestionItem(activity_id=site.activity_id, student_id=user.id, site_id=site_id, phase="visit", content=question, category="inquiry", source="student_manual"))
    db.commit()
    request.session["coach_reply"] = reply
    grant_badge(db, user.id, "first_question")
    return RedirectResponse(f"/student/sites/{site_id}", status_code=303)


@app.post("/student/sites/{site_id}/evidence")
def upload_evidence(site_id: int, request: Request, note: str = Form(""), text_content: str = Form(""), image: UploadFile | None = File(None), db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    site = db.query(ActivitySite).filter_by(id=site_id).first()

    if image and image.filename:
        ext = os.path.splitext(image.filename)[1]
        filename = f"{datetime.utcnow().timestamp()}_{user.id}{ext}"
        filepath = upload_dir / filename
        with open(filepath, "wb") as f:
            f.write(image.file.read())
        db.add(Evidence(activity_id=site.activity_id, student_id=user.id, site_id=site_id, evidence_type="image", file_url=str(filepath), note=note))
        grant_badge(db, user.id, "first_evidence")

    if text_content.strip():
        db.add(Evidence(activity_id=site.activity_id, student_id=user.id, site_id=site_id, evidence_type="text", text_content=text_content, note=note))

    db.commit()

    evidence_count = db.query(func.count(Evidence.id)).filter(Evidence.student_id == user.id).scalar() or 0
    if evidence_count >= 5:
        grant_badge(db, user.id, "evidence_master")

    return RedirectResponse(f"/student/sites/{site_id}", status_code=303)


@app.post("/student/sites/{site_id}/complete")
def complete_site(site_id: int, request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["student"])
    site = db.query(ActivitySite).filter_by(id=site_id).first()
    existing = db.query(SiteCompletion).filter_by(site_id=site_id, student_id=user.id).first()
    if not existing:
        db.add(SiteCompletion(activity_id=site.activity_id, site_id=site_id, student_id=user.id))
        db.commit()
        grant_badge(db, user.id, "continuous_explorer")
    return RedirectResponse(f"/student/sites/{site_id}", status_code=303)


# -------- Teacher V2 --------
@app.get("/teacher/dashboard", response_class=HTMLResponse)
def teacher_dashboard(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["teacher"])
    activities = db.query(Activity).filter_by(teacher_id=user.id).all()
    activity_ids = [a.id for a in activities]
    total_members = db.query(ActivityMember).filter(ActivityMember.activity_id.in_(activity_ids)).count() if activity_ids else 0
    total_evidences = db.query(Evidence).filter(Evidence.activity_id.in_(activity_ids)).count() if activity_ids else 0
    total_questions = db.query(QuestionItem).filter(QuestionItem.activity_id.in_(activity_ids)).count() if activity_ids else 0
    ready_review = db.query(Portfolio).filter(Portfolio.activity_id.in_(activity_ids), Portfolio.status == "draft").count() if activity_ids else 0
    featured = db.query(FeaturedItem, User.name).join(User, User.id == FeaturedItem.student_id).filter(FeaturedItem.teacher_id == user.id).order_by(FeaturedItem.created_at.desc()).limit(5).all()
    return render(request, "teacher/dashboard.html", user=user, activities=activities, total_members=total_members, total_evidences=total_evidences, total_questions=total_questions, ready_review=ready_review, featured=featured)


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
    site = ActivitySite(
        activity_id=activity_id,
        name=name,
        order_index=order_index,
        intro=intro,
        key_facts="观察颜色、纹理、用途",
        scene_image="/static/scene-placeholder.jpg",
        hotspots=json.dumps(["矿石纹理", "用途标签", "对比样本"], ensure_ascii=False),
        problem_chain=json.dumps([{"level": "核心问题", "content": "你看到了什么关键现象？"}], ensure_ascii=False),
        evidence_checklist=json.dumps(["拍照", "记录文字"], ensure_ascii=False),
    )
    db.add(site); db.commit()
    return RedirectResponse(f"/teacher/activities/{activity_id}/edit", status_code=303)


@app.post("/teacher/activities/{activity_id}/task")
def teacher_add_task(activity_id: int, request: Request, phase: str = Form(...), title: str = Form(...), description: str = Form(""), required: bool = Form(True), db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["teacher"])
    sort_order = db.query(Task).filter_by(activity_id=activity_id).count() + 1
    db.add(Task(activity_id=activity_id, phase=phase, title=title, description=description, task_type="mixed", sort_order=sort_order, required=required))
    db.commit()
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
    high_questions = db.query(QuestionItem.content, func.count(QuestionItem.id).label("cnt")).filter(QuestionItem.activity_id == activity_id).group_by(QuestionItem.content).order_by(func.count(QuestionItem.id).desc()).limit(5).all()
    return render(request, "teacher/students.html", user=user, activity_id=activity_id, evidences=evidences, portfolios=portfolios, high_questions=high_questions)


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


@app.post("/teacher/activities/{activity_id}/feature")
def teacher_feature_evidence(activity_id: int, request: Request, evidence_id: int = Form(...), note: str = Form(""), db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["teacher"])
    ev = db.query(Evidence).filter_by(id=evidence_id, activity_id=activity_id).first()
    if ev:
        db.add(FeaturedItem(activity_id=activity_id, teacher_id=user.id, student_id=ev.student_id, evidence_id=ev.id, note=note))
        db.commit()
    return RedirectResponse(f"/teacher/activities/{activity_id}/students", status_code=303)


# -------- Admin --------
@app.get("/admin", response_class=HTMLResponse)
def admin_index(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db); require_role(user, ["admin"])
    users = db.query(User).order_by(User.created_at.desc()).all()
    classes = db.query(Class).all()
    activities = db.query(Activity).order_by(Activity.created_at.desc()).all()
    return render(request, "admin/index.html", user=user, users=users, classes=classes, activities=activities)


# -------- Legacy redirects --------
@app.get("/student/activities", response_class=HTMLResponse)
def student_activities_legacy():
    return RedirectResponse("/student/home", status_code=303)
