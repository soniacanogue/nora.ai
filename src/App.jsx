// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Importaciones de Páginas
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TicketListPage from './pages/tickets/TicketListPage';
import TicketDetailPage from './pages/tickets/TicketDetailPage';
import ImportOrdersPage from './pages/ImportOrdersPage';
import OrderListPage from './pages/OrderListPage';
import NewTicketPage from './pages/public/NewTicketPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage'; // 1. IMPORTAR PÁGINA DE ADMIN

// --- SIMULACIÓN DE AUTENTICACIÓN Y ROL ---
const isAuthenticated = true;
const userRole = 'admin'; // <-- 2. AÑADIR SIMULACIÓN DE ROL (CAMBIA A 'agent' PARA PROBAR)

// --- COMPONENTE DE RUTA PROTEGIDA MEJORADO ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  // 3. AÑADIR LÓGICA DE VERIFICACIÓN DE ROL
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />; // Redirige a la página principal si no tiene el rol
  }
  return children;
};

function App() {
  return (
    <Router>
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

        {/* RUTAS PROTEGIDAS (PARA TODOS LOS USUARIOS LOGUEADOS) */}
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/tickets" element={<ProtectedRoute><TicketListPage /></ProtectedRoute>} />
        <Route path="/tickets/:ticketId" element={<ProtectedRoute><TicketDetailPage /></ProtectedRoute>} />
        <Route path="/import" element={<ProtectedRoute><ImportOrdersPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderListPage /></ProtectedRoute>} />
        
        {/* 4. AÑADIR RUTA PROTEGIDA SOLO PARA ADMIN */}
        <Route 
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* RUTA POR DEFECTO */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;