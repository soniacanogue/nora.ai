// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importaciones de las páginas de Agente
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TicketListPage from './pages/tickets/TicketListPage';
import TicketDetailPage from './pages/tickets/TicketDetailPage';
import ImportOrdersPage from './pages/ImportOrdersPage';
import OrderListPage from './pages/OrderListPage'; // <-- 1. IMPORTAR LA NUEVA PÁGINA

// Importación de la página Pública
import NewTicketPage from './pages/public/NewTicketPage';

const isAuthenticated = true;

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* RUTA PÚBLICA */}
        <Route path="/new-ticket" element={<NewTicketPage />} />

        {/* RUTAS DE AGENTE (LOGIN) */}
        <Route path="/login" element={<LoginPage />} />

        {/* RUTAS PROTEGIDAS DE AGENTE */}
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/tickets" element={<ProtectedRoute><TicketListPage /></ProtectedRoute>} />
        <Route path="/tickets/:ticketId" element={<ProtectedRoute><TicketDetailPage /></ProtectedRoute>} />
        <Route path="/import" element={<ProtectedRoute><ImportOrdersPage /></ProtectedRoute>} />
        
        {/* 👇 2. AÑADIR LA NUEVA RUTA PARA "ÓRDENES" 👇 */}
        <Route path="/orders" element={<ProtectedRoute><OrderListPage /></ProtectedRoute>} />

        {/* RUTA POR DEFECTO */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;