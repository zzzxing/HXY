from datetime import datetime, date
from sqlalchemy import String, ForeignKey, Text, Integer, Boolean, Date, Numeric, UniqueConstraint, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base


class School(Base):
    __tablename__ = "schools"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Class(Base):
    __tablename__ = "classes"
    id: Mapped[int] = mapped_column(primary_key=True)
    school_id: Mapped[int | None] = mapped_column(ForeignKey("schools.id"))
    name: Mapped[str] = mapped_column(String(255))
    grade: Mapped[str | None] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(100), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20))
    name: Mapped[str] = mapped_column(String(100))
    school_id: Mapped[int | None] = mapped_column(ForeignKey("schools.id"))
    class_id: Mapped[int | None] = mapped_column(ForeignKey("classes.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Activity(Base):
    __tablename__ = "activities"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    theme: Mapped[str | None] = mapped_column(String(100))
    target_grade: Mapped[str | None] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(20), default="draft")
    start_date: Mapped[date | None] = mapped_column(Date)
    end_date: Mapped[date | None] = mapped_column(Date)
    teacher_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class ActivityClass(Base):
    __tablename__ = "activity_classes"
    id: Mapped[int] = mapped_column(primary_key=True)
    activity_id: Mapped[int] = mapped_column(ForeignKey("activities.id"))
    class_id: Mapped[int] = mapped_column(ForeignKey("classes.id"))


class ActivitySite(Base):
    __tablename__ = "activity_sites"
    id: Mapped[int] = mapped_column(primary_key=True)
    activity_id: Mapped[int] = mapped_column(ForeignKey("activities.id"))
    name: Mapped[str] = mapped_column(String(255))
    order_index: Mapped[int] = mapped_column(Integer, default=1)
    intro: Mapped[str | None] = mapped_column(Text)
    knowledge_text: Mapped[str | None] = mapped_column(Text)
    key_facts: Mapped[str | None] = mapped_column(Text)
    scene_image: Mapped[str | None] = mapped_column(String(255))
    hotspots: Mapped[str] = mapped_column(Text, default="[]")
    problem_chain: Mapped[str] = mapped_column(Text, default="[]")
    evidence_checklist: Mapped[str] = mapped_column(Text, default="[]")


class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[int] = mapped_column(primary_key=True)
    activity_id: Mapped[int] = mapped_column(ForeignKey("activities.id"))
    site_id: Mapped[int | None] = mapped_column(ForeignKey("activity_sites.id"))
    phase: Mapped[str] = mapped_column(String(20))
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    task_type: Mapped[str] = mapped_column(String(20), default="text")
    sort_order: Mapped[int] = mapped_column(Integer, default=1)
    required: Mapped[bool] = mapped_column(Boolean, default=True)


class ActivityMember(Base):
    __tablename__ = "activity_members"
    __table_args__ = (UniqueConstraint("activity_id", "student_id", name="uq_activity_student"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    activity_id: Mapped[int] = mapped_column(ForeignKey("activities.id"))
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    joined_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class QuestionItem(Base):
    __tablename__ = "question_items"
    id: Mapped[int] = mapped_column(primary_key=True)
    activity_id: Mapped[int] = mapped_column(ForeignKey("activities.id"))
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    site_id: Mapped[int | None] = mapped_column(ForeignKey("activity_sites.id"))
    phase: Mapped[str] = mapped_column(String(20))
    content: Mapped[str] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(20), default="inquiry")
    source: Mapped[str] = mapped_column(String(20), default="student_manual")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Evidence(Base):
    __tablename__ = "evidences"
    id: Mapped[int] = mapped_column(primary_key=True)
    activity_id: Mapped[int] = mapped_column(ForeignKey("activities.id"))
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    site_id: Mapped[int | None] = mapped_column(ForeignKey("activity_sites.id"))
    task_id: Mapped[int | None] = mapped_column(ForeignKey("tasks.id"))
    evidence_type: Mapped[str] = mapped_column(String(20))
    file_url: Mapped[str | None] = mapped_column(Text)
    text_content: Mapped[str | None] = mapped_column(Text)
    note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class BackpackItem(Base):
    __tablename__ = "backpack_items"
    id: Mapped[int] = mapped_column(primary_key=True)
    activity_id: Mapped[int] = mapped_column(ForeignKey("activities.id"))
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    item_type: Mapped[str] = mapped_column(String(20))  # question/hypothesis/conclusion/clue
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class AIConversation(Base):
    __tablename__ = "ai_conversations"
    id: Mapped[int] = mapped_column(primary_key=True)
    activity_id: Mapped[int] = mapped_column(ForeignKey("activities.id"))
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    site_id: Mapped[int | None] = mapped_column(ForeignKey("activity_sites.id"))
    phase: Mapped[str] = mapped_column(String(20))
    mode: Mapped[str] = mapped_column(String(20), default="coach")
    user_message: Mapped[str] = mapped_column(Text)
    ai_message: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Portfolio(Base):
    __tablename__ = "portfolios"
    __table_args__ = (UniqueConstraint("activity_id", "student_id", name="uq_portfolio_activity_student"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    activity_id: Mapped[int] = mapped_column(ForeignKey("activities.id"))
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    summary: Mapped[str | None] = mapped_column(Text)
    teacher_comment: Mapped[str | None] = mapped_column(Text)
    teacher_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    status: Mapped[str] = mapped_column(String(20), default="draft")
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class PortfolioItem(Base):
    __tablename__ = "portfolio_items"
    id: Mapped[int] = mapped_column(primary_key=True)
    portfolio_id: Mapped[int] = mapped_column(ForeignKey("portfolios.id"))
    item_type: Mapped[str] = mapped_column(String(20))
    content: Mapped[str] = mapped_column(Text)
    sort_order: Mapped[int] = mapped_column(Integer, default=1)


class IdentityQuest(Base):
    __tablename__ = "identity_quests"
    id: Mapped[int] = mapped_column(primary_key=True)
    role_name: Mapped[str] = mapped_column(String(50), unique=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)


class StudentQuest(Base):
    __tablename__ = "student_quests"
    __table_args__ = (UniqueConstraint("student_id", "quest_id", name="uq_student_quest"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    quest_id: Mapped[int] = mapped_column(ForeignKey("identity_quests.id"))
    status: Mapped[str] = mapped_column(String(20), default="selected")
    progress: Mapped[int] = mapped_column(Integer, default=0)


class Badge(Base):
    __tablename__ = "badges"
    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(50), unique=True)
    name: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(Text)


class UserBadge(Base):
    __tablename__ = "user_badges"
    __table_args__ = (UniqueConstraint("user_id", "badge_id", name="uq_user_badge"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    badge_id: Mapped[int] = mapped_column(ForeignKey("badges.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class FeaturedItem(Base):
    __tablename__ = "featured_items"
    id: Mapped[int] = mapped_column(primary_key=True)
    activity_id: Mapped[int] = mapped_column(ForeignKey("activities.id"))
    teacher_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    evidence_id: Mapped[int | None] = mapped_column(ForeignKey("evidences.id"))
    note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
