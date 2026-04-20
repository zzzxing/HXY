from pyapp.database import engine
from pyapp.models import Base


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("database tables created")
