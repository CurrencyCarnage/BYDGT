import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── BYD Standard Brand Colors ────────────────────────────
        byd: {
          red: "#D70C19",        // Official BYD red (C10 M100 Y100 K0 / #D70C19)
          gray: "#686D71",       // Pantone Cool Gray 11C — logo gray
          white: "#FFFFFF",
          dark: "#252728",       // Background Dark from spec
        },

        // ── BYD Primary Color Scale (grays) ──────────────────────
        primary: {
          900: "#252728",        // Background Dark
          800: "#4E5356",        // Primary darkest gray
          700: "#7A8080",        // Primary mid gray
          400: "#D4D8DB",        // Primary light gray
          100: "#EFEFEF",        // Primary lightest gray
          50:  "#FFFFFF",        // White
        },

        // ── BYD Secondary Colors #1 (blue-teal) ──────────────────
        blue: {
          900: "#38518E",
          700: "#4D83B1",
          500: "#75ACD0",
          300: "#9FCECE",
        },

        // ── BYD Secondary Colors #2 ───────────────────────────────
        accent2: {
          green:  "#78B254",
          purple: "#5B4A87",
          orange: "#CE5A3E",
        },

        // ── Background tokens ─────────────────────────────────────
        bg: {
          dark:       "#252728",   // BYD spec Background Dark
          darkAlt:    "#2C2F30",   // Slightly lighter dark
          grey:       "#EFEFEF",   // BYD spec Background Grey
          greyDark:   "#E7E7E7",   // BYD spec Background Grey Dark
          white:      "#FFFFFF",
        },

        // ── Glass overlay layer (retained for hero/media sections) ─
        glass: {
          fill:         "rgba(200,210,225,0.06)",
          border:       "rgba(200,210,225,0.12)",
          "border-hover": "rgba(200,210,225,0.25)",
        },

        // ── Text tokens ───────────────────────────────────────────
        text: {
          primary:   "#FFFFFF",
          secondary: "#D4D8DB",
          muted:     "#7A8080",
          dark:      "#252728",
          darkMuted: "#4E5356",
        },

        // ── Vehicle type badges ───────────────────────────────────
        badge: {
          ev:      "#78B254",          // BYD accent2 green
          "ev-bg": "rgba(120,178,84,0.15)",
          phev:    "#CE5A3E",          // BYD accent2 orange
          "phev-bg": "rgba(206,90,62,0.12)",
        },

        // ── Semantic action colors (BYD spec) ─────────────────────
        success: "#28811F",
        warning: "#CE5A3E",
        error:   "#BB0A0A",
      },

      // ── Typography — Montserrat only (BYD spec) ──────────────────
      fontFamily: {
        sans:  ["var(--font-montserrat)", "Montserrat", "system-ui", "sans-serif"],
        brand: ["var(--font-montserrat)", "Montserrat", "system-ui", "sans-serif"],
      },

      // ── BYD Font Size Scale (from spec sheet) ────────────────────
      fontSize: {
        // Headings (all SemiBold 600)
        "h1": ["3.5rem",  { lineHeight: "1.375", fontWeight: "600" }],  // 56px
        "h2": ["3rem",    { lineHeight: "1.33",  fontWeight: "600" }],  // 48px
        "h3": ["2.5rem",  { lineHeight: "1.35",  fontWeight: "600" }],  // 40px
        "h4": ["2rem",    { lineHeight: "1.375", fontWeight: "600" }],  // 32px
        "h4b": ["1.625rem",{ lineHeight: "1.38", fontWeight: "600" }],  // 26px
        "h5": ["1.5rem",  { lineHeight: "1.4",   fontWeight: "600" }],  // 24px
        "h6": ["1.25rem", { lineHeight: "1.4",   fontWeight: "600" }],  // 20px
        "h7": ["1rem",    { lineHeight: "1.5",   fontWeight: "600" }],  // 16px
        "h8": ["0.875rem",{ lineHeight: "1.5",   fontWeight: "600" }],  // 14px
        // Body text
        "body1": ["1rem",    { lineHeight: "1.5", fontWeight: "400" }], // 16px Text 1
        "body2": ["0.875rem",{ lineHeight: "1.57",fontWeight: "400" }], // 14px Text 2
        "body3": ["0.75rem", { lineHeight: "1.5", fontWeight: "400" }], // 12px Text 3
        // Legacy aliases kept for compatibility
        "display-lg": ["3.5rem",  { lineHeight: "1.1",  letterSpacing: "-0.02em", fontWeight: "700" }],
        "display":    ["3rem",    { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading":    ["2rem",    { lineHeight: "1.2",  letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg":    ["1.125rem",{ lineHeight: "1.6",  fontWeight: "400" }],
        "caption":    ["0.75rem", { lineHeight: "1.4",  letterSpacing: "0.08em",  fontWeight: "500" }],
      },

      // ── BYD Design: SHARP CORNERS (0px border-radius per spec) ──
      borderRadius: {
        none:      "0px",
        card:      "0px",    // BYD spec: no rounded corners
        button:    "0px",    // BYD spec: sharp buttons
        container: "0px",
        pill:      "9999px", // Only for dots/pips in slider
      },

      backdropBlur: {
        glass: "12px",
        nav:   "16px",
      },

      boxShadow: {
        // BYD-appropriate shadows
        "glow":       "0 0 24px rgba(215,12,25,0.20)",
        "glow-lg":    "0 0 48px rgba(215,12,25,0.28)",
        "glow-sm":    "0 0 12px rgba(215,12,25,0.14)",
        "glow-gray":  "0 0 24px rgba(104,109,113,0.25)",
        "card":       "0 8px 32px rgba(0,0,0,0.45)",
        "card-hover": "0 16px 48px rgba(0,0,0,0.65)",
        "nav":        "0 4px 30px rgba(0,0,0,0.5)",
      },

      backgroundImage: {
        // BYD dark gradient (near-black, not blue-tinted)
        "byd-dark-gradient":  "linear-gradient(135deg, #2C2F30, #252728)",
        "byd-red-gradient":   "linear-gradient(135deg, #D70C19, #A80912)",
        "hero-gradient":      "linear-gradient(180deg, transparent 40%, #252728 100%)",
        "section-gradient":   "linear-gradient(180deg, #252728 0%, #2C2F30 50%, #252728 100%)",
        "card-gradient":      "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
      },

      animation: {
        "fade-in":      "fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-up":     "slideUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-in-left":"slideInLeft 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "glow-pulse":   "glowPulse 3s ease-in-out infinite",
        "ticker":       "ticker 30s linear infinite",
        "float":        "float 6s ease-in-out infinite",
      },

      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%":   { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 24px rgba(215,12,25,0.20)" },
          "50%":      { boxShadow: "0 0 48px rgba(215,12,25,0.35)" },
        },
        ticker: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },

      maxWidth: {
        container: "1280px",
      },

      spacing: {
        "section-sm": "5rem",
        "section-lg": "8rem",
      },
    },
  },
  plugins: [],
};
export default config;
