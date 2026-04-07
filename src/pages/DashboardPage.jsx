import { Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/layout/Sidebar";
import Overview from "../components/dashboard/Overview";
import AnalyzeResume from "../components/dashboard/AnalyzeResume";
import JobMatches from "../components/dashboard/JobMatches";
import GapAnalysis from "../components/dashboard/GapAnalysis";
import History from "../components/dashboard/History";
import SavedJobs from "../components/dashboard/SavedJobs";
import Settings from "../components/dashboard/Settings";
import { Bell, Plus } from "lucide-react";
import { Button } from "../components/ui";
import { useLocation } from "react-router-dom";

const META = {
  overview: { title: "Overview", sub: "Welcome back. Here's your career snapshot." },
  analyze:  { title: "Analyze Resume", sub: "Upload or paste your resume for AI-powered job matching." },
  matches:  { title: "Job Matches", sub: "12 roles matched to your profile — sorted by relevance." },
  gap:      { title: "Gap Analysis", sub: "Target a company and see what's missing from your resume." },
  history:  { title: "Past Analyses", sub: "Track your resume improvements over time." },
  saved:    { title: "Saved Jobs", sub: "Roles you've bookmarked for later." },
  settings: { title: "Settings", sub: "Manage your profile, plan, and preferences." },
};

function Topbar() {
  const location = useLocation();
  const key = location.pathname.split("/").pop() || "overview";
  const meta = META[key] || META.overview;

  return (
    <header className="flex items-center justify-between px-6 py-3.5 bg-bg-2 border-b border-border flex-shrink-0">
      <div>
        <h1 className="font-syne font-bold text-lg">{meta.title}</h1>
        <p className="text-xs text-ink-3 mt-0.5">{meta.sub}</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface border border-border-2 text-ink-2 hover:text-ink hover:border-border-3 transition-colors relative">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full border border-bg-2" />
        </button>
        <Button variant="primary" size="sm" className="flex items-center gap-1.5">
          <Plus size={14} /> New Analysis
        </Button>
      </div>
    </header>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Routes>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview"  element={<Overview />} />
              <Route path="analyze"   element={<AnalyzeResume />} />
              <Route path="matches"   element={<JobMatches />} />
              <Route path="gap"       element={<GapAnalysis />} />
              <Route path="history"   element={<History />} />
              <Route path="saved"     element={<SavedJobs />} />
              <Route path="settings"  element={<Settings />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
