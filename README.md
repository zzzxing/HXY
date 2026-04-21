# 黄小游 V2（Python FastAPI 数字研学平台）

> 当前主版本：**V2 Python 课堂版**（虚拟地图 + 探索点位 + 任务 + 背包 + 成就 + 教师驾驶舱）

## 1. V2 新增亮点
- 学生端 5 主入口：**首页 / 地图 / 任务 / 背包 / 我的**
- 点位探索页重构：场景区、热点探索、AI导游、AI探究教练、问题链、证据清单、上传证据
- 身份任务 Quest：小记者 / 城市观察员 / 工业遗产解码员
- 成就徽章：首次提问、首次证据上传、证据达人、连续探索、最佳观察者
- 教师驾驶舱：参与人数、证据总数、高频问题、待点评档案、精选展示
- 教师精选展示：把优秀证据置顶给全班展示

## 2. 目录（已收敛）
```text
pyapp/                 # Python 主应用（V2）
  main.py
  models.py
  services/
  scripts/
  templates/
  static/
legacy/next_v1/        # 历史 Next/Supabase 代码（已收纳）
requirements.txt
.env.example
README.md
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

## 4. 首次运行（Windows PowerShell）
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m pyapp.scripts.preflight
python -m pyapp.scripts.init_db
python -m pyapp.scripts.seed_demo
uvicorn pyapp.main:app --reload
```
访问：`http://127.0.0.1:8000`

演示账号：
- admin / admin123
- teacher / teacher123
- student / student123

## 5. 日常启动（Windows PowerShell）
```powershell
.\.venv\Scripts\Activate.ps1
python -m pyapp.scripts.preflight
uvicorn pyapp.main:app --reload
```

## 6. 推荐演示路径（V2）
### 路径 A：学生探索流程
1. 学生登录 → 首页
2. 进入地图页 → 点位探索页
3. 分别使用 AI 导游 / AI 探究教练
4. 上传 1 张图片 + 1 条文字证据
5. 打开背包页查看证据与卡片
6. 打开“我的”查看徽章与档案

### 路径 B：任务驱动流程
1. 进入任务页
2. 选择身份任务
3. 标记完成任务
4. 查看徽章变化

### 路径 C：教师课堂流程
1. 教师登录 → 驾驶舱
2. 查看参与人数、证据数、高频问题
3. 进入学情页
4. 将 1 条证据设为精选展示
5. 评分并写评语

## 7. 启动保障（自动化）
- 自动检查依赖（含 itsdangerous）
- 自动创建目录：`pyapp/static`、`pyapp/templates`、`UPLOAD_DIR`
- 自动确保数据库表存在（幂等）
- 预检命令：
```powershell
python -m pyapp.scripts.preflight
```

## 8. 常见问题
### 报错：No module named 'itsdangerous'
执行：
```powershell
pip install -r requirements.txt
```

### 报错：Directory 'pyapp/static' does not exist
先执行：
```powershell
python -m pyapp.scripts.preflight
```
