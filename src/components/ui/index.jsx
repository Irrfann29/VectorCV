import clsx from "clsx";

// ─── BUTTON ──────────────────────────────────────────────────────────────────
export function Button({ children, variant = "primary", size = "md", className, ...props }) {
  const base = "inline-flex items-center justify-center font-dm font-medium rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-accent text-white hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(61,157,255,0.3)]",
    ghost: "bg-transparent border border-border-2 text-ink-2 hover:border-border-3 hover:text-ink",
    green: "bg-accent-2/10 text-accent-2 border border-accent-2/25 hover:bg-accent-2/20",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
  };
  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };
  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={clsx(
        "bg-surface border border-border-2 rounded-2xl p-5",
        hover && "transition-all duration-200 hover:border-border-3 hover:-translate-y-0.5 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = "neutral" }) {
  const variants = {
    neutral: "bg-surface-2 text-ink-2 border-border-2",
    high: "bg-accent-2/10 text-accent-2 border-accent-2/20",
    mid: "bg-accent/10 text-accent border-accent/20",
    low: "bg-accent-3/10 text-accent-3 border-accent-3/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    present: "bg-accent-2/10 text-accent-2 border-accent-2/20",
    missing: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={clsx("inline-block text-xs px-2.5 py-1 rounded-md border font-mono", variants[variant])}>
      {children}
    </span>
  );
}

// ─── INPUT ────────────────────────────────────────────────────────────────────
export function Input({ label, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs text-ink-3 uppercase tracking-wider font-medium">{label}</label>}
      <input
        className={clsx(
          "w-full bg-surface-2 border border-border-2 rounded-lg px-3 py-2.5 text-sm text-ink",
          "placeholder:text-ink-3 outline-none transition-colors duration-200",
          "focus:border-accent",
          className
        )}
        {...props}
      />
    </div>
  );
}

// ─── TEXTAREA ─────────────────────────────────────────────────────────────────
export function Textarea({ label, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs text-ink-3 uppercase tracking-wider font-medium">{label}</label>}
      <textarea
        className={clsx(
          "w-full bg-surface-2 border border-border-2 rounded-lg px-3 py-2.5 text-sm text-ink font-mono",
          "placeholder:text-ink-3 outline-none transition-colors duration-200 resize-y",
          "focus:border-accent leading-relaxed",
          className
        )}
        {...props}
      />
    </div>
  );
}

// ─── MATCH PILL ───────────────────────────────────────────────────────────────
export function MatchPill({ score }) {
  const variant = score >= 80 ? "high" : score >= 65 ? "mid" : "low";
  return <Badge variant={variant}>{score}%</Badge>;
}

// ─── SKILL BAR ────────────────────────────────────────────────────────────────
export function SkillBar({ label, value, color = "bg-accent" }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-ink-2 mb-1.5">
        <span>{label}</span>
        <span style={{ color: value >= 75 ? "#00cfa8" : value >= 50 ? "#3d9dff" : "#f97316" }}>{value}%</span>
      </div>
      <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
        <div
          className={clsx("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, change, changeType = "up", glowColor = "rgba(61,157,255,0.15)" }) {
  return (
    <Card className="relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`, filter: "blur(16px)" }}
      />
      <p className="text-xs text-ink-2 mb-2">{label}</p>
      <p className="font-syne text-3xl font-bold">{value}</p>
      {change && (
        <p className={clsx("text-xs mt-1.5", changeType === "up" ? "text-accent-2" : "text-red-400")}>
          {changeType === "up" ? "↑" : "↓"} {change}
        </p>
      )}
    </Card>
  );
}

// ─── LOADING SPINNER ──────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="flex gap-1 items-center">
      {[0, 0.15, 0.3].map((delay, i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-ink-2 animate-pulse2"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}
