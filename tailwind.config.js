// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0D1117", // Nuestro fondo principal
        primary: "#161B22", // Color para contenedores, paneles, etc.
        secondary: "#21262D", // Un tono más claro para bordes o fondos sutiles
        accent: {
          DEFAULT: "#8A2BE2", // Nuestro acento principal (BlueViolet)
          hover: "#9932CC", // Un tono más oscuro para hover (DarkOrchid)
        },
        foreground: "#FFFFFF", // Nuestro texto principal
        subtle: "#8B949E", // Texto secundario o íconos
      },
      // Opcional: una sombra nítida para el estilo neobrutalista
      boxShadow: {
        sharp: "4px 4px 0px 0px rgba(0,0,0,0.9)",
      },
    },
  },
  plugins: [],
};
