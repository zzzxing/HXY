# 黄小游 V3 本地演示版（小白友好）

## 1）这是什么
这是一个适合课堂“云游学习”的网页演示平台：学生可以看路线、探索点位、收集证据、生成学习档案，老师可以看进度和作品。

---

## 2）我是小白，怎么启动（最短步骤）
### 第一次启动
1. 双击根目录 `start-first-time.bat`
2. 等待窗口自动安装并启动
3. 浏览器打开：`http://localhost:3000`

### 以后每天启动
1. 双击根目录 `start.bat`
2. 打开：`http://localhost:3000`

> 你不需要手动进目录，不需要先懂 Supabase，不需要先配 AI Key。

---

## 3）如果我什么都不配置，能不能用？
**可以。**

系统会自动进入 **Demo Mode（本地演示模式）**：
- 可以登录并进入学生端、教师端演示
- 可以看完整页面和主流程
- 数据只保存在本地演示内存中
- 不会同步到云端

页面顶部会显示提示：
- “当前为本地演示模式”
- “未连接 Supabase，数据不会同步到云端”

---

## 4）以后想接云服务（进阶）
当你准备好后，再配置 `legacy/next_v1/.env.local`：

### Supabase（可选增强）
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### AI（可选增强）
- `OPENAI_API_KEY` 或 `DEEPSEEK_API_KEY`
- `OPENAI_BASE_URL`（按服务商填写）
- `OPENAI_MODEL`

配置后重启即可自动切换到云服务模式。

---

## 5）Demo Mode 下能演示哪些页面
### 学生端
- 首页 / 活动入口：`/student/activities`
- 云游路线 / 地图页：`/student/activities/demo-activity-1/visit`
- 点位探索页：`/student/sites/site-1`
- 证据背包（在点位探索页内上传）
- 学习档案页：`/student/activities/demo-activity-1/portfolio`

### 教师端
- 教师入口：`/teacher/activities/new`
- 学生进度与作品查看：`/teacher/activities/demo-activity-1/students`

---

## 6）常见问题（小白版）
### Q1：页面打不开怎么办？
- 看启动窗口有没有报错
- 确认地址是 `http://localhost:3000`
- 如果端口被占用，关闭其他 Node/Next 窗口后重试

### Q2：为什么一直显示 Demo Mode？
因为你还没配置 Supabase（这是正常的）。

### Q3：为什么 AI 回答说“未配置 AI 服务”？
因为你没有配置 `OPENAI_API_KEY` 或 `DEEPSEEK_API_KEY`。这不影响演示。

### Q4：我不想看命令行，可以只双击吗？
可以，直接双击：
- 首次：`start-first-time.bat`
- 日常：`start.bat`

---

## 7）给开发者的最少补充
主前端唯一入口：`legacy/next_v1`。

可用脚本：
- `npm run dev`
- `npm run setup`
- `npm run demo`
- `npm run doctor`
