import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./shared/components/ui/PageTransition";

// --- Core Providers & Layouts ---
import { AuthProvider } from "./shared/hooks/useAuth";
import AppLayout from "./shared/components/layout/AppLayout";
import ProtectedRoute from "./shared/components/ProtectedRoute";

// --- Page Components ---
import LoginPage from "./features/auth/pages/LoginPage";
import OnboardingPage from "./features/auth/pages/OnboardingPage";
import TicketListPage from "./features/tickets/pages/TicketListPage";
import TicketDetailPage from "./features/tickets/pages/TicketDetailPage";
import ImportOrdersPage from "./features/orders/pages/ImportOrdersPage";
import OrderListPage from "./features/orders/pages/OrderListPage";
import NewTicketPage from "./features/tickets/pages/NewTicketPage";
import TicketConfirmationPage from "./features/tickets/pages/TicketConfirmationPage";
import AdminDashboardPage from "./features/dashboard/pages/AdminDashboardPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import HomePage from "./features/dashboard/pages/HomePage";

// --- NUEVO: Importaciones para las páginas de administración de Agentes AI ---
import { AgentListPage } from "./features/admin/ai-agents/pages/AgentListPage";
import { AgentFormPage } from "./features/admin/ai-agents/pages/AgentFormPage";

// --- NUEVO: Importaciones para Plantillas ---
import { TemplateListPage } from "./features/admin/templates/TemplateListPage";
import { TemplateFormPage } from "./features/admin/templates/TemplateFormPage";

// --- NUEVO: Importaciones para Base de Conocimiento ---
import { KnowledgeBaseListPage } from "./features/admin/knowledge-base/pages/KnowledgeBaseListPage";
import { KnowledgeBaseFormPage } from "./features/admin/knowledge-base/pages/KnowledgeBaseFormPage";

// Componente simple para una página 404
const NotFoundPage = () => (
  <div className="flex h-screen flex-col items-center justify-center bg-dt-background text-dt-foreground">
    <h1 className="text-4xl font-bold">404 - Página No Encontrada</h1>
    <p className="mt-4 text-dt-subtle">La página que buscas no existe.</p>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* --- RUTAS PÚBLICAS --- */}
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/new-ticket" element={<PageTransition><NewTicketPage /></PageTransition>} />
        <Route path="/new-ticket/confirmation" element={<PageTransition><TicketConfirmationPage /></PageTransition>} />

        {/* --- RUTA DE ONBOARDING (PROTEGIDA) --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<PageTransition><OnboardingPage /></PageTransition>} />
        </Route>

        {/* --- GRUPO DE RUTAS PROTEGIDAS (AGENTE Y ADMIN) --- */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["ADMINISTRADOR", "AGENTE"]} />
          }
        >
          {/* Todas estas rutas usan el layout principal */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/tickets" element={<PageTransition><TicketListPage /></PageTransition>} />
            <Route path="/tickets/:ticketId" element={<PageTransition><TicketDetailPage /></PageTransition>} />
            <Route path="/import" element={<PageTransition><ImportOrdersPage /></PageTransition>} />
            <Route path="/orders" element={<PageTransition><OrderListPage /></PageTransition>} />
          </Route>
        </Route>

        {/* --- NUEVO: GRUPO DE RUTAS DE ADMINISTRACIÓN (SOLO ADMIN) --- */}
        <Route element={<ProtectedRoute allowedRoles={["ADMINISTRADOR"]} />}>
          <Route path="/admin" element={<AppLayout />}>
            <Route path="dashboard" element={<PageTransition><AdminDashboardPage /></PageTransition>} />
            <Route path="ai-agents" element={<PageTransition><AgentListPage /></PageTransition>} />
            <Route path="ai-agents/edit/:id" element={<PageTransition><AgentFormPage /></PageTransition>} />
            <Route path="templates" element={<PageTransition><TemplateListPage /></PageTransition>} />
            <Route path="templates/edit/:id" element={<PageTransition><TemplateFormPage /></PageTransition>} />
            <Route path="knowledge-base" element={<PageTransition><KnowledgeBaseListPage /></PageTransition>} />
            <Route path="knowledge-base/new" element={<PageTransition><KnowledgeBaseFormPage /></PageTransition>} />
            <Route path="knowledge-base/edit/:id" element={<PageTransition><KnowledgeBaseFormPage /></PageTransition>} />
          </Route>
        </Route>

        {/* --- RUTA CATCH-ALL PARA PÁGINAS NO ENCONTRADAS --- */}
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

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
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
