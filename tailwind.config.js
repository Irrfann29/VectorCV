/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        dm: ["DM Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      colors: {
        bg: {
          DEFAULT: "#07090d",
          2: "#0b0e14",
          3: "#0f1319",
        },
        surface: {
          DEFAULT: "#121820",
          2: "#18202c",
          3: "#1e2838",
        },
        accent: {
          DEFAULT: "#3d9dff",
          2: "#00cfa8",
          3: "#f97316",
        },
        border: {
          DEFAULT: "rgba(80,160,255,0.08)",
          2: "rgba(80,160,255,0.15)",
          3: "rgba(80,160,255,0.25)",
        },
        ink: {
          DEFAULT: "#dde8f5",
          2: "#7a95b3",
          3: "#3d5470",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease both",
        shimmer: "shimmer 4s linear infinite",
        pulse2: "pulse2 2s ease-in-out infinite",
        marquee: "marquee 22s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          to: { backgroundPosition: "200% center" },
        },
        pulse2: {
          "0%,100%": { opacity: 1 },
          "50%": { opacity: 0.4 },
        },
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
