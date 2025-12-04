import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// --- Core Providers & Layouts ---
import { AuthProvider } from "./shared/hooks/useAuth";
import AppLayout from "./shared/components/layout/AppLayout";
import ProtectedRoute from "./shared/components/ProtectedRoute";

// --- Page Components ---
import LoginPage from "./features/auth/pages/LoginPage";
import TicketListPage from "./features/tickets/pages/TicketListPage";
import TicketDetailPage from "./features/tickets/pages/TicketDetailPage";
import ImportOrdersPage from "./features/orders/pages/ImportOrdersPage";
import OrderListPage from "./features/orders/pages/OrderListPage";
import NewTicketPage from "./features/tickets/pages/NewTicketPage";
import AdminDashboardPage from "./features/dashboard/pages/AdminDashboardPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import HomePage from "./features/dashboard/pages/HomePage";

// --- NUEVO: Importaciones para las páginas de administración de Agentes AI ---
// Nota: La ruta de importación se basa en la que proporcionaste.
// Si moviste los archivos, asegúrate de que apunten a la ubicación correcta.
// Por ejemplo, si están en la raíz de 'ai-agents', sería: './features/admin/ai-agents/AgentListPage'
import { AgentListPage } from "./features/admin/ai-agents/pages/AgentListPage";
import { AgentFormPage } from "./features/admin/ai-agents/pages/AgentFormPage";

// --- NUEVO: Importaciones para Plantillas ---
import { TemplateListPage } from "./features/admin/ai-agents/templates/TemplateListPage";
import { TemplateFormPage } from "./features/admin/ai-agents/templates/TemplateFormPage";

// Componente simple para una página 404
const NotFoundPage = () => (
  <div className="flex h-screen flex-col items-center justify-center bg-dt-background text-dt-foreground">
    <h1 className="text-4xl font-bold">404 - Página No Encontrada</h1>
    <p className="mt-4 text-dt-subtle">La página que buscas no existe.</p>
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/new-ticket" element={<NewTicketPage />} />

          {/* --- GRUPO DE RUTAS PROTEGIDAS (AGENTE Y ADMIN) --- */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["ADMINISTRADOR", "AGENTE"]} />
            }
          >
            {/* Todas estas rutas usan el layout principal */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/tickets" element={<TicketListPage />} />
              <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
              <Route path="/import" element={<ImportOrdersPage />} />
              <Route path="/orders" element={<OrderListPage />} />
              {/* --- AJUSTE: La ruta /admin/dashboard se ha movido a su propio grupo de rutas de admin más abajo --- */}
            </Route>
          </Route>

          {/* --- NUEVO: GRUPO DE RUTAS DE ADMINISTRACIÓN (SOLO ADMIN) --- */}
          {/* Todas las rutas anidadas aquí requieren rol de ADMINISTRADOR */}
          <Route element={<ProtectedRoute allowedRoles={["ADMINISTRADOR"]} />}>
            {/* Usamos una ruta padre '/admin' para que todas las rutas de admin también usen el AppLayout */}
            <Route path="/admin" element={<AppLayout />}>
              {/* La ruta para el dashboard de admin es ahora /admin/dashboard */}
              <Route path="dashboard" element={<AdminDashboardPage />} />

              {/* Rutas para la gestión de Agentes de IA anidadas bajo /admin/ai-agents */}
              <Route path="ai-agents" element={<AgentListPage />} />
              <Route path="ai-agents/edit/:id" element={<AgentFormPage />} />

              {/* --- NUEVO: Rutas para la gestión de Plantillas --- */}
              <Route path="templates" element={<TemplateListPage />} />
              <Route path="templates/edit/:id" element={<TemplateFormPage />} />
              {/* Podrías añadir más rutas de admin aquí en el futuro (ej. /admin/users, etc.) */}
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
