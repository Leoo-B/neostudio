/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0B0F",
        altar: "#111117",
        card: "#15151C",
        cream: "#F5DEB3",
        oncream: "#0B0B0F",
        fg: "#F7F5F2",
        muted: { DEFAULT: "#2A2A33", fg: "#A9A9B3" },
        line: "rgba(247,245,242,0.10)",
        "line-strong": "rgba(247,245,242,0.18)",
        danger: "#F8716F",
        // shadcn semantic colors (map ke CSS vars di styles.css)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        head: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.4)",
        lift: "0 12px 32px rgba(0,0,0,0.45)",
        glow: "0 0 24px rgba(245,222,179,0.12)",
      },
      borderRadius: {
        nb: "12px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
}
