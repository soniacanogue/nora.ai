import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// --- Core Providers & Layouts ---
import { AuthProvider } from "./shared/hooks/useAuth";
import AppLayout from "./shared/components/layout/AppLayout";
import ProtectedRoute from "./shared/components/ProtectedRoute";

// --- Page Components ---
// Sugerencia: Mover HomePage a una carpeta más genérica como /src/pages
import LoginPage from "./features/auth/pages/LoginPage";
import TicketListPage from "./features/tickets/pages/TicketListPage";
import TicketDetailPage from "./features/tickets/pages/TicketDetailPage";
import ImportOrdersPage from "./features/orders/pages/ImportOrdersPage";
import OrderListPage from "./features/orders/pages/OrderListPage";
import NewTicketPage from "./features/tickets/pages/NewTicketPage";
import AdminDashboardPage from "./features/dashboard/pages/AdminDashboardPage";
import HomePage from "./features/dashboard/pages/HomePage";

// Componente simple para una página 404
const NotFoundPage = () => (
  <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
    <h1 className="text-4xl font-bold">404 - Página No Encontrada</h1>
    <p className="mt-4 text-subtle">La página que buscas no existe.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#161B22",
              color: "#FFFFFF",
              border: "1px solid #21262D",
            },
          }}
        />
        <Routes>
          {/* --- RUTAS PÚBLICAS --- */}
          {/* Accesibles para todos, sin layout de la aplicación */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/new-ticket" element={<NewTicketPage />} />

          {/* --- GRUPO DE RUTAS PROTEGIDAS --- */}
          {/* Todas las rutas anidadas aquí requieren autenticación (AGENTE o ADMINISTRADOR) */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["ADMINISTRADOR", "AGENTE"]} />
            }
          >
            {/* Todas las rutas anidadas aquí también obtienen el layout principal (sidebar, etc.) */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/tickets" element={<TicketListPage />} />
              <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
              <Route path="/import" element={<ImportOrdersPage />} />
              <Route path="/orders" element={<OrderListPage />} />

              {/* --- SUBGRUPO DE RUTAS SOLO PARA ADMIN --- */}
              {/* Este grupo anidado añade una capa extra de seguridad. */}
              {/* Requiere ser AGENTE/ADMIN (por la capa exterior) Y ADEMÁS ser ADMINISTRADOR (por esta capa) */}
              <Route
                element={<ProtectedRoute allowedRoles={["ADMINISTRADOR"]} />}
              >
                <Route
                  path="/admin/dashboard"
                  element={<AdminDashboardPage />}
                />
                {/* Otras rutas de admin irían aquí, ej: /admin/users */}
              </Route>
            </Route>
          </Route>

          {/* --- RUTA CATCH-ALL PARA PÁGINAS NO ENCONTRADAS --- */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
