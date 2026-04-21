import json
from pyapp.database import SessionLocal, engine
from pyapp.models import Base, School, Class, User, Activity, ActivityMember, ActivitySite, Task
from pyapp.services.auth import hash_password
from pyapp.startup import ensure_runtime_dirs


def seed():
    ensure_runtime_dirs()
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(User).first():
            print("seed skipped: data already exists")
            return

        school = School(name="黄石实验学校")
        db.add(school); db.commit(); db.refresh(school)
        c1 = Class(name="七年级1班", grade="七年级", school_id=school.id)
        db.add(c1); db.commit(); db.refresh(c1)

        admin = User(username="admin", password_hash=hash_password("admin123"), role="admin", name="系统管理员", school_id=school.id)
        teacher = User(username="teacher", password_hash=hash_password("teacher123"), role="teacher", name="李老师", school_id=school.id)
        student = User(username="student", password_hash=hash_password("student123"), role="student", name="张同学", school_id=school.id, class_id=c1.id)
        db.add_all([admin, teacher, student]); db.commit(); db.refresh(teacher); db.refresh(student)

        act = Activity(title="黄石工业文化研学", description="围绕工业文化开展观察研究", theme="工业文化", target_grade="七年级", status="published", teacher_id=teacher.id)
        db.add(act); db.commit(); db.refresh(act)

        db.add(ActivityMember(activity_id=act.id, student_id=student.id))
        db.add_all([
            ActivitySite(activity_id=act.id, name="矿博物馆展厅A", order_index=1, intro="矿石标本区", problem_chain=json.dumps([{"level":"核心问题","content":"哪两种矿石差异最大？"}], ensure_ascii=False), evidence_checklist=json.dumps(["拍2张照片","记录差异"], ensure_ascii=False)),
            ActivitySite(activity_id=act.id, name="矿冶设备陈列区", order_index=2, intro="设备发展区", problem_chain=json.dumps([{"level":"核心问题","content":"设备结构如何变化？"}], ensure_ascii=False), evidence_checklist=json.dumps(["拍设备细节","写一句解释"], ensure_ascii=False)),
        ])
        db.add_all([
            Task(activity_id=act.id, phase="learn", title="导学问题准备", description="提出3个问题", sort_order=1),
            Task(activity_id=act.id, phase="research", title="家庭资料卡", description="整理一条资料", sort_order=2),
            Task(activity_id=act.id, phase="visit", title="现场证据采集", description="上传图片与文字", sort_order=3),
        ])
        db.commit()
        print("seed done: admin/admin123 teacher/teacher123 student/student123")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
