# 黄小游——AI研学智能体（Python FastAPI MVP）

本版本基于 Python 技术栈实现可运行 MVP，聚焦真实业务闭环：
**教师建活动 → 学生学研游 → 证据上传入库+落盘 → 学习档案汇总 → 教师评分评语**。

## 1. 技术栈
- Python 3.11+
- FastAPI
- SQLAlchemy
- SQLite
- Jinja2 + Bootstrap
- 本地文件上传目录
- OpenAI 兼容方式接入 DeepSeek API

## 2. 项目结构
```text
pyapp/
  main.py
  config.py
  database.py
  models.py
  services/
    auth.py
    ai.py
    portfolio.py
  scripts/
    init_db.py
    seed_demo.py
  templates/
    auth/
    student/
    teacher/
    admin/
requirements.txt
.env.example
```

## 3. 环境变量
复制 `.env.example` 为 `.env`：
```env
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_API_KEY=
DEEPSEEK_MODEL=deepseek-chat
DATABASE_URL=sqlite:///./huangxiaoyou.db
UPLOAD_DIR=./uploads
SECRET_KEY=replace-with-a-random-secret
```

## 4. 安装与启动
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m pyapp.scripts.init_db
python -m pyapp.scripts.seed_demo
uvicorn pyapp.main:app --reload
```

## 5. 演示账号
- admin / admin123
- teacher / teacher123
- student / student123

## 6. 功能清单（已实现）
### 学生端
- 登录
- 活动列表、活动详情
- 学板块：AI导学问答 + 保存问题
- 研板块：任务查看 + 待验证问题保存
- 游板块点位页：简介、问题链、证据清单、AI问答
- 上传证据：图片保存到本地目录 + 文字证据入库
- 学习档案：由问题/任务/证据真实汇总

### 教师端
- 创建活动
- 编辑活动
- 配置点位
- 配置任务
- 发布活动
- 查看学生证据
- 查看学习档案
- 评分评语

### 后台
- 用户管理（列表）
- 班级管理（列表）
- 活动管理（列表）

## 7. 数据库表（真实建表）
- users
- schools
- classes
- activities
- activity_classes
- activity_sites
- tasks
- activity_members
- question_items
- evidences
- ai_conversations
- portfolios
- portfolio_items

建表代码见 `pyapp/models.py`，初始化脚本见 `pyapp/scripts/init_db.py`。

## 8. 自测场景（A/B/C/D）
- A: 教师登录→新建活动→添加点位/任务→发布
- B: 学生登录→进入活动→AI提问→保存问题
- C: 学生点位页→上传图片+文字证据
- D: 教师查看证据→查看档案→评分评语

## 9. 当前简化与扩展位
- 班级绑定到活动（activity_classes）当前已建表，下一步可补全可视化绑定页面。
- 后台当前为基础版列表管理，可扩展为完整 CRUD。
- AI 为轻量提示注入版本，未做复杂 RAG。
