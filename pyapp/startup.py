from __future__ import annotations

import importlib
import os
from pathlib import Path
from typing import Iterable

REQUIRED_IMPORTS = [
    "fastapi",
    "sqlalchemy",
    "jinja2",
    "starlette",
    "itsdangerous",
    "openai",
    "passlib",
    "multipart",
    "pydantic_settings",
]

REQUIRED_TABLES = {
    "users",
    "schools",
    "classes",
    "activities",
    "activity_classes",
    "activity_sites",
    "tasks",
    "activity_members",
    "question_items",
    "evidences",
    "ai_conversations",
    "portfolios",
    "portfolio_items",
}


def check_python_dependencies() -> list[str]:
    missing: list[str] = []
    for module_name in REQUIRED_IMPORTS:
        try:
            importlib.import_module(module_name)
        except Exception:
            missing.append(module_name)
    return missing


def _get_upload_dir() -> str:
    return os.getenv("UPLOAD_DIR", "./uploads")


def ensure_runtime_dirs(extra_dirs: Iterable[str] | None = None) -> list[Path]:
    dirs = [Path("pyapp/static"), Path("pyapp/templates"), Path(_get_upload_dir())]
    if extra_dirs:
        dirs.extend(Path(d) for d in extra_dirs)

    created: list[Path] = []
    for d in dirs:
        if not d.exists():
            d.mkdir(parents=True, exist_ok=True)
            created.append(d)
    return created


def ensure_database_initialized() -> tuple[bool, list[str]]:
    from sqlalchemy import inspect
    from .database import engine
    from .models import Base

    Base.metadata.create_all(bind=engine)
    inspector = inspect(engine)
    existing = set(inspector.get_table_names())
    missing = sorted(REQUIRED_TABLES - existing)
    return (len(missing) == 0, missing)


def validate_env() -> list[str]:
    issues: list[str] = []
    secret_key = os.getenv("SECRET_KEY", "")
    if not secret_key or secret_key in {"dev-secret", "replace-with-a-random-secret"}:
        issues.append("SECRET_KEY 未设置为安全随机值（开发可继续，生产必须修改）")
    if not os.getenv("DATABASE_URL"):
        issues.append("DATABASE_URL 未设置，默认会使用 sqlite:///./huangxiaoyou.db")
    if not os.getenv("DEEPSEEK_MODEL"):
        issues.append("DEEPSEEK_MODEL 未设置，默认会使用 deepseek-chat")
    if not os.getenv("DEEPSEEK_BASE_URL"):
        issues.append("DEEPSEEK_BASE_URL 未设置，默认会使用 https://api.deepseek.com/v1")
    return issues


def run_preflight(allow_weak_secret: bool = True) -> None:
    missing_deps = check_python_dependencies()
    if missing_deps:
        raise RuntimeError(
            "缺少 Python 依赖: " + ", ".join(missing_deps)
            + "。请运行: pip install -r requirements.txt"
        )

    ensure_runtime_dirs()

    ok, missing_tables = ensure_database_initialized()
    if not ok:
        raise RuntimeError(
            "数据库初始化不完整，缺少表: " + ", ".join(missing_tables)
            + "。请运行: python -m pyapp.scripts.init_db"
        )

    env_issues = validate_env()
    if env_issues and not allow_weak_secret:
        raise RuntimeError("配置检查失败: " + "；".join(env_issues))
