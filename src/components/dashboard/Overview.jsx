// Overview.jsx
import { Card, StatCard, SkillBar, MatchPill } from "../ui";
import { Activity, TrendingUp } from "lucide-react";

const JOBS = [
  { emoji:"💻", title:"Full Stack Developer", company:"Razorpay · Bangalore", match:87 },
  { emoji:"☁️", title:"Backend Engineer",     company:"Swiggy · Bangalore",  match:81 },
  { emoji:"📊", title:"Data Analyst",          company:"Flipkart · Remote",   match:74 },
  { emoji:"🎨", title:"Frontend Engineer",     company:"Zomato · Delhi",      match:68 },
  { emoji:"🔧", title:"DevOps Engineer",       company:"PhonePe · Remote",    match:52 },
];

export default function Overview() {
  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Best Match Score"  value="87%" change="+5% from last resume" changeType="up" glowColor="rgba(61,157,255,0.2)" />
        <StatCard label="Top Job Matches"   value="12"  change="3 new today"          changeType="up" glowColor="rgba(0,207,168,0.2)" />
        <StatCard label="Skills Gap"        value="6"   change="Missing keywords"      changeType="down" glowColor="rgba(249,115,22,0.2)" />
        <StatCard label="Analyses Done"     value="3"   glowColor="rgba(255,255,255,0.04)" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Job Matches */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-syne font-semibold text-sm">Top Job Matches</h3>
            <a href="#" className="text-xs text-accent hover:underline">View all →</a>
          </div>
          {JOBS.map((j) => (
            <div key={j.title} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0 group cursor-pointer">
              <div className="w-9 h-9 rounded-lg bg-surface-2 border border-border-2 flex items-center justify-center text-lg flex-shrink-0">{j.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium group-hover:text-accent transition-colors truncate">{j.title}</div>
                <div className="text-xs text-ink-2">{j.company}</div>
              </div>
              <MatchPill score={j.match} />
            </div>
          ))}
        </Card>

        {/* Skills */}
        <Card>
          <h3 className="font-syne font-semibold text-sm mb-4">Skills Strength</h3>
          <SkillBar label="React / Frontend"  value={90} color="bg-accent-2" />
          <SkillBar label="Node.js / Backend" value={78} color="bg-accent" />
          <SkillBar label="SQL / Databases"   value={72} color="bg-accent" />
          <SkillBar label="Python"            value={55} color="bg-accent-3" />
          <SkillBar label="Cloud / AWS"       value={30} color="bg-red-400" />
          <SkillBar label="Docker / DevOps"   value={20} color="bg-red-400" />
        </Card>
      </div>

      {/* Activity */}
      <Card>
        <h3 className="font-syne font-semibold text-sm mb-4 flex items-center gap-2">
          <Activity size={15} className="text-accent" /> Recent Activity
        </h3>
        {[
          { color:"bg-accent-2", text:<>Gap analysis completed for <strong>Google SDE-2</strong>. 6 keywords missing.</>, time:"2h ago" },
          { color:"bg-accent",   text:<>Resume analyzed — 12 job matches found. Best: <strong>Full Stack Dev at Razorpay</strong>.</>, time:"5h ago" },
          { color:"bg-accent-3", text:<>Saved <strong>Backend Engineer at Swiggy</strong> to your list.</>, time:"1d ago" },
        ].map((a, i) => (
          <div key={i} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
            <div className={`w-2 h-2 rounded-full ${a.color} mt-1.5 flex-shrink-0`} />
            <p className="text-xs text-ink-2 flex-1 leading-relaxed">{a.text}</p>
            <span className="text-xs text-ink-3 flex-shrink-0">{a.time}</span>
          </div>
        ))}
        <div className="mt-3 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-accent/8 border border-accent/15 text-accent animate-pulse2">
          💡 Add Docker & Kubernetes to improve DevOps match by 22%
        </div>
      </Card>
    </div>
  );
}
