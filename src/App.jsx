// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';

// Variable de simulación para saber si el usuario está logueado.
// Más adelante, esto vendrá de nuestro hook de autenticación.
const isAuthenticated = true; // <-- CAMBIA ESTO A `false` PARA VER EL LOGIN

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated) {
    // Redirigir al login si no está autenticado
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Ruta Protegida para el Dashboard */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Puedes añadir más rutas protegidas aquí */}
        {/* <Route path="/tickets" element={<ProtectedRoute><TicketListPage /></ProtectedRoute>} /> */}

        {/* Ruta por defecto: si está logueado va al dashboard, si no, al login */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;


// function App() {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D1117] text-white">
//       <h1 className="text-5xl font-bold text-purple-400 mb-4">🚀 TailwindCSS funciona 🎉</h1>
//       <p className="text-lg text-gray-300">
//         Estás listo para diseñar NORA AI con Tailwind 3.
//       </p>
//     </div>
//   );
// }

// export default App;


