import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Card, Button, Textarea, Input, Badge, Spinner } from "../ui";
import { runGapAnalysis } from "../../services/aiService";

export default function GapAnalysis() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!resumeText.trim() || !jdText.trim()) {
      setError("Please fill in both your resume and the job description.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await runGapAnalysis(resumeText, jdText, company);
      setResult(data);
    } catch (e) {
      setError("Analysis failed. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result
    ? result.fit_score >= 75 ? "text-accent-2" : result.fit_score >= 55 ? "text-accent" : "text-accent-3"
    : "text-ink";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 items-start">
      {/* INPUT COLUMN */}
      <div className="flex flex-col gap-4">
        <Card>
          <h3 className="font-syne font-semibold text-sm mb-4">Target Role Details</h3>
          <div className="flex flex-col gap-3">
            <Input
              label="Company name (optional)"
              placeholder="e.g. Google, Amazon, Flipkart..."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <Textarea
              label="Job description"
              placeholder={"Paste the job description here...\n\nExample:\nWe are looking for a Senior Backend Engineer with 3+ years experience in Node.js, Python, microservices, Docker, Kubernetes, AWS..."}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="min-h-[140px]"
            />
            <Textarea
              label="Your resume"
              placeholder={"Paste your resume text here..."}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          <Button
            variant="primary"
            className="w-full mt-4 flex items-center justify-center gap-2"
            onClick={analyze}
            disabled={loading}
          >
            {loading ? <><Spinner /> Analyzing...</> : <><Zap size={14} /> Run Gap Analysis</>}
          </Button>
        </Card>

        {/* Tip card */}
        <Card className="bg-accent/4 border-accent/20">
          <p className="text-xs font-medium text-accent mb-1.5">💡 Pro tip</p>
          <p className="text-xs text-ink-2 leading-relaxed">
            For best results, paste the <strong className="text-ink">full job description</strong> — including responsibilities, requirements, and nice-to-haves. More context = better analysis.
          </p>
        </Card>
      </div>

      {/* RESULT COLUMN */}
      <div className="flex flex-col gap-4">
        <AnimatePresence mode="wait">
          {!result && !loading && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="text-center py-16">
                <Zap size={32} className="mx-auto text-ink-3 mb-3 opacity-30" />
                <p className="text-sm text-ink-2">Fill in your resume and a job description, then run the analysis to see your keyword gaps.</p>
              </Card>
            </motion.div>
          )}

          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="text-center py-16">
                <Spinner />
                <p className="text-sm text-ink-2 mt-3">Claude is analyzing your profile...</p>
              </Card>
            </motion.div>
          )}

          {result && (
            <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
              {/* Fit Score */}
              <Card>
                <p className="text-xs text-ink-3 uppercase tracking-wider mb-1">{company ? `${company} Fit Score` : "Fit Score"}</p>
                <div className={`font-syne font-extrabold text-6xl leading-none ${scoreColor} mb-2`}>
                  {result.fit_score}%
                </div>
                <div className="h-2 bg-surface-2 rounded-full overflow-hidden mb-3">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.fit_score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <p className="text-sm text-ink-2">{result.verdict}</p>
              </Card>

              {/* Keywords */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <div className="flex items-center gap-1.5 mb-3">
                    <CheckCircle size={14} className="text-accent-2" />
                    <p className="text-xs font-medium text-accent-2">Found in resume</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.present_keywords?.map((k) => <Badge key={k} variant="present">{k}</Badge>)}
                  </div>
                </Card>
                <Card>
                  <div className="flex items-center gap-1.5 mb-3">
                    <XCircle size={14} className="text-red-400" />
                    <p className="text-xs font-medium text-red-400">Missing keywords</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing_keywords?.map((k) => <Badge key={k} variant="missing">{k}</Badge>)}
                  </div>
                </Card>
              </div>

              {/* Strengths & Gaps */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <p className="text-xs text-ink-3 uppercase tracking-wider mb-3">Your strengths</p>
                  {result.strengths?.map((s) => (
                    <p key={s} className="text-xs text-ink-2 py-2 border-b border-border last:border-0">+ {s}</p>
                  ))}
                </Card>
                <Card>
                  <p className="text-xs text-ink-3 uppercase tracking-wider mb-3">Gaps to address</p>
                  {result.gaps?.map((g) => (
                    <p key={g} className="text-xs text-ink-2 py-2 border-b border-border last:border-0">− {g}</p>
                  ))}
                </Card>
              </div>

              {/* Action Plan */}
              <Card className="bg-accent-2/4 border-accent-2/20">
                <p className="text-xs font-medium text-accent-2 mb-2">Action Plan</p>
                <p className="text-sm text-ink-2 leading-relaxed whitespace-pre-wrap">{result.action_plan}</p>
                <Button variant="green" size="sm" className="mt-3 flex items-center gap-1.5">
                  Get 30-day study plan <ArrowRight size={13} />
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
