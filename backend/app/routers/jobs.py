from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload

from app.db.database import get_db
from app.models.models import User, Job, SavedJob, Resume
from app.schemas.schemas import JobOut, SaveJobRequest, SavedJobOut
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/jobs", tags=["💼 Jobs"])


def compute_match_score(user_skills: list[str], job_skills: list[str]) -> int:
    """
    Simple keyword overlap score between user skills and job requirements.
    Range: 10 - 98
    """
    if not job_skills:
        return 50
    user_lower = {s.lower() for s in user_skills}
    job_lower  = {s.lower() for s in job_skills}
    overlap    = len(user_lower & job_lower)
    score      = int((overlap / len(job_lower)) * 100)
    return max(10, min(score, 98))


@router.get(
    "/",
    response_model=list[JobOut],
    summary="List all jobs with optional filters and match scores",
)
async def list_jobs(
    domain: str = Query("", description="fullstack | backend | frontend | data | devops | mobile"),
    level:  str = Query("", description="fresher | junior | mid | senior"),
    search: str = Query("", description="Search by job title or company name"),
    limit:  int = Query(50, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Build query with filters
    query = select(Job).where(Job.is_active == True)
    if domain: query = query.where(Job.domain == domain)
    if level:  query = query.where(Job.level  == level)
    query = query.order_by(Job.posted_at.desc()).limit(limit)

    result = await db.execute(query)
    jobs   = result.scalars().all()

    # Apply search filter
    if search:
        s    = search.lower()
        jobs = [j for j in jobs if s in j.title.lower() or s in j.company.lower()]

    # Get user's latest skills for match scoring
    resume_row    = await db.execute(
        select(Resume)
        .where(Resume.user_id == current_user.id)
        .order_by(Resume.uploaded_at.desc())
        .limit(1)
    )
    latest_resume = resume_row.scalar_one_or_none()
    user_skills   = latest_resume.parsed_skills if latest_resume else []

    # Attach match score to each job
    result_list = []
    for job in jobs:
        job_out            = JobOut.model_validate(job)
        job_out.match_score = compute_match_score(user_skills, job.skills_required)
        result_list.append(job_out)

    # Sort by match score (highest first)
    result_list.sort(key=lambda j: j.match_score or 0, reverse=True)
    return result_list


@router.get(
    "/{job_id}",
    response_model=JobOut,
    summary="Get a single job by ID",
)
async def get_job(
    job_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    row = await db.execute(select(Job).where(Job.id == job_id, Job.is_active == True))
    job = row.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return JobOut.model_validate(job)


@router.post(
    "/save",
    status_code=201,
    summary="Save a job to bookmarks",
)
async def save_job(
    body: SaveJobRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check job exists
    row = await db.execute(select(Job).where(Job.id == body.job_id))
    if not row.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Job not found")

    # Check already saved
    existing = await db.execute(
        select(SavedJob).where(
            SavedJob.user_id == current_user.id,
            SavedJob.job_id  == body.job_id,
        )
    )
    if existing.scalar_one_or_none():
        return {"message": "Already saved"}

    db.add(SavedJob(
        user_id=current_user.id,
        job_id=body.job_id,
        note=body.note or None,
    ))
    return {"message": "Job saved successfully"}


@router.delete(
    "/save/{job_id}",
    summary="Remove a job from bookmarks",
)
async def unsave_job(
    job_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await db.execute(
        delete(SavedJob).where(
            SavedJob.user_id == current_user.id,
            SavedJob.job_id  == job_id,
        )
    )
    return {"message": "Removed from saved jobs"}


@router.get(
    "/saved/list",
    response_model=list[SavedJobOut],
    summary="Get all saved/bookmarked jobs",
)
async def get_saved_jobs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = await db.execute(
        select(SavedJob)
        .options(selectinload(SavedJob.job))
        .where(SavedJob.user_id == current_user.id)
        .order_by(SavedJob.saved_at.desc())
    )
    return [
        SavedJobOut(
            id=s.id,
            job=JobOut.model_validate(s.job),
            note=s.note,
            saved_at=s.saved_at,
        )
        for s in rows.scalars().all()
    ]
