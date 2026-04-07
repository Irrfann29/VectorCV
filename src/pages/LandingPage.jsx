import { useState } from "react";
import { motion } from "framer-motion";
import AuthModal from "../components/landing/AuthModal";
import { Button } from "../components/ui";

const COMPANIES = ["Google","Amazon","Flipkart","Microsoft","Infosys","TCS","Swiggy","Zomato","Razorpay","PhonePe","Paytm","CRED","Meesho","Zepto","Nykaa"];

const STEPS = [
  { num:"01", icon:"📄", title:"Upload your resume", desc:"Paste resume text or upload a PDF. Our parser extracts skills, experience, and education automatically." },
  { num:"02", icon:"🧠", title:"AI analyzes your profile", desc:"Claude AI reads your resume, identifies your strengths, and maps them against thousands of job profiles." },
  { num:"03", icon:"🎯", title:"Get matched & guided", desc:"Receive ranked job recommendations with match scores. Target a company? Run a gap analysis instantly." },
  { num:"04", icon:"🚀", title:"Bridge the gap", desc:"See exactly which keywords are missing from your resume for your target role. Get an actionable plan." },
];

const FEATURES = [
  { icon:"✦", title:"AI Job Matching", desc:"Get ranked job roles that best fit your profile, with percentage match scores and AI reasoning.", tag:"CORE FEATURE" },
  { icon:"⚡", title:"Gap Analysis", desc:"Target any company or JD. See which keywords are present, which are missing, and how to fix it.", tag:"CORE FEATURE" },
  { icon:"◈", title:"ATS Score Check", desc:"Understand how well your resume performs against Applicant Tracking Systems before you apply.", tag:"COMING SOON" },
  { icon:"◎", title:"Cover Letter Gen", desc:"Auto-generate tailored cover letters based on your resume and the job description.", tag:"COMING SOON" },
  { icon:"▣", title:"Skill Roadmap", desc:"Get a personalized 30-day learning plan to bridge the skill gap for your target role.", tag:"AI POWERED" },
  { icon:"⬡", title:"Resume History", desc:"Save multiple resumes, track improvements over time, and compare gap scores across versions.", tag:"DASHBOARD" },
];

