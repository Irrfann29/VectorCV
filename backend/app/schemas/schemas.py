from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional


# ── AUTH SCHEMAS ───────────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    name:     str
    email:    EmailStr
    password: str
    role:     str = "jobseeker"

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v

    @field_validator("role")
    @classmethod
    def valid_role(cls, v):
        if v not in ("jobseeker", "recruiter"):
            raise ValueError("Role must be jobseeker or recruiter")
        return v


class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password:     str

    @field_validator("new_password")
    @classmethod
    def password_min_length(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None


class UserOut(BaseModel):
    id:             int
    name:           str
    email:          str
    role:           str
    analyses_used:  int
    analyses_limit: int
    created_at:     datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    user:         UserOut


# ── RESUME SCHEMAS ─────────────────────────────────────────────────────────────

class ResumeOut(BaseModel):
    id:            int
    version_name:  str
    parsed_skills: list[str]
    file_name:     Optional[str]
    uploaded_at:   datetime

    class Config:
        from_attributes = True


# ── ANALYSIS SCHEMAS ───────────────────────────────────────────────────────────

class RecommendRequest(BaseModel):
    resume_text: str
    domain:      str = ""
    level:       str = "fresher"


class GapRequest(BaseModel):
    resume_text:     str
    job_description: str
    company:         str = ""


class JobRecommendation(BaseModel):
    title:         str
    match:         int
    why:           str
    skills_needed: list[str]
    level:         str


class RecommendResponse(BaseModel):
    analysis_id:     int
    summary:         str
    top_skills:      list[str]
    recommendations: list[JobRecommendation]


class GapResponse(BaseModel):
    analysis_id:      int
    fit_score:        int
    verdict:          str
    present_keywords: list[str]
    missing_keywords: list[str]
    strengths:        list[str]
    gaps:             list[str]
    action_plan:      str


class AnalysisHistoryItem(BaseModel):
    id:               int
    type:             str
    resume_version:   str
    best_match_score: Optional[float]
    best_match_title: Optional[str]
    fit_score:        Optional[float]
    target_company:   Optional[str]
    created_at:       datetime

    class Config:
        from_attributes = True


# ── JOB SCHEMAS ────────────────────────────────────────────────────────────────

class JobOut(BaseModel):
    id:              int
    title:           str
    company:         str
    location:        str
    description:     str
    skills_required: list[str]
    domain:          str
    level:           str
    salary_min:      Optional[float]
    salary_max:      Optional[float]
    apply_url:       Optional[str]
    posted_at:       datetime
    match_score:     Optional[int] = None

    class Config:
        from_attributes = True


class SaveJobRequest(BaseModel):
    job_id: int
    note:   str = ""


class SavedJobOut(BaseModel):
    id:       int
    job:      JobOut
    note:     Optional[str]
    saved_at: datetime

    class Config:
        from_attributes = True


# ── DASHBOARD SCHEMAS ──────────────────────────────────────────────────────────

class DashboardStats(BaseModel):
    best_match_score: Optional[float]
    total_matches:    int
    skills_gap_count: int
    analyses_done:    int
    analyses_limit:   int
    recent_analyses:  list[AnalysisHistoryItem]
