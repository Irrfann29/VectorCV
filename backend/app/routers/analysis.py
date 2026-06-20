from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_db
from app.models.models import User, Resume, Analysis
from app.schemas.schemas import (
    RecommendRequest, GapRequest,
    RecommendResponse, GapResponse,
    DashboardStats, AnalysisHistoryItem, ResumeOut,
)
from app.services.auth_service import get_current_user
from app.services import ai_service

router = APIRouter(prefix="/analysis", tags=["🤖 Analysis"])


def _check_limit(user: User):
    """Raises error if user has hit their monthly analysis limit."""
    if user.analyses_used >= user.analyses_limit:
        raise HTTPException(
            status_code=429,
            detail=(
                f"Monthly limit reached ({user.analyses_limit} analyses). "
                "Upgrade to Pro for unlimited."
            ),
        )


# ── Upload PDF Resume ──────────────────────────────────────────────────────────

@router.post(
    "/upload-resume",
    response_model=ResumeOut,
    status_code=201,
    summary="Upload PDF resume and extract text",
)
async def upload_resume(
    file: UploadFile = File(...),
    version_name: str = Form("Resume v1"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    contents = await file.read()

    # Check file size (max 5MB)
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max size is 5MB")

    # Extract text from PDF
    try:
        import io
        from PyPDF2 import PdfReader
        reader = PdfReader(io.BytesIO(contents))
        text   = "\n".join(page.extract_text() or "" for page in reader.pages).strip()
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read PDF. Try pasting text instead.")

    if not text:
        raise HTTPException(
            status_code=400,
            detail="PDF appears empty or scanned. Please paste your resume text instead."
        )

    resume = Resume(
        user_id=current_user.id,
        raw_text=text,
        version_name=version_name,
        file_name=file.filename,
    )
    db.add(resume)
    await db.flush()
    return ResumeOut.model_validate(resume)


# ── List Resume Versions ───────────────────────────────────────────────────────

@router.get(
    "/resumes",
    response_model=list[ResumeOut],
    summary="Get all resume versions for current user",
)
async def list_resumes(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Resume)
        .where(Resume.user_id == current_user.id)
        .order_by(Resume.uploaded_at.desc())
    )
    return [ResumeOut.model_validate(r) for r in result.scalars().all()]


# ── AI: Job Recommendations ───────────────────────────────────────────────────

@router.post(
    "/recommend",
    response_model=RecommendResponse,
    summary="Get AI job recommendations from resume text",
)
async def recommend(
    body: RecommendRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _check_limit(current_user)

    # Save resume version
    resume = Resume(
        user_id=current_user.id,
        raw_text=body.resume_text,
        version_name=f"Resume v{current_user.analyses_used + 1}",
    )
    db.add(resume)
    await db.flush()

    # Call AI service
    result = await ai_service.analyze_resume(body.resume_text, body.domain, body.level)

    # Save analysis result to DB
    best     = result["recommendations"][0] if result["recommendations"] else {}
    analysis = Analysis(
        user_id=current_user.id,
        resume_id=resume.id,
        type="recommendation",
        profile_summary=result.get("summary"),
        top_skills=result.get("top_skills", []),
        recommendations=result.get("recommendations", []),
        best_match_score=best.get("match"),
        best_match_title=best.get("title"),
    )
    db.add(analysis)

    # Update user's skill list and usage counter
    resume.parsed_skills    = result.get("top_skills", [])
    current_user.analyses_used += 1

    await db.flush()

    return RecommendResponse(
        analysis_id=analysis.id,
        summary=result["summary"],
        top_skills=result["top_skills"],
        recommendations=result["recommendations"],
    )


# ── AI: Gap Analysis ──────────────────────────────────────────────────────────

@router.post(
    "/gap",
    response_model=GapResponse,
    summary="Run gap analysis between resume and job description",
)
async def gap(
    body: GapRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _check_limit(current_user)

    resume = Resume(
        user_id=current_user.id,
        raw_text=body.resume_text,
        version_name=f"Gap Analysis v{current_user.analyses_used + 1}",
    )
    db.add(resume)
    await db.flush()

    result = await ai_service.run_gap_analysis(
        body.resume_text, body.job_description, body.company
    )

    analysis = Analysis(
        user_id=current_user.id,
        resume_id=resume.id,
        type="gap",
        target_company=body.company or None,
        target_jd=body.job_description,
        fit_score=result.get("fit_score"),
        verdict=result.get("verdict"),
        present_keywords=result.get("present_keywords", []),
        missing_keywords=result.get("missing_keywords", []),
        strengths=result.get("strengths", []),
        gaps=result.get("gaps", []),
        action_plan=result.get("action_plan"),
    )
    db.add(analysis)
    current_user.analyses_used += 1
    await db.flush()

    keys = [
        "fit_score", "verdict", "present_keywords",
        "missing_keywords", "strengths", "gaps", "action_plan"
    ]
    return GapResponse(analysis_id=analysis.id, **{k: result[k] for k in keys})


# ── Analysis History ──────────────────────────────────────────────────────────

@router.get(
    "/history",
    response_model=list[AnalysisHistoryItem],
    summary="Get all past analyses for current user",
)
async def history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = await db.execute(
        select(Analysis, Resume.version_name)
        .join(Resume, Analysis.resume_id == Resume.id)
        .where(Analysis.user_id == current_user.id)
        .order_by(Analysis.created_at.desc())
        .limit(20)
    )
    return [
        AnalysisHistoryItem(
            id=a.id,
            type=a.type,
            resume_version=v,
            best_match_score=a.best_match_score,
            best_match_title=a.best_match_title,
            fit_score=a.fit_score,
            target_company=a.target_company,
            created_at=a.created_at,
        )
        for a, v in rows.all()
    ]


# ── Dashboard Stats ───────────────────────────────────────────────────────────

@router.get(
    "/dashboard-stats",
    response_model=DashboardStats,
    summary="Get summary numbers for the dashboard",
)
async def dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = await db.execute(
        select(Analysis, Resume.version_name)
        .join(Resume, Analysis.resume_id == Resume.id)
        .where(Analysis.user_id == current_user.id)
        .order_by(Analysis.created_at.desc())
        .limit(5)
    )

    best_score    = None
    total_matches = 0
    gap_count     = 0
    recent        = []

    for a, v in rows.all():
        if a.type == "recommendation" and a.best_match_score:
            if best_score is None or a.best_match_score > best_score:
                best_score = a.best_match_score
            total_matches += len(a.recommendations or [])

        if a.type == "gap" and a.missing_keywords:
            gap_count = len(a.missing_keywords)

        recent.append(AnalysisHistoryItem(
            id=a.id,
            type=a.type,
            resume_version=v,
            best_match_score=a.best_match_score,
            best_match_title=a.best_match_title,
            fit_score=a.fit_score,
            target_company=a.target_company,
            created_at=a.created_at,
        ))

    return DashboardStats(
        best_match_score=best_score,
        total_matches=total_matches,
        skills_gap_count=gap_count,
        analyses_done=current_user.analyses_used,
        analyses_limit=current_user.analyses_limit,
        recent_analyses=recent,
    )
