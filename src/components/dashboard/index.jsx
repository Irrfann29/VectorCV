// ─── AnalyzeResume.jsx ────────────────────────────────────────────────────────
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Sparkles } from "lucide-react";
import { Card, Button, Textarea, Input, MatchPill, Badge, Spinner } from "../ui";
import { getJobRecommendations } from "../../services/aiService";

export function AnalyzeResume() {
  const [mode, setMode] = useState("upload"); // upload | text
  const [resumeText, setResumeText] = useState("");
  const [domain, setDomain] = useState("");
  const [level, setLevel] = useState("fresher");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!resumeText.trim()) { setError("Please paste your resume text first."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await getJobRecommendations(resumeText, domain, level);
      setResult(data);
    } catch { setError("Analysis failed. Make sure your backend is running at localhost:3001."); }
    finally { setLoading(false); }
  };

  return (
    <div className="grid lg:grid-cols-[1fr_1fr] gap-4 items-start">
      <div className="space-y-4">
        <Card>
          <h3 className="font-syne font-semibold text-sm mb-4">Upload Resume</h3>
          <div className="flex gap-2 mb-4">
            <Button variant={mode==="upload"?"primary":"ghost"} size="sm" onClick={()=>setMode("upload")}>Upload File</Button>
            <Button variant={mode==="text"?"primary":"ghost"} size="sm" onClick={()=>setMode("text")}>Paste Text</Button>
          </div>
          {mode === "upload" ? (
            <div className="border-2 border-dashed border-border-3 rounded-xl p-8 text-center hover:border-accent hover:bg-accent/3 transition-all cursor-pointer group">
              <Upload size={28} className="mx-auto text-ink-3 group-hover:text-accent transition-colors mb-3" />
              <p className="font-syne font-semibold text-sm mb-1">Drop your resume here</p>
              <p className="text-xs text-ink-2">Supports PDF, DOCX, TXT · Max 5MB</p>
              <Button variant="primary" size="sm" className="mt-4">Choose File</Button>
            </div>
          ) : (
            <Textarea
              label="Resume text"
              placeholder={"Paste your full resume text here...\n\nExample:\nRahul Sharma | rahul@email.com\nSkills: React, Node.js, MongoDB\nExperience: 2 years..."}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-[200px]"
            />
          )}
        </Card>
        <Card>
          <h3 className="font-syne font-semibold text-sm mb-3">Preferences</h3>
          <div className="space-y-3">
            <Input label="Preferred domain" placeholder="Full Stack, Data Science, DevOps..." value={domain} onChange={e=>setDomain(e.target.value)} />
            <div>
              <p className="text-xs text-ink-3 uppercase tracking-wider mb-2">Experience level</p>
              <div className="flex flex-wrap gap-2">
                {["fresher","junior","mid","senior"].map(l => (
                  <button key={l} onClick={()=>setLevel(l)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-all capitalize ${level===l?"border-accent bg-accent/10 text-accent":"border-border-2 text-ink-2 hover:border-border-3"}`}>
                    {l === "junior" ? "Junior (1-3yr)" : l === "mid" ? "Mid (3-6yr)" : l === "senior" ? "Senior (6+yr)" : "Fresher"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          <Button variant="primary" className="w-full mt-4 flex items-center justify-center gap-2" onClick={analyze} disabled={loading}>
            {loading ? <><Spinner /> Analyzing...</> : <><Sparkles size={14} /> Analyze Resume</>}
          </Button>
        </Card>
      </div>

      <div>
        <AnimatePresence>
          {result && (
            <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="space-y-4">
              <Card>
                <p className="text-xs text-ink-3 uppercase tracking-wider mb-2">Profile Summary</p>
                <p className="text-sm text-ink-2 leading-relaxed">{result.summary}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {result.top_skills?.map(s => <Badge key={s} variant="neutral">{s}</Badge>)}
                </div>
              </Card>
              {result.recommendations?.map((r, i) => (
                <motion.div key={r.title} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}>
                  <Card hover>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-syne font-semibold text-sm">{r.title}</h3>
                        <p className="text-xs text-ink-3">{r.level}</p>
                      </div>
                      <MatchPill score={r.match} />
                    </div>
                    <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden mb-2">
                      <motion.div className="h-full rounded-full bg-accent" initial={{width:0}} animate={{width:`${r.match}%`}} transition={{duration:0.8,delay:i*0.08}} />
                    </div>
                    <p className="text-xs text-ink-2 mb-2">{r.why}</p>
                    <div className="flex flex-wrap gap-1">
                      {r.skills_needed?.map(s => <Badge key={s} variant="missing">{s}</Badge>)}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
          {!result && !loading && (
            <Card className="text-center py-16">
              <Sparkles size={28} className="mx-auto text-ink-3 mb-3 opacity-30" />
              <p className="text-sm text-ink-2">Your job recommendations will appear here after analysis.</p>
            </Card>
          )}
          {loading && (
            <Card className="text-center py-16">
              <Spinner />
              <p className="text-sm text-ink-2 mt-3">AI is reading your resume...</p>
            </Card>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── JobMatches.jsx ───────────────────────────────────────────────────────────
const JOBS = [
  {emoji:"💻",title:"Full Stack Developer",co:"Razorpay",loc:"Bangalore",match:87,tags:["React","Node.js","MongoDB"]},
  {emoji:"☁️",title:"Backend Engineer",co:"Swiggy",loc:"Bangalore",match:81,tags:["Node.js","Python","AWS"]},
  {emoji:"📊",title:"Data Analyst",co:"Flipkart",loc:"Remote",match:74,tags:["Python","SQL","Tableau"]},
  {emoji:"🎨",title:"Frontend Engineer",co:"Zomato",loc:"Delhi",match:68,tags:["React","TypeScript","CSS"]},
  {emoji:"🔧",title:"DevOps Engineer",co:"PhonePe",loc:"Remote",match:52,tags:["Docker","Kubernetes","CI/CD"]},
  {emoji:"🤖",title:"ML Engineer",co:"Meesho",loc:"Bangalore",match:45,tags:["Python","TensorFlow","NLP"]},
  {emoji:"🛡️",title:"SDE-2 Backend",co:"CRED",loc:"Bangalore",match:71,tags:["Go","Microservices","Redis"]},
  {emoji:"📱",title:"React Native Dev",co:"Nykaa",loc:"Mumbai",match:64,tags:["React Native","Redux","API"]},
];

export function JobMatches() {
  const [search, setSearch] = useState("");
  const filtered = JOBS.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.co.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input className="flex-1 max-w-xs bg-surface border border-border-2 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3 outline-none focus:border-accent"
          placeholder="🔍 Search jobs..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((j,i) => (
          <motion.div key={j.title} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}>
            <Card hover className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border-2 flex items-center justify-center text-xl">{j.emoji}</div>
                <MatchPill score={j.match} />
              </div>
              <h3 className="font-syne font-semibold text-sm mb-0.5">{j.title}</h3>
              <p className="text-xs text-ink-2 mb-3">{j.co} · {j.loc}</p>
              <div className="flex flex-wrap gap-1 mb-4 flex-1">
                {j.tags.map(t => <Badge key={t} variant="neutral">{t}</Badge>)}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1">Gap Analysis</Button>
                <Button variant="ghost" size="sm">🔖</Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── History.jsx ──────────────────────────────────────────────────────────────
export function History() {
  const rows = [
    {name:"Resume_v3_Final.pdf", date:"Today, 11:30 AM", match:"87% — Razorpay", count:12, status:"done"},
    {name:"Resume_v2.pdf",       date:"Yesterday",       match:"79% — Swiggy",   count:8,  status:"done"},
    {name:"Resume_v1.docx",      date:"3 days ago",      match:"61% — Infosys",  count:5,  status:"done"},
  ];
  return (
    <div className="space-y-4">
      <Card>
        <h3 className="font-syne font-semibold text-sm mb-4">Analysis History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Resume","Date","Best Match","Matches","Status",""].map(h => (
                  <th key={h} className="text-left text-xs text-ink-3 uppercase tracking-wider py-2 px-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-surface-2/40 transition-colors">
                  <td className="py-3 px-3 text-ink">{r.name}</td>
                  <td className="py-3 px-3 text-ink-2">{r.date}</td>
                  <td className="py-3 px-3 text-accent">{r.match}</td>
                  <td className="py-3 px-3 text-ink-2">{r.count}</td>
                  <td className="py-3 px-3"><span className="text-xs px-2 py-0.5 rounded-md bg-accent-2/10 text-accent-2 border border-accent-2/20">Completed</span></td>
                  <td className="py-3 px-3"><Button variant="ghost" size="sm">View</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <h3 className="font-syne font-semibold text-sm mb-4">Score Progression</h3>
        <div className="flex items-end gap-2 h-20">
          {[{v:61,label:"v1",color:"bg-accent-3/40"},{v:79,label:"v2",color:"bg-accent/40"},{v:87,label:"v3",color:"bg-accent-2/50",border:"border border-accent-2/40"}].map(b => (
            <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-ink-3">{b.v}%</span>
              <div className={`w-full rounded-t ${b.color} ${b.border||""}`} style={{height:`${b.v}%`}} />
              <span className="text-xs text-ink-3">{b.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── SavedJobs.jsx ────────────────────────────────────────────────────────────
const SAVED = [
  {emoji:"☁️",title:"Backend Engineer",co:"Swiggy",loc:"Bangalore",match:81,note:"Applied 2 days ago"},
  {emoji:"💻",title:"Full Stack Dev",co:"Razorpay",loc:"Remote",match:87,note:"Saved for later"},
  {emoji:"🎨",title:"Frontend Engineer",co:"Zomato",loc:"Delhi",match:68,note:"Interview scheduled"},
  {emoji:"🛡️",title:"SDE-2 Backend",co:"CRED",loc:"Bangalore",match:71,note:"Application pending"},
];

export function SavedJobs() {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
      {SAVED.map((j,i) => (
        <motion.div key={j.title} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}>
          <Card hover className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
              <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border-2 flex items-center justify-center text-xl">{j.emoji}</div>
              <MatchPill score={j.match} />
            </div>
            <h3 className="font-syne font-semibold text-sm mb-0.5">{j.title}</h3>
            <p className="text-xs text-ink-2 mb-1">{j.co} · {j.loc}</p>
            <p className="text-xs text-ink-3 mb-4 flex-1">{j.note}</p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1">View</Button>
              <Button variant="danger" size="sm">✕</Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Settings.jsx ─────────────────────────────────────────────────────────────
import { useAuth } from "../../context/AuthContext";

export function Settings() {
  const { user } = useAuth();
  return (
    <div className="grid lg:grid-cols-2 gap-4 items-start">
      <div className="space-y-4">
        <Card>
          <h3 className="font-syne font-semibold text-sm mb-4">Profile</h3>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/25 flex items-center justify-center text-base font-semibold text-accent">
              {user?.name?.split(" ").map(n=>n[0]).join("")}
            </div>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-ink-3">{user?.email}</p>
            </div>
          </div>
          <div className="space-y-3">
            <Input label="Full Name" defaultValue={user?.name} />
            <Input label="Email" type="email" defaultValue={user?.email} />
            <Input label="Phone" placeholder="+91 98XXXXXXXX" />
            <div className="flex justify-end">
              <Button variant="primary" size="sm">Save Changes</Button>
            </div>
          </div>
        </Card>
        <Card>
          <h3 className="font-syne font-semibold text-sm mb-4">Change Password</h3>
          <div className="space-y-3">
            <Input label="Current Password" type="password" placeholder="••••••••" />
            <Input label="New Password" type="password" placeholder="••••••••" />
            <div className="flex justify-end">
              <Button variant="ghost" size="sm">Update Password</Button>
            </div>
          </div>
        </Card>
      </div>
      <div className="space-y-4">
        <Card>
          <h3 className="font-syne font-semibold text-sm mb-4">Plan & Usage</h3>
          <div className="bg-surface-2 rounded-xl p-4 mb-4">
            <p className="text-xs text-ink-3 mb-1">Current Plan</p>
            <p className="font-syne font-bold text-lg text-accent">Free Plan</p>
            <p className="text-xs text-ink-2 mt-1">3 of 5 analyses used this month</p>
            <div className="h-2 bg-bg-3 rounded-full mt-2 overflow-hidden">
              <div className="h-full w-3/5 bg-accent rounded-full" />
            </div>
          </div>
          <Button variant="primary" className="w-full">Upgrade to Pro ✦</Button>
        </Card>
        <Card>
          <h3 className="font-syne font-semibold text-sm mb-4">Notifications</h3>
          <div className="space-y-3">
            {["New job matches","Analysis complete","Weekly tips"].map(n => (
              <div key={n} className="flex items-center justify-between">
                <span className="text-sm">{n}</span>
                <div className="w-9 h-5 rounded-full bg-accent/30 border border-accent/40 relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-accent" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AnalyzeResume;
