from pyapp.startup import check_python_dependencies, ensure_runtime_dirs, ensure_database_initialized, validate_env


def main() -> int:
    print("[预检] 开始启动前自检...")

    missing_deps = check_python_dependencies()
    if missing_deps:
        print("[失败] 缺少依赖:", ", ".join(missing_deps))
        print("请先执行: pip install -r requirements.txt")
        return 1
    print("[通过] 依赖检查")

    created = ensure_runtime_dirs()
    if created:
        print("[通过] 已自动创建目录:", ", ".join(str(p) for p in created))
    else:
        print("[通过] 运行目录已存在")

    ok, missing_tables = ensure_database_initialized()
    if not ok:
        print("[失败] 数据库缺少表:", ", ".join(missing_tables))
        print("请执行: python -m pyapp.scripts.init_db")
        return 1
    print("[通过] 数据库检查")

    env_issues = validate_env()
    if env_issues:
        print("[提醒] 配置项存在建议修正:")
        for i in env_issues:
            print(" -", i)
    else:
        print("[通过] 环境变量检查")

    print("[预检] 完成，可启动服务")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
