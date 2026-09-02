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
        line: "#F7F5F2",
        danger: "#F8716F",
      },
      fontFamily: {
        head: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        hard: "4px 4px 0 0 #F5DEB3",
        "hard-sm": "3px 3px 0 0 #F5DEB3",
        "hard-lg": "7px 7px 0 0 #F5DEB3",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      borderRadius: {
        nb: "0px",
      },
    },
  },
  plugins: [],
}