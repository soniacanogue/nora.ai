// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dt-background": "#0D1117",
        "dt-primary": "#161B22",
        "dt-secondary": "#21262D",
        "dt-accent": {
          DEFAULT: "#8A2BE2",
          hover: "#9932CC",
        },
        "dt-foreground": "#FFFFFF",
        "dt-subtle": "#8B949E",
      },
      boxShadow: {
        sharp: "4px 4px 0px 0px rgba(0,0,0,0.9)",
      },
    },
  },
  plugins: [],
};
