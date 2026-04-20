# 黄小游——AI研学智能体（MVP）

本项目已实现“教师建活动 → 学生学研游执行 → 证据上传 → 学习档案汇总 → 教师评价”的可运行链路，不是静态演示壳子。

## 技术栈
- Next.js 14（App Router）+ TypeScript
- Tailwind CSS + 基础 UI 组件
- Supabase Auth + Postgres + Storage
- OpenAI-compatible API（`OPENAI_BASE_URL/KEY/MODEL`）

## 快速开始
### 1）安装依赖
```bash
npm install
```

### 2）配置环境变量
复制 `.env.example` 为 `.env.local`：
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_BASE_URL=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

### 3）初始化数据库
1. 在 Supabase SQL Editor 执行 `database.sql`
2. 在 Supabase Auth 创建 admin/teacher/student 账号
3. 用真实 UUID 写入 `profiles`
4. 执行 `supabase/seed.sql`（将 `<...-uuid>` 替换为真实值）

### 4）启动
```bash
npm run dev
```

## MVP 功能清单（真实落库）
### 学生端
- 登录
- 活动列表/详情（真实读取 `activities + activity_members`）
- 学板块：AI问答 + 保存问题（`ai_conversations`、`question_items`）
- 研板块：任务查看 + 待验证问题记录
- 游板块：点位列表、证据数与完成状态（`evidences`、`site_progresses`）
- 点位学习卡：点位简介、问题链、证据清单（`activity_sites`）
- 证据上传：图片入 Supabase Storage + 文字入库（`evidences`）
- 学习档案：由问题/任务/证据/点位完成情况生成（`portfolios + portfolio_items`）

### 教师端
- 创建活动
- 绑定班级并同步活动成员（`activity_classes` + `activity_members`）
- 配置点位与任务
- 发布活动
- 查看学生证据、点位完成记录
- 评价学习档案（评分+评语）

### 后台
- 用户管理页（`profiles`）
- 学校/班级页（`schools/classes`）
- 资源模板页（真实 CRUD：`resource_templates`）

## 演示链路（A→D）
### A 教师建活动
1. teacher 登录
2. 创建活动
3. 添加2个点位
4. 添加3个任务
5. 绑定班级并同步成员
6. 发布活动

### B 学生完成导学
1. student 登录
2. 进入活动
3. AI提问
4. 保存至少2个问题

### C 学生现场学习
1. 进入点位页
2. 查看问题链与证据清单
3. 上传1张图片 + 1条文字
4. 标记点位完成

### D 教师查看结果
1. 教师进入学生过程页
2. 查看证据与点位完成记录
3. 查看学习档案
4. 写评语并评分

## 当前简化与扩展位
- 扫码入口目前支持“模拟扫码链接进入点位页”，二维码生成/扫描器留作下一版本。
- 录音字段已在数据库支持，前端本版优先图片+文字。
- AI 为轻量上下文注入，不含复杂 RAG。
