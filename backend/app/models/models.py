from datetime import datetime
from sqlalchemy import (
    String, Integer, Float, Boolean,
    DateTime, Text, ForeignKey, JSON, Enum as SAEnum
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
import enum


# ── Enums ──────────────────────────────────────────────────────────────────────

class UserRole(str, enum.Enum):
    jobseeker = "jobseeker"
    recruiter  = "recruiter"


# ── Tables ─────────────────────────────────────────────────────────────────────

class User(Base):
    """
    Stores registered users.
    role = jobseeker → can upload resume, get job matches
    role = recruiter  → can view candidates (future feature)
    """
    __tablename__ = "users"

    id:               Mapped[int]       = mapped_column(Integer,      primary_key=True, index=True)
    name:             Mapped[str]       = mapped_column(String(100))
    email:            Mapped[str]       = mapped_column(String(255),  unique=True, index=True)
    hashed_password:  Mapped[str]       = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="jobseeker")
    is_active:        Mapped[bool]      = mapped_column(Boolean,      default=True)
    analyses_used:    Mapped[int]       = mapped_column(Integer,      default=0)
    analyses_limit:   Mapped[int]       = mapped_column(Integer,      default=5)
    created_at:       Mapped[datetime]  = mapped_column(DateTime,     default=datetime.utcnow)

    # One user → many resumes and saved jobs
    resumes:    Mapped[list["Resume"]]   = relationship("Resume",   back_populates="user", cascade="all, delete")
    saved_jobs: Mapped[list["SavedJob"]] = relationship("SavedJob", back_populates="user", cascade="all, delete")


class Resume(Base):
    """
    Stores resume text uploaded by users.
    Each analysis creates a new resume version.
    """
    __tablename__ = "resumes"

    id:            Mapped[int]       = mapped_column(Integer,     primary_key=True, index=True)
    user_id:       Mapped[int]       = mapped_column(Integer,     ForeignKey("users.id"), index=True)
    version_name:  Mapped[str]       = mapped_column(String(100), default="Resume v1")
    raw_text:      Mapped[str]       = mapped_column(Text)
    parsed_skills: Mapped[list]      = mapped_column(JSON,        default=list)
    file_name:     Mapped[str|None]  = mapped_column(String(200), nullable=True)
    uploaded_at:   Mapped[datetime]  = mapped_column(DateTime,    default=datetime.utcnow)

    user:     Mapped["User"]           = relationship("User",     back_populates="resumes")
    analyses: Mapped[list["Analysis"]] = relationship("Analysis", back_populates="resume", cascade="all, delete")


class Analysis(Base):
    """
    Stores results of AI analysis.
    type = "recommendation" → job matching results
    type = "gap"            → gap analysis results
    """
    __tablename__ = "analyses"

    id:        Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id:   Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    resume_id: Mapped[int] = mapped_column(Integer, ForeignKey("resumes.id"), index=True)
    type:      Mapped[str] = mapped_column(String(20))       # "recommendation" | "gap"
    status:    Mapped[str] = mapped_column(String(20), default="completed")

    # Job recommendation fields
    profile_summary:  Mapped[str|None]   = mapped_column(Text,        nullable=True)
    top_skills:       Mapped[list]        = mapped_column(JSON,        default=list)
    recommendations:  Mapped[list]        = mapped_column(JSON,        default=list)
    best_match_score: Mapped[float|None]  = mapped_column(Float,       nullable=True)
    best_match_title: Mapped[str|None]    = mapped_column(String(100), nullable=True)

    # Gap analysis fields
    target_company:   Mapped[str|None]   = mapped_column(String(100), nullable=True)
    target_jd:        Mapped[str|None]   = mapped_column(Text,        nullable=True)
    fit_score:        Mapped[float|None] = mapped_column(Float,       nullable=True)
    verdict:          Mapped[str|None]   = mapped_column(Text,        nullable=True)
    present_keywords: Mapped[list]       = mapped_column(JSON,        default=list)
    missing_keywords: Mapped[list]       = mapped_column(JSON,        default=list)
    strengths:        Mapped[list]       = mapped_column(JSON,        default=list)
    gaps:             Mapped[list]       = mapped_column(JSON,        default=list)
    action_plan:      Mapped[str|None]   = mapped_column(Text,        nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    resume: Mapped["Resume"] = relationship("Resume", back_populates="analyses")


class Job(Base):
    """
    Stores job listings.
    source = "seeded"  → added by seed.py
    source = "adzuna"  → fetched from Adzuna API
    """
    __tablename__ = "jobs"

    id:              Mapped[int]        = mapped_column(Integer,     primary_key=True, index=True)
    external_id:     Mapped[str|None]   = mapped_column(String(100), nullable=True, unique=True)
    title:           Mapped[str]        = mapped_column(String(150), index=True)
    company:         Mapped[str]        = mapped_column(String(100))
    location:        Mapped[str]        = mapped_column(String(100))
    description:     Mapped[str]        = mapped_column(Text)
    skills_required: Mapped[list]       = mapped_column(JSON,  default=list)
    domain:          Mapped[str]        = mapped_column(String(50),  index=True)
    level:           Mapped[str]        = mapped_column(String(20),  default="junior", index=True)
    salary_min:      Mapped[float|None] = mapped_column(Float,       nullable=True)
    salary_max:      Mapped[float|None] = mapped_column(Float,       nullable=True)
    apply_url:       Mapped[str|None]   = mapped_column(String(500), nullable=True)
    is_active:       Mapped[bool]       = mapped_column(Boolean,     default=True)
    source:          Mapped[str]        = mapped_column(String(20),  default="seeded")
    posted_at:       Mapped[datetime]   = mapped_column(DateTime,    default=datetime.utcnow)

    saved_by: Mapped[list["SavedJob"]] = relationship("SavedJob", back_populates="job", cascade="all, delete")


class SavedJob(Base):
    """
    Junction table — user saves a job for later.
    """
    __tablename__ = "saved_jobs"

    id:       Mapped[int]       = mapped_column(Integer,     primary_key=True, index=True)
    user_id:  Mapped[int]       = mapped_column(Integer,     ForeignKey("users.id"), index=True)
    job_id:   Mapped[int]       = mapped_column(Integer,     ForeignKey("jobs.id"),  index=True)
    note:     Mapped[str|None]  = mapped_column(String(200), nullable=True)
    saved_at: Mapped[datetime]  = mapped_column(DateTime,    default=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="saved_jobs")
    job:  Mapped["Job"]  = relationship("Job",  back_populates="saved_by")
