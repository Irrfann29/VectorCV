# ResumeIQ — AI-Powered Job Recommendation System
> Final Year Project | React + Tailwind + Node.js + Claude AI

---

## Project Structure

```
resumeiq/
├── src/                        # React Frontend (Vite)
│   ├── components/
│   │   ├── ui/                 # Reusable: Button, Card, Badge, Input, etc.
│   │   ├── layout/             # Sidebar, Topbar
│   │   ├── landing/            # AuthModal
│   │   └── dashboard/          # Overview, AnalyzeResume, GapAnalysis, etc.
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   └── DashboardPage.jsx
│   ├── context/
│   │   └── AuthContext.jsx     # Auth state (swap with Firebase/JWT later)
│   ├── services/
│   │   └── aiService.js        # All Anthropic API calls
│   └── main.jsx
│
├── server/                     # Express Backend
│   ├── index.js                # API routes + Anthropic integration
│   ├── package.json
│   └── .env.example
│
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Setup Instructions

### Step 1 — Clone & install frontend

```bash
# In the root /resumeiq folder
npm install
```

### Step 2 — Setup backend

```bash
cd server
npm install

# Create your .env file
cp .env.example .env

# Add your Anthropic API key inside .env:
# ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxx
```

### Step 3 — Get Anthropic API Key (FREE to start)

1. Go to https://console.anthropic.com/
2. Sign up → you get **$5 free credits** (enough for hundreds of analyses)
3. Go to "API Keys" → Create Key
4. Paste it in `server/.env`

### Step 4 — Run the project

Open **two terminals**:

```bash
# Terminal 1 — Start backend (port 3001)
cd server
npm run dev

# Terminal 2 — Start frontend (port 5173)
cd ..   (back to root)
npm run dev
```

Open http://localhost:5173 — done! 🎉

---

## How the AI Integration Works

```
User pastes resume
       ↓
Frontend (React) calls aiService.js
       ↓
aiService.js sends POST to /api/ai/recommend  (your Express backend)
       ↓
Express backend calls Anthropic Claude API with a structured prompt
       ↓
Claude returns JSON with job matches / gap analysis
       ↓
Backend sends JSON back to frontend
       ↓
React renders the results with animations
```

**Why backend proxy?** Your Anthropic API key must NEVER go in frontend code
— anyone can view source and steal it. The backend keeps it safe in .env.

---

## Tech Stack (for your resume / recruiter demo)

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, React Router v6         |
| Styling   | Tailwind CSS v3                   |
| Animation | Framer Motion                     |
| Icons     | Lucide React                      |
| Backend   | Node.js, Express                  |
| AI        | Anthropic Claude (claude-sonnet)  |
| Auth      | Context API (→ swap with Firebase)|
| Build     | Vite                              |

---

## Extending the Project

### Add real auth (JWT)
Replace `AuthContext.jsx` login/signup with real API calls:
```js
// In AuthContext.jsx
const login = async (email, password) => {
  const { data } = await axios.post('/api/auth/login', { email, password })
  localStorage.setItem('token', data.token)
  setUser(data.user)
}
```

Add to backend:
```js
// server/routes/auth.js
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
// POST /api/auth/signup  → hash password, save to MongoDB, return JWT
// POST /api/auth/login   → verify password, return JWT
```

### Add MongoDB
```bash
npm install mongoose
```
Store: users, resumes, analysis history, saved jobs.

### Role-based dashboard (Recruiter vs Job Seeker)
In `App.jsx`, check `user.role`:
```jsx
<Route path="/dashboard/*" element={
  user?.role === 'recruiter' ? <RecruiterDashboard /> : <JobSeekerDashboard />
} />
```
