from openai import OpenAI
from sqlalchemy.orm import Session
from ..config import settings
from ..models import Activity, ActivitySite, Task, AIConversation


def ask_deepseek(
    db: Session,
    *,
    activity_id: int,
    site_id: int | None,
    phase: str,
    task_text: str | None,
    question: str,
    student_id: int,
) -> str:
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    site = db.query(ActivitySite).filter(ActivitySite.id == site_id).first() if site_id else None
    if not task_text:
        task = db.query(Task).filter(Task.activity_id == activity_id, Task.phase == phase).order_by(Task.sort_order.asc()).first()
        task_text = task.title if task else ""

    system_prompt = (
        "你是黄小游，面向中小学生。"
        "不要直接给最终答案，不要代写整份成果。"
        "请简洁回答，并通过提问引导学生观察、比较、记录证据、形成解释。"
        f"活动: {activity.title if activity else ''}; 点位: {site.name if site else '无'}; 阶段: {phase}; 当前任务: {task_text or ''}."
    )

    client = OpenAI(base_url=settings.deepseek_base_url, api_key=settings.deepseek_api_key)
    completion = client.chat.completions.create(
        model=settings.deepseek_model,
        messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": question}],
        temperature=0.4,
    )
    reply = completion.choices[0].message.content or "你先告诉我你观察到的两个细节，我们一起分析。"

    db.add(
        AIConversation(
            activity_id=activity_id,
            student_id=student_id,
            site_id=site_id,
            phase=phase,
            user_message=question,
            ai_message=reply,
        )
    )
    db.commit()
    return reply
