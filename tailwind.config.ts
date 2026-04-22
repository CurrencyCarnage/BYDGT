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
        // Core backgrounds — dark silver palette (meaningfully lighter than black)
        bg: {
          primary: "#1A1E28",
          secondary: "#1E2330",
          tertiary: "#262C38",
        },
        // Glass effects — silver-tinted, visible against lighter bg
        glass: {
          fill: "rgba(200,210,225,0.08)",
          border: "rgba(200,210,225,0.16)",
          "border-hover": "rgba(200,210,225,0.30)",
        },
        // Primary accent — bright silver / steel
        accent: {
          DEFAULT: "#B8BEC8",
          glow: "rgba(184,190,200,0.25)",
          dark: "#8A919E",
        },
        // Text — silver whites and greys
        text: {
          primary: "#FFFFFF",
          secondary: "#C4CCD8",
          muted: "#8A9099",
        },
        // BYD official brand colors (from dealership brand guide)
        byd: {
          gray: "#686D71",      // Pantone Cool Gray 11C — official logo color
          red: "#D70C19",       // Official BYD red
          white: "#FFFFFF",
        },
        // Client selected palette — greens (from color chart)
        palette: {
          "green": "#4A7C59",       // 061 Standard green
          "light-green": "#7DB87D", // 062 Light green
          "lime-green": "#8DC56C",  // 063 Lime-tree green
          "grass-green": "#5A9E4A", // 068 Grass green
          "dark-grey": "#5D6368",   // 073 Dark grey (client ✓)
          "tele-grey": "#7F8589",   // 076 Telegrey (client ✓)
          "mid-grey": "#8A8C8E",    // 074 Middle grey
          "silver-grey": "#9B9FA2", // 090 Silver grey
        },
        // GT dealer brand accent — from client green palette
        gt: {
          green: "#68D89B",         // Soft mint green for GT identity
          "green-dark": "#4A7C59",  // Deeper palette green
        },
        // Semantic
        badge: {
          ev: "#68D89B",
          "ev-bg": "rgba(104,216,155,0.15)",
          phev: "#FFB800",
          "phev-bg": "rgba(255,184,0,0.15)",
        },
        success: "#68D89B",
        error: "#D70C19",
        warning: "#FFB800",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        brand: ["var(--font-source-sans)", "'Source Sans Pro'", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["4rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        "caption": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em", fontWeight: "500" }],
      },
      borderRadius: {
        card: "0.75rem",
        button: "0.5rem",
        container: "1rem",
      },
      backdropBlur: {
        glass: "12px",
      },
      boxShadow: {
        glow: "0 0 24px rgba(184,190,200,0.28)",
        "glow-lg": "0 0 48px rgba(184,190,200,0.38)",
        "glow-sm": "0 0 12px rgba(184,190,200,0.16)",
        "glow-green": "0 0 20px rgba(104,216,155,0.2)",
        "card": "0 8px 32px rgba(0,0,0,0.4)",
        "card-hover": "0 16px 48px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #B8BEC8, #8A919E)",
        "hero-gradient": "linear-gradient(180deg, transparent 40%, #1A1E28 100%)",
        "section-gradient": "linear-gradient(180deg, #1A1E28 0%, #1E2330 50%, #1A1E28 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-up": "slideUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-in-left": "slideInLeft 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "ticker": "ticker 30s linear infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 24px rgba(184,190,200,0.28)" },
          "50%": { boxShadow: "0 0 48px rgba(184,190,200,0.42)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
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
