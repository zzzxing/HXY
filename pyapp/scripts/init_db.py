from pyapp.database import engine
from pyapp.models import Base
from pyapp.startup import ensure_runtime_dirs


def main() -> int:
    ensure_runtime_dirs()
    Base.metadata.create_all(bind=engine)
    print("[OK] 数据库和运行目录已初始化")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
