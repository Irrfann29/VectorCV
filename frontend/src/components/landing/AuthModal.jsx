import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button, Input } from "../ui";
import { useNavigate } from "react-router-dom";

export default function AuthModal({ isOpen, onClose }) {
  const [tab, setTab] = useState("login");
  const [role, setRole] = useState("jobseeker");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handle = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      if (tab === "login") {
        await login(form.email, form.password);
      } else {
        await signup(form.name, form.email, form.password, role);
      }
      onClose();
      navigate("/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-bg/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md bg-bg-2 border border-border-2 rounded-2xl p-8 z-10"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-ink-3 hover:text-ink hover:bg-surface-2 transition-colors"
            >
              <X size={16} />
            </button>

            {/* Title */}
            <h2 className="font-syne font-bold text-2xl mb-1">
              {tab === "login" ? "Welcome back" : "Get started free"}
            </h2>
            <p className="text-sm text-ink-2 mb-5">
              {tab === "login" ? "Sign in to continue your job analysis" : "Create your account and analyze your resume"}
            </p>

            {/* Tabs */}
            <div className="flex border-b border-border mb-6">
              {["login", "signup"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 text-sm capitalize transition-colors border-b-2 -mb-px ${
                    tab === t
                      ? "text-accent border-accent"
                      : "text-ink-2 border-transparent hover:text-ink"
                  }`}
                >
                  {t === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Role selector — signup only */}
            {tab === "signup" && (
              <div className="mb-5">
                <p className="text-xs text-ink-2 mb-2">I am a...</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "jobseeker", label: "👤 Job Seeker" },
                    { id: "recruiter", label: "🏢 Recruiter" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`py-2.5 text-sm border rounded-lg transition-all ${
                        role === r.id
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border-2 text-ink-2 hover:border-border-3"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Google OAuth */}
            <button className="w-full flex items-center justify-center gap-2.5 py-2.5 border border-border-2 rounded-lg text-sm text-ink-2 hover:border-border-3 hover:text-ink transition-all mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-ink-3">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-3">
              {tab === "signup" && (
                <Input label="Full name" placeholder="Rahul Sharma" value={form.name} onChange={handle("name")} />
              )}
              <Input label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={handle("email")} />
              <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={handle("password")} />
            </div>

            {error && <p className="text-xs text-red-400 mt-3">{error}</p>}

            <Button
              variant="primary"
              className="w-full mt-5"
              size="lg"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Please wait..." : tab === "login" ? "Sign In" : "Create Account"}
            </Button>

            {tab === "signup" && (
              <p className="text-center text-xs text-ink-3 mt-4">
                By signing up, you agree to our{" "}
                <a href="#" className="text-accent hover:underline">Terms of Service</a>
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
