// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dt-background": "#0A0A0A", // Deep Black
        "dt-primary": "#111111", // Slightly lighter
        "dt-secondary": "#1A1A1A", // Even lighter
        secondary: "#1A1A1A", // Alias para usar border-secondary
        "dt-surface": {
          DEFAULT: "rgba(255, 255, 255, 0.03)", // Más sutil para glassmorphism
          glass: "rgba(10, 10, 10, 0.7)", // Para fondos con blur
          border: "rgba(255, 255, 255, 0.08)", // Bordes ultra finos
          hover: "rgba(255, 255, 255, 0.1)",
          active: "rgba(255, 255, 255, 0.15)",
        },
        "dt-accent": {
          DEFAULT: "#8A2BE2", // Electric Violet
          dim: "rgba(138, 43, 226, 0.2)", // Para fondos de badges
          text: "#D8B4FE", // Texto legible sobre acento
          hover: "#9932CC",
          glow: "rgba(138, 43, 226, 0.5)",
        },
        accent: "#8A2BE2", // Alias para usar border-accent
        "dt-success": "#00FF94", // Electric Emerald
        "dt-error": "#FF0055", // Neon Pink/Red
        "dt-foreground": "#FFFFFF",
        "dt-subtle": "#8B949E",
        subtle: "#8B949E", // Alias para usar text-subtle
        
        // Cyber-Depth Neutral Palette
        neutral: {
          50: 'hsla(257, 33%, 96%, 1.00)',
          100: 'hsla(257, 33%, 89%, 1.00)',
          200: 'hsla(257, 31%, 80%, 1.00)',
          300: 'hsla(257, 27%, 70%, 1.00)',
          400: 'hsla(257, 23%, 60%, 1.00)',
          500: 'hsla(257, 22%, 49%, 1.00)',
          600: 'hsla(257, 28%, 39%, 1.00)',
          700: 'hsla(257, 34%, 30%, 1.00)',
          800: 'hsla(257, 40%, 23%, 1.00)',
          900: 'hsla(257, 61%, 16%, 1.00)', 
          950: 'hsla(257, 71%, 8%, 1.00)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        'bezier-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'subtle-glow': 'linear-gradient(to right, transparent, rgba(138, 43, 226, 0.1), transparent)',
      },
      boxShadow: {
        sharp: "4px 4px 0px 0px rgba(0,0,0,0.9)",
        glow: "0 0 15px rgba(138, 43, 226, 0.3)",
        "glow-lg": "0 0 25px rgba(138, 43, 226, 0.5)",
        "glow-success": "0 0 15px rgba(0, 255, 148, 0.3)",
        "glow-error": "0 0 15px rgba(255, 0, 85, 0.3)",
        'neon': "0 0 20px -5px rgba(138, 43, 226, 0.4)",
        'inner-light': "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "stream-text": "stream 0.5s linear forwards",
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'border-flow': 'borderFlow 3s ease infinite',
      },
      keyframes: {
        stream: {
          "0%": { opacity: "0", transform: "translateY(5px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        borderFlow: {
          '0%, 100%': { borderColor: 'rgba(138, 43, 226, 0.2)' },
          '50%': { borderColor: 'rgba(138, 43, 226, 0.6)' },
        }
      },
    },
  },
  plugins: [],
};
