from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db.database import engine, Base
from app.routers import auth, analysis, jobs


# ── Startup / Shutdown ─────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create all DB tables when server starts
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅  Database tables ready")
    yield
    await engine.dispose()


# ── App ────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="ResumeIQ API",
    description="""
## AI-Powered Job Recommendation & Gap Analysis System

### Features
- 🔐 **JWT Authentication** — Signup, Login, Change Password
- 📄 **Resume Management** — Upload PDF or paste text
- 🤖 **AI Analysis** — Job recommendations powered by Claude AI
- ⚡ **Gap Analysis** — Compare resume vs any job description
- 💼 **Job Listings** — 30 real Indian tech company listings
- 🔖 **Save Jobs** — Bookmark jobs for later

### AI Mode
- **Mock mode** (default) — Works without API key, returns realistic data
- **Real AI mode** — Add `ANTHROPIC_API_KEY` to `.env` to activate Claude AI
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)


# ── CORS ───────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Routers ────────────────────────────────────────────────────────────────────

app.include_router(auth.router,     prefix="/api")
app.include_router(analysis.router, prefix="/api")
app.include_router(jobs.router,     prefix="/api")


# ── Health Check ──────────────────────────────────────────────────────────────

@app.get("/api/health", tags=["Health"])
async def health():
    ai_key  = settings.ANTHROPIC_API_KEY
    ai_mode = "real (Claude AI)" if (ai_key and len(ai_key) > 20) else "mock"
    return {
        "status":   "ok ✅",
        "ai_mode":  ai_mode,
        "docs":     "http://localhost:8000/docs",
    }
