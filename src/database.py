from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import DATABASE_URL
import time
from sqlalchemy.exc import OperationalError

engine = None

for i in range(10):
    try:
        engine = create_engine(DATABASE_URL)
        connection = engine.connect()
        connection.close()
        print("✅ Connected to MySQL")
        break
    except OperationalError:
        print("⏳ Waiting for MySQL...")
        time.sleep(3)
else:
    raise Exception("❌ Could not connect to MySQL after multiple attempts")

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()