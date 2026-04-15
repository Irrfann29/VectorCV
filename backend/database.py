import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Change these to match your Postgres credentials
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Irfan23032004@localhost:5432/VectorCV")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get a DB session in your routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()