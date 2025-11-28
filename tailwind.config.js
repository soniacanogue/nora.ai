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
        secondary: "#21262D", // Alias para usar border-secondary
        "dt-accent": {
          DEFAULT: "#8A2BE2",
          hover: "#9932CC",
        },
        accent: "#8A2BE2", // Alias para usar border-accent
        "dt-foreground": "#FFFFFF",
        "dt-subtle": "#8B949E",
        subtle: "#8B949E", // Alias para usar text-subtle
      },
      boxShadow: {
        sharp: "4px 4px 0px 0px rgba(0,0,0,0.9)",
      },
    },
  },
  plugins: [],
};
