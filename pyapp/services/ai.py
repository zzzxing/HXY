from openai import OpenAI
from sqlalchemy.orm import Session
from ..config import settings
from ..models import Activity, ActivitySite, Task, AIConversation


FALLBACK_NO_KEY = "当前未配置 AI 服务（缺少 DEEPSEEK_API_KEY），你可以先完成地图探索、任务与证据记录。"
FALLBACK_UNAVAILABLE = "AI 服务暂时不可用，请稍后重试。你可以先继续观察点位并记录证据。"


def ask_deepseek(
    db: Session,
    *,
    activity_id: int,
    site_id: int | None,
    phase: str,
    task_text: str | None,
    question: str,
    student_id: int,
    mode: str = "coach",
) -> str:
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    site = db.query(ActivitySite).filter(ActivitySite.id == site_id).first() if site_id else None

    if not task_text:
        task = db.query(Task).filter(Task.activity_id == activity_id, Task.phase == phase).order_by(Task.sort_order.asc()).first()
        task_text = task.title if task else ""

    if mode == "guide":
        role_prompt = "你是AI导游，帮学生理解背景、看点与观察角度。"
    else:
        role_prompt = "你是AI探究教练，重点引导学生提出证据和解释。"

    system_prompt = (
        f"{role_prompt}"
        "回答要简洁，适合中小学生；不要直接给最终标准答案，不要代写。"
        "多用启发式提问，引导观察、比较、记录证据。"
        f"活动: {activity.title if activity else ''}; 点位: {site.name if site else '无'}; 阶段: {phase}; 当前任务: {task_text or ''}."
    )

    if not settings.deepseek_api_key.strip():
        reply = FALLBACK_NO_KEY
    else:
        try:
            client = OpenAI(base_url=settings.deepseek_base_url, api_key=settings.deepseek_api_key)
            completion = client.chat.completions.create(
                model=settings.deepseek_model,
                messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": question}],
                temperature=0.4,
            )
            reply = completion.choices[0].message.content or "你先告诉我你观察到的两个细节，我们一起分析。"
        except Exception:
            reply = FALLBACK_UNAVAILABLE

    db.add(
        AIConversation(
            activity_id=activity_id,
            student_id=student_id,
            site_id=site_id,
            phase=phase,
            mode=mode,
            user_message=question,
            ai_message=reply,
        )
    )
    db.commit()
    return reply
