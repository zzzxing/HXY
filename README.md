# 黄小游 V3（统一版）

> 当前唯一主运行方案：**Next.js 前端（legacy/next_v1）**。
>
> 从本版本开始，不再把 Python FastAPI 当作主前端启动入口。

---

## 1. 先说结论（零基础看这里）

- 你现在只需要启动 **Next.js**。
- 目录：`legacy/next_v1`
- 访问地址：`http://localhost:3000`
- 根目录已提供 Windows 一键脚本：
  - `start_v3_first_time.bat`（首次安装 + 启动）
  - `start_v3.bat`（以后日常启动）

---

## 2. 版本收口说明

### V3 主路线（唯一）

- **主前端：Next.js（App Router）**
- 学生端、教师端、管理端统一由 Next.js 承载。

### Python 代码的角色

- `pyapp/` 目前是历史阶段的 Python 实现与参考代码。
- **不作为 V3 主启动入口**。
- 仅在你后续需要迁移接口逻辑时参考，不影响 V3 正常启动。

---

## 3. 启动收口（Windows 一键）

> 要求：已安装 Node.js 18+（推荐 20 LTS）。

### 3.1 首次启动（第一次用这台电脑）

双击运行：

```text
start_v3_first_time.bat
```

这个脚本会自动做：
1. 检查 Node/npm
2. 自动复制环境变量模板（如果没有 `.env.local`）
3. 自动安装依赖 `npm install`
4. 自动执行 `npm run dev`

### 3.2 以后日常启动

双击运行：

```text
start_v3.bat
```

这个脚本会直接进入 Next.js 目录并启动开发服务。

---

## 4. 环境变量（Next.js）

在 `legacy/next_v1` 目录中使用 `.env.local`。

如果不存在，首次脚本会根据 `.env.local.example` 自动生成。

必填（Supabase）：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

AI（可选）：
- `OPENAI_BASE_URL`（默认可不填）
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

---

## 5. AI Key 没配能不能运行？

**能运行。**

- 不配置 `OPENAI_API_KEY` 时，页面仍可访问，主流程可演示。
- AI 对话相关能力会返回降级提示，不会阻塞基础教学流程。

---

## 6. 学生端 UI 验收标准（V3）

当前迭代按照“课堂云游前台”标准推进，学生端必须覆盖并持续强化以下页面体验：

1. 首页（课堂引导与任务入口）
2. 路线/地图页（云游路径与场景导航）
3. 点位探索页（沉浸式内容 + 提问/证据）
4. 证据背包页（学习证据聚合）
5. 学习档案页（过程与成果展示）

> 说明：教师端允许后台风格；学生端不再按“管理系统白卡列表”方向交付。

---

## 7. 手动启动（可选）

如果你不想双击脚本，也可以手动执行：

```bash
cd legacy/next_v1
cp .env.local.example .env.local   # Windows 下可手动复制文件
npm install
npm run dev
```

---

## 8. 当前版本到底怎么启动（最终答案）

- **前端主路线：Next.js（`legacy/next_v1`）**
- **推荐启动方式：根目录一键脚本**
  - 首次：`start_v3_first_time.bat`
  - 日常：`start_v3.bat`
- **Python (`pyapp/`) 不是当前主启动路径**
