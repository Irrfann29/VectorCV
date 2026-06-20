"""
AI Service — wraps Anthropic Claude API.
Works in MOCK MODE when ANTHROPIC_API_KEY is not set in .env
Switch to real AI: just add your API key to .env — no code change needed!
"""
import json
import re
from app.config import settings


# ── Mock Data (returned when no API key set) ───────────────────────────────────

MOCK_RECOMMEND = {
    "summary": (
        "A skilled full-stack developer with strong React frontend capabilities "
        "and solid Node.js backend experience. Demonstrates hands-on project work "
        "with modern web technologies. Best suited for product companies."
    ),
    "top_skills": ["React", "Node.js", "MongoDB", "JavaScript", "REST APIs"],
    "recommendations": [
        {
            "title": "Full Stack Developer", "match": 87, "level": "Junior",
            "why": "React + Node.js + MongoDB is a near-perfect match.",
            "skills_needed": ["TypeScript", "Docker"],
        },
        {
            "title": "Backend Engineer", "match": 79, "level": "Junior",
            "why": "Strong Node.js; cloud experience would strengthen this.",
            "skills_needed": ["AWS", "Redis", "Microservices"],
        },
        {
            "title": "Frontend Engineer", "match": 74, "level": "Junior",
            "why": "React skills solid; TypeScript and testing would help.",
            "skills_needed": ["TypeScript", "Jest"],
        },
        {
            "title": "Data Analyst", "match": 55, "level": "Fresher",
            "why": "SQL foundation exists; Python and viz tools open this path.",
            "skills_needed": ["Python", "Pandas", "Power BI"],
        },
        {
            "title": "DevOps Engineer", "match": 38, "level": "Junior",
            "why": "Significant upskilling needed in infrastructure tools.",
            "skills_needed": ["Docker", "Kubernetes", "CI/CD"],
        },
    ],
}

MOCK_GAP = {
    "fit_score": 62,
    "verdict": "Partial match — strong on frontend but missing backend infrastructure keywords.",
    "present_keywords": ["React", "Node.js", "MongoDB", "REST API", "Git", "JavaScript"],
    "missing_keywords": ["Kubernetes", "Docker", "System Design", "Golang", "gRPC"],
    "strengths": [
        "Strong React and frontend fundamentals",
        "Hands-on Node.js API development",
        "Good project portfolio",
    ],
    "gaps": [
        "No containerization experience (Docker/Kubernetes)",
        "Missing system design knowledge",
        "No compiled language experience",
    ],
    "action_plan": (
        "1. Learn Docker basics — containerize your Node.js projects\n"
        "2. Study System Design fundamentals\n"
        "3. Add Kubernetes to one project\n"
        "4. Learn Go basics (2-3 weeks)\n"
        "5. Quantify resume achievements with numbers"
    ),
}


# ── Helpers ────────────────────────────────────────────────────────────────────

def _is_real_key() -> bool:
    k = settings.ANTHROPIC_API_KEY
    return bool(k and len(k) > 20 and not k.startswith("sk-ant-your"))


def _clean_json(raw: str) -> dict:
    clean = re.sub(r"```json\s*|```\s*", "", raw).strip()
    return json.loads(clean)


# ── Main Functions ─────────────────────────────────────────────────────────────

async def analyze_resume(resume_text: str, domain: str = "", level: str = "") -> dict:
    """
    Sends resume to Claude AI and gets back job recommendations.
    Returns mock data if no API key is set.
    """
    if not _is_real_key():
        return MOCK_RECOMMEND   # ← mock mode

    import anthropic
    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

    system = """You are an expert job recommendation AI.
Analyze the resume and return ONLY valid JSON (no markdown, no explanation):
{
  "summary": "2-3 sentence professional profile summary",
  "top_skills": ["skill1","skill2","skill3","skill4","skill5"],
  "recommendations": [
    {
      "title": "Job Title",
      "match": 85,
      "why": "one-line reason why this matches",
      "skills_needed": ["missing skill 1", "missing skill 2"],
      "level": "Fresher / Junior / Mid / Senior"
    }
  ]
}
Return exactly 5 recommendations sorted by match percentage descending."""

    user_msg = f"Resume:\n{resume_text}"
    if domain: user_msg += f"\nPreferred domain: {domain}"
    if level:  user_msg += f"\nExperience level: {level}"

    msg = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        system=system,
        messages=[{"role": "user", "content": user_msg}],
    )
    return _clean_json(msg.content[0].text)


async def run_gap_analysis(
    resume_text: str,
    job_description: str,
    company: str = ""
) -> dict:
    """
    Compares resume against a job description.
    Returns which keywords are present, missing, and an action plan.
    Returns mock data if no API key is set.
    """
    if not _is_real_key():
        result = MOCK_GAP.copy()
        if company:
            result["verdict"] = (
                f"Partial match for {company} — strong on frontend "
                "but missing key backend infrastructure keywords."
            )
        return result

    import anthropic
    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

    system = """You are a resume gap analysis expert.
Compare the resume against the job description and return ONLY valid JSON:
{
  "fit_score": 72,
  "verdict": "one sentence assessment",
  "present_keywords": ["kw1","kw2","kw3","kw4","kw5"],
  "missing_keywords": ["missing1","missing2","missing3","missing4","missing5"],
  "strengths": ["strength 1","strength 2","strength 3"],
  "gaps": ["gap 1","gap 2","gap 3"],
  "action_plan": "numbered concrete steps, one per line"
}"""

    user_msg = f"Resume:\n{resume_text}\n\nJob Description:\n{job_description}"
    if company: user_msg += f"\n\nTarget Company: {company}"

    msg = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        system=system,
        messages=[{"role": "user", "content": user_msg}],
    )
    return _clean_json(msg.content[0].text)
