from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    picture = Column(String) # For that profile pic in your dashboard

class Analysis(Base):
    __tablename__ = "analyses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    match_score = Column(Integer)
    # Storing skills and gaps as JSON makes it easy to send to React
    skills_strength = Column(JSON) 
    job_matches = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())