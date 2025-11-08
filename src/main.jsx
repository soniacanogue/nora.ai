// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
// 1. Importa las herramientas necesarias de React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import "./index.css";

// 2. Crea una instancia del cliente. Esto se hace una sola vez.
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 3. Envuelve tu aplicación con el Provider, pasándole el cliente */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
