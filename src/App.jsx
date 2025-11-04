// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <-- 1. AÑADE ESTA IMPORTACIÓN

// Importaciones de las páginas de Agente
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TicketListPage from './pages/tickets/TicketListPage';
import TicketDetailPage from './pages/tickets/TicketDetailPage';
import ImportOrdersPage from './pages/ImportOrdersPage';
import OrderListPage from './pages/OrderListPage';

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
      {/* 2. AÑADE EL COMPONENTE TOASTER AQUÍ FUERA DE LAS RUTAS */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#161B22',
            color: '#FFFFFF',
            border: '1px solid #21262D',
          },
        }}
      />
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
        <Route path="/orders" element={<ProtectedRoute><OrderListPage /></ProtectedRoute>} />

        {/* RUTA POR DEFECTO */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;