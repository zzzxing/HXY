import json
from datetime import datetime
from sqlalchemy.orm import Session
from ..models import QuestionItem, Evidence, Portfolio, PortfolioItem, Task


def generate_portfolio(db: Session, activity_id: int, student_id: int) -> Portfolio:
    questions = db.query(QuestionItem).filter_by(activity_id=activity_id, student_id=student_id).all()
    evidences = db.query(Evidence).filter_by(activity_id=activity_id, student_id=student_id).all()
    tasks = db.query(Task).filter_by(activity_id=activity_id).order_by(Task.sort_order.asc()).all()

    summary = f"问题{len(questions)}条，证据{len(evidences)}条，任务清单{len(tasks)}项。"
    pf = db.query(Portfolio).filter_by(activity_id=activity_id, student_id=student_id).first()
    if not pf:
        pf = Portfolio(activity_id=activity_id, student_id=student_id, summary=summary, status="draft", updated_at=datetime.utcnow())
        db.add(pf)
        db.commit()
        db.refresh(pf)
    else:
        pf.summary = summary
        pf.updated_at = datetime.utcnow()
        db.commit()

    db.query(PortfolioItem).filter_by(portfolio_id=pf.id).delete()
    for idx, q in enumerate(questions, 1):
        db.add(PortfolioItem(portfolio_id=pf.id, item_type="question", content=json.dumps({"phase": q.phase, "content": q.content}, ensure_ascii=False), sort_order=idx))
    for idx, t in enumerate(tasks, 50):
        db.add(PortfolioItem(portfolio_id=pf.id, item_type="task", content=json.dumps({"phase": t.phase, "title": t.title}, ensure_ascii=False), sort_order=idx))
    for idx, e in enumerate(evidences, 100):
        db.add(PortfolioItem(portfolio_id=pf.id, item_type="evidence", content=json.dumps({"type": e.evidence_type, "note": e.note, "text": e.text_content, "file": e.file_url}, ensure_ascii=False), sort_order=idx))
    db.commit()
    return pf
