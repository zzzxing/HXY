@echo off
setlocal
cd /d "%~dp0"

echo [黄小游V3] 首次启动（小白模式）
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] 未检测到 Node.js，请先安装 Node.js 18+ 后重试。
  pause
  exit /b 1
)

cd legacy\next_v1
if not exist .env.local (
  if exist .env.local.example (
    copy /Y .env.local.example .env.local >nul
    echo [OK] 已创建 .env.local（默认可直接 Demo）
  )
)

call npm install
if errorlevel 1 (
  echo [ERROR] 依赖安装失败，请检查网络后重试。
  pause
  exit /b 1
)

call npm run setup
echo [INFO] 当前若未配置 Supabase/AI，将自动进入 Demo Mode。
call npm run dev
endlocal
