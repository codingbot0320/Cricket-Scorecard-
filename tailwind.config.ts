import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Cricket specific colors
        "boundary-four": "hsl(var(--boundary-four))",
        "boundary-six": "hsl(var(--boundary-six))",
        "success": "hsl(var(--primary))",
        "celebration": "hsl(var(--accent))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "field-gradient": "var(--gradient-field)",
        "scoreboard-gradient": "var(--gradient-scoreboard)",
        "celebration-gradient": "var(--gradient-celebration)",
      },
      boxShadow: {
        "glow-primary": "var(--glow-primary)",
        "glow-boundary": "var(--glow-boundary)", 
        "glow-six": "var(--glow-six)",
        "glow-success": "var(--glow-success)",
        "glow-celebration": "var(--glow-celebration)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "score-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.8" },
        },
        "wicket-flash": {
          "0%, 100%": { backgroundColor: "hsl(var(--card))" },
          "25%, 75%": { backgroundColor: "hsl(var(--destructive))" },
          "50%": { backgroundColor: "hsl(var(--card))" },
        },
        "boundary-celebration": {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "25%": { transform: "scale(1.2) rotate(-5deg)" },
          "50%": { transform: "scale(1.3) rotate(5deg)" },
          "75%": { transform: "scale(1.2) rotate(-2deg)" },
          "100%": { transform: "scale(1) rotate(0deg)" },
        },
        "float-up": {
          "0%": { transform: "translateY(0px)", opacity: "1" },
          "100%": { transform: "translateY(-30px)", opacity: "0" },
        },
        "slide-up-fade": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "card-entrance": {
          "0%": { transform: "scale(0.8) translateY(20px)", opacity: "0" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" },
        },
        "number-pop": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)" },
        },
        "celebration-burst": {
          "0%": { transform: "scale(0) rotate(0deg)", opacity: "1" },
          "50%": { transform: "scale(1.5) rotate(180deg)", opacity: "0.8" },
          "100%": { transform: "scale(2) rotate(360deg)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "score-pulse": "score-pulse 0.6s ease-in-out",
        "wicket-flash": "wicket-flash 0.8s ease-in-out",
        "boundary-celebration": "boundary-celebration 0.8s ease-in-out",
        "float-up": "float-up 2s ease-out forwards",
        "slide-up-fade": "slide-up-fade 0.5s ease-out",
        "card-entrance": "card-entrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "number-pop": "number-pop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "celebration-burst": "celebration-burst 1.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
