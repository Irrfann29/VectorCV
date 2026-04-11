import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Initialize Anthropic client — API key comes from .env
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Helper: ask Claude and parse JSON response ────────────────────────────
async function askClaude(systemPrompt, userMessage) {
  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const raw = message.content[0].text;
  // Strip markdown code fences if Claude wraps JSON in them
  const clean = raw.replace(/```json\n?|```\n?/g, "").trim();
  return JSON.parse(clean);
}

// ─── POST /api/ai/recommend ────────────────────────────────────────────────
// Body: { resumeText, domain, level }
// Returns: { summary, top_skills, recommendations }
app.post("/api/ai/recommend", async (req, res) => {
  const { resumeText, domain = "", level = "" } = req.body;

  if (!resumeText?.trim()) {
    return res.status(400).json({ error: "resumeText is required" });
  }

  const system = `You are an expert job recommendation AI. Analyze the resume and return ONLY valid JSON with no extra text, no markdown, no explanation. Use this exact schema:
{
  "summary": "2-3 sentence professional profile summary",
  "top_skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "recommendations": [
    {
      "title": "Job Title",
      "match": 85,
      "why": "One-line reason why this matches",
      "skills_needed": ["missing skill 1", "missing skill 2"],
      "level": "Fresher / Junior / Mid / Senior"
    }
  ]
}
Return exactly 5 job recommendations sorted by match percentage descending.`;

  const userMsg = `Resume:\n${resumeText}${domain ? `\n\nPreferred Domain: ${domain}` : ""}${level ? `\nExperience Level: ${level}` : ""}`;

  try {
    const data = await askClaude(system, userMsg);
    res.json(data);
  } catch (err) {
    console.error("Recommend error:", err.message);
    res.status(500).json({ error: "AI analysis failed", detail: err.message });
  }
});

// ─── POST /api/ai/gap ──────────────────────────────────────────────────────
// Body: { resumeText, jobDescription, company }
// Returns: { fit_score, verdict, present_keywords, missing_keywords, strengths, gaps, action_plan }
app.post("/api/ai/gap", async (req, res) => {
  const { resumeText, jobDescription, company = "" } = req.body;

  if (!resumeText?.trim() || !jobDescription?.trim()) {
    return res.status(400).json({ error: "resumeText and jobDescription are required" });
  }

  const system = `You are an expert resume gap analysis AI. Compare the resume against the job description and return ONLY valid JSON with no extra text:
{
  "fit_score": 72,
  "verdict": "One sentence overall assessment",
  "present_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "missing_keywords": ["missing1", "missing2", "missing3", "missing4", "missing5"],
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "gaps": ["gap 1", "gap 2", "gap 3"],
  "action_plan": "4-5 numbered concrete steps to bridge the gap, one per line"
}
Be specific and actionable. focus on technical keywords from the job description.`;

  const userMsg = `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}${company ? `\n\nTarget Company: ${company}` : ""}`;

  try {
    const data = await askClaude(system, userMsg);
    res.json(data);
  } catch (err) {
    console.error("Gap analysis error:", err.message);
    res.status(500).json({ error: "Gap analysis failed", detail: err.message });
  }
});

// ─── Health check ──────────────────────────────────────────────────────────
app.get("/api/health", (_, res) => res.json({ status: "ok", model: "claude-sonnet-4-5" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ ResumeIQ backend running at http://localhost:${PORT}`);
  console.log(`   Anthropic API key: ${process.env.ANTHROPIC_API_KEY ? "✓ loaded" : "✗ MISSING"}`);
});
