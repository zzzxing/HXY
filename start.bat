@echo off
setlocal
cd /d "%~dp0\legacy\next_v1"

echo [黄小游V3] 日常启动
if not exist .env.local (
  if exist .env.local.example copy /Y .env.local.example .env.local >nul
)
call npm run dev
endlocal