const TESTIMONIALS = [
  { text:"The gap analysis literally told me I was missing 'Kubernetes' and 'Terraform'. Added them, got a callback in 2 weeks.", name:"Rahul Kumar", role:"DevOps Engineer, Swiggy", color:"bg-accent/15 text-accent" },
  { text:"I had no idea which domain to target after B.Tech. ResumeIQ told me I was an 84% match for Data Analyst — never considered it.", name:"Priya Sharma", role:"Data Analyst, Razorpay", color:"bg-accent-2/15 text-accent-2" },
  { text:"The AI match score was shockingly accurate. Even told me to quantify my project outcomes. Completely changed my approach.", name:"Arjun Mehta", role:"SDE-1, Amazon", color:"bg-red-400/15 text-red-400" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

export default function LandingPage() {
  const [modal, setModal] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-ink font-dm overflow-x-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 nav-grid-bg pointer-events-none z-0 opacity-60"
        style={{ maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)" }} />

      {/* Orbs */}
      <div className="fixed top-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(61,157,255,0.1) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="fixed bottom-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(0,207,168,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />

      {/* NAV */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-bg/70 backdrop-blur-xl border-b border-border"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="font-syne font-extrabold text-lg tracking-tight">
          Resume<span className="text-accent">IQ</span>
        </div>
        <ul className="hidden md:flex gap-8 list-none">
          {["How it works", "Features", "Reviews"].map((link) => (
            <li key={link}>
              <a href={`#${link.toLowerCase().replace(/ /g, "-")}`}
                className="text-ink-2 text-sm hover:text-ink transition-colors relative group">
                {link}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent transition-all group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex gap-2.5 items-center">
          <Button variant="ghost" size="sm" onClick={() => setModal(true)}>Sign in</Button>
          <Button variant="primary" size="sm" onClick={() => setModal(true)}>Get Started →</Button>
        </div>
      </motion.nav>

      {/* HERO */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <motion.div {...fadeUp(0.2)}
          className="inline-flex items-center gap-2 bg-accent/8 border border-accent/20 px-4 py-1.5 rounded-full text-xs text-accent uppercase tracking-widest mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse2" />
          AI-Powered Career Intelligence
        </motion.div>

        <motion.h1 {...fadeUp(0.35)}
          className="font-syne font-extrabold text-5xl md:text-7xl leading-[1.05] tracking-tight mb-6">
          Your resume,<br />
          <span className="gradient-text">analyzed by AI</span>
        </motion.h1>

        <motion.p {...fadeUp(0.5)}
          className="text-ink-2 text-lg max-w-xl leading-relaxed mb-10">
          Upload your resume and instantly discover best-fit jobs, identify skill gaps, and get a competitive edge — powered by Claude AI.
        </motion.p>

        <motion.div {...fadeUp(0.65)} className="flex gap-3 flex-wrap justify-center">
          <Button variant="primary" size="lg" onClick={() => setModal(true)}>
            Analyze My Resume →
          </Button>
          <Button variant="ghost" size="lg">
            See how it works
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div {...fadeUp(0.8)}
          className="flex flex-wrap justify-center mt-14 border-y border-border divide-x divide-border">
          {[["94%","Match Accuracy"],["10K+","Job Profiles"],["3x","Interview Rate"],["60s","Time to Result"]].map(([val, label]) => (
            <div key={label} className="px-8 py-4 text-center">
              <div className="font-syne font-bold text-2xl text-accent">{val}</div>
              <div className="text-xs text-ink-3 mt-0.5 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* MARQUEE */}
      <div className="relative z-10 py-4 border-y border-border bg-bg-2 overflow-hidden">
        <div className="flex animate-marquee w-max gap-10">
          {[...COMPANIES, ...COMPANIES].map((c, i) => (
            <span key={i} className="text-xs font-syne font-semibold uppercase tracking-widest text-ink-3 flex items-center gap-3 whitespace-nowrap">
              <span className="w-1 h-1 rounded-full bg-accent" />{c}
            </span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-widest text-accent mb-2">Process</p>
            <h2 className="font-syne font-bold text-4xl md:text-5xl tracking-tight">Three steps to your dream job</h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-px bg-border border border-border rounded-2xl overflow-hidden">
            {STEPS.map((s, i) => (
              <motion.div key={s.num}
                className="bg-bg-2 p-8 relative group hover:bg-surface transition-colors"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                <div className="absolute top-4 right-5 font-syne font-extrabold text-5xl text-accent/6 leading-none">{s.num}</div>
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-xl mb-4">{s.icon}</div>
                <h3 className="font-syne font-semibold text-base mb-2">{s.title}</h3>
                <p className="text-sm text-ink-2 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative z-10 py-24 px-6 bg-bg-2 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <motion.div className="mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs uppercase tracking-widest text-accent mb-2">Features</p>
            <h2 className="font-syne font-bold text-4xl md:text-5xl tracking-tight">Everything you need<br />to land the right role</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                className="bg-bg-2 p-7 relative overflow-hidden group hover:bg-surface transition-colors"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "radial-gradient(circle at 0% 0%, rgba(61,157,255,0.06), transparent 60%)" }} />
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-syne font-semibold text-base mb-1.5">{f.title}</h3>
                <p className="text-sm text-ink-2 leading-relaxed mb-3">{f.desc}</p>
                <span className="inline-block text-xs px-2 py-0.5 rounded bg-accent-2/10 text-accent-2 border border-accent-2/20 tracking-wider">
                  {f.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="reviews" className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div className="mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs uppercase tracking-widest text-accent mb-2">Reviews</p>
            <h2 className="font-syne font-bold text-4xl md:text-5xl tracking-tight">What job seekers say</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name}
                className="bg-surface border border-border-2 rounded-2xl p-6 hover:border-border-3 hover:-translate-y-1 transition-all"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                <p className="text-sm text-ink-2 leading-relaxed italic mb-5">
                  <span className="text-accent text-xl leading-none align-bottom mr-0.5">"</span>
                  {t.text}
                </p>
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${t.color}`}>
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-ink-3">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="bg-surface border border-border-2 rounded-3xl p-14 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <div className="absolute top-[-40%] left-[-10%] w-80 h-80 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(61,157,255,0.1) 0%, transparent 60%)", filter: "blur(40px)" }} />
            <p className="text-xs uppercase tracking-widest text-accent mb-3">Get started free</p>
            <h2 className="font-syne font-bold text-4xl tracking-tight mb-4">Ready to find your perfect job match?</h2>
            <p className="text-ink-2 mb-8">Join thousands of candidates who already know their fit before they apply.</p>
            <Button variant="primary" size="lg" onClick={() => setModal(true)}>
              Start for free — no credit card →
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-border px-8 py-5 flex justify-between items-center flex-wrap gap-4">
        <div className="font-syne font-extrabold">Resume<span className="text-accent">IQ</span></div>
        <p className="text-xs text-ink-3">© 2025 ResumeIQ · Final Year Project · Built with Claude AI</p>
        <div className="flex gap-5">
          {["Privacy","Terms","GitHub"].map(l => (
            <a key={l} href="#" className="text-xs text-ink-3 hover:text-ink transition-colors">{l}</a>
          ))}
        </div>
      </footer>

      <AuthModal isOpen={modal} onClose={() => setModal(false)} />
    </div>
  );
}
