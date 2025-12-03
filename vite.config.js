import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: "/src",
      "@": "/src",
    },
  },
  server: {
    port: 4000, // Puerto fijo
    strictPort: true, // No intentar otros puertos si 3000 está ocupado
  },
});
