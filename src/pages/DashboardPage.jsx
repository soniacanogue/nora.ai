// src/pages/DashboardPage.jsx
import React from 'react';
import AppLayout from '../layouts/AppLayout';

const DashboardPage = () => {
  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-foreground">Dashboard Principal</h1>
      <p className="text-subtle mt-2">Bienvenido, Agente. Aquí irán tus métricas.</p>
    </AppLayout>
  );
};

export default DashboardPage;