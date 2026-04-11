import axios from "axios";

// All AI calls go through your Express backend at /api/ai
// This keeps your Anthropic API key safe (never exposed to frontend)
const ai = axios.create({ baseURL: "/api/ai" });

/**
 * Analyze a resume and return top job recommendations
 * @param {string} resumeText - raw resume text
 * @param {string} domain - optional preferred domain
 * @param {string} level - experience level
 */
export async function getJobRecommendations(resumeText, domain = "", level = "") {
  const { data } = await ai.post("/recommend", { resumeText, domain, level });
  return data; // { summary, top_skills, recommendations: [{title, match, why, skills_needed, level}] }
}

/**
 * Run gap analysis between resume and a job description
 * @param {string} resumeText
 * @param {string} jobDescription
 * @param {string} company - optional company name
 */
export async function runGapAnalysis(resumeText, jobDescription, company = "") {
  const { data } = await ai.post("/gap", { resumeText, jobDescription, company });
  return data;
  // { fit_score, verdict, present_keywords, missing_keywords, strengths, gaps, action_plan }
}

// ─── BACKEND CODE (Express) ─────────────────────────────────────────────────
// Create a file: server/index.js and paste this:
//
// import express from 'express'
// import Anthropic from '@anthropic-ai/sdk'
// import cors from 'cors'
// import dotenv from 'dotenv'
// dotenv.config()
//
// const app = express()
// app.use(cors())
// app.use(express.json())
// const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
//
// async function askClaude(system, userMsg) {
//   const msg = await client.messages.create({
//     model: 'claude-sonnet-4-5',
//     max_tokens: 1024,
//     system,
//     messages: [{ role: 'user', content: userMsg }],
//   })
//   const raw = msg.content[0].text
//   return JSON.parse(raw.replace(/```json|```/g, '').trim())
// }
//
// app.post('/api/ai/recommend', async (req, res) => {
//   const { resumeText, domain, level } = req.body
//   const system = `You are a job recommendation AI. Return ONLY valid JSON:
//   { "summary":"...", "top_skills":["..."], "recommendations":[{"title":"...","match":85,"why":"...","skills_needed":["..."],"level":"..."}] }`
//   const data = await askClaude(system, `Resume:\n${resumeText}\nDomain: ${domain}\nLevel: ${level}`)
//   res.json(data)
// })
//
// app.post('/api/ai/gap', async (req, res) => {
//   const { resumeText, jobDescription, company } = req.body
//   const system = `You are a gap analysis expert. Return ONLY valid JSON:
//   { "fit_score":72, "verdict":"...", "present_keywords":["..."], "missing_keywords":["..."], "strengths":["..."], "gaps":["..."], "action_plan":"..." }`
//   const data = await askClaude(system, `Resume:\n${resumeText}\n\nJD:\n${jobDescription}\n\nCompany: ${company}`)
//   res.json(data)
// })
//
// app.listen(3001, () => console.log('Backend running on :3001'))
