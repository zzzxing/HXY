# 黄小游——AI研学智能体（Python FastAPI 版）

> 面向零基础用户：按本文步骤执行即可启动。

本项目是一个可运行 MVP，真实支持：
- 教师创建活动、配置点位/任务、发布活动
- 学生参与活动、AI 提问、保存问题、上传图片+文字证据
- 系统汇总学习档案
- 教师查看证据并评分评语

---

## 1. 你会用到的技术（你不需要全懂）
- Python 3.11+
- FastAPI + Jinja2 页面
- SQLite 本地数据库
- 本地文件上传目录
- DeepSeek（OpenAI 兼容接口）

---

## 2. 必备文件说明
- `requirements.txt`：依赖清单（已补齐 `itsdangerous`）
- `.env.example`：环境变量模板
- `pyapp/scripts/init_db.py`：数据库初始化
- `pyapp/scripts/seed_demo.py`：导入演示数据
- `pyapp/scripts/preflight.py`：启动前自检（依赖/目录/数据库/配置）

---

## 3. 环境变量（先做这一步）
复制 `.env.example` 为 `.env`，然后按需修改：

```env
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_API_KEY=
DEEPSEEK_MODEL=deepseek-chat
DATABASE_URL=sqlite:///./huangxiaoyou.db
UPLOAD_DIR=./uploads
SECRET_KEY=replace-with-a-random-secret
```

---

## 4. 首次运行（Windows PowerShell）
> 必须按顺序执行，不要跳步。

### 第 1 步：创建虚拟环境
```powershell
python -m venv .venv
```

### 第 2 步：激活虚拟环境
```powershell
.\.venv\Scripts\Activate.ps1
```

### 第 3 步：安装依赖
```powershell
pip install -r requirements.txt
```

### 第 4 步：运行启动前自检（推荐）
```powershell
python -m pyapp.scripts.preflight
```

### 第 5 步：初始化数据库
```powershell
python -m pyapp.scripts.init_db
```

### 第 6 步：导入演示数据
```powershell
python -m pyapp.scripts.seed_demo
```

### 第 7 步：启动服务
```powershell
uvicorn pyapp.main:app --reload
```

浏览器打开：`http://127.0.0.1:8000`

演示账号：
- admin / admin123
- teacher / teacher123
- student / student123

---

## 5. 以后日常启动（Windows PowerShell）
> 数据库初始化和导入演示数据通常只需首次执行一次。

```powershell
.\.venv\Scripts\Activate.ps1
python -m pyapp.scripts.preflight
uvicorn pyapp.main:app --reload
```

---

## 6. 这个项目已经自动处理的“补坑项”
你不需要手动创建这些目录，项目会自动创建：
- `pyapp/static`
- `pyapp/templates`（目录存在检查）
- `UPLOAD_DIR` 指向的上传目录（默认 `./uploads`）

另外，启动时会自动确保数据库表存在（幂等）。

---

## 7. 常见问题
### Q1：报错 `No module named 'itsdangerous'`
A：依赖已写入 `requirements.txt`。重新执行：
```powershell
pip install -r requirements.txt
```

### Q2：报错 `Directory 'pyapp/static' does not exist`
A：代码已加入自动创建逻辑。如果仍报错，先运行：
```powershell
python -m pyapp.scripts.preflight
```

### Q3：我没有 DeepSeek Key，能先跑吗？
A：可以先不提 AI 问答，其他功能可演示。要体验 AI 问答需填写 `DEEPSEEK_API_KEY`。

---

## 8. 功能范围（MVP）
### 学生端
- 登录
- 活动列表/详情
- 学板块：AI导学问答 + 问题保存
- 研板块：任务查看 + 待验证问题
- 游板块点位页：简介、问题链、证据清单、AI问答
- 上传证据（图片 + 文字）
- 学习档案查看（问题/任务/证据真实汇总）

### 教师端
- 创建活动
- 编辑活动
- 配置点位
- 配置任务
- 发布活动
- 查看学生证据
- 查看学习档案并评分评语

### 后台
- 用户管理基础页
- 班级管理基础页
- 活动管理基础页

---

## 9. 文件结构（核心）
```text
pyapp/
  main.py
  startup.py
  models.py
  database.py
  config.py
  services/
  scripts/
  templates/
```
