// src/pages/tickets/TicketListPage.jsx
import React from 'react';
import AppLayout from '../../layouts/AppLayout';
import Button from '../../components/ui/Button'; // Importamos nuestro botón

const TicketListPage = () => {
  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Bandeja de Entrada</h1>
        {/* Más adelante este botón podría tener una función */}
        <Button variant="secondary" className="w-auto">Crear Ticket</Button>
      </div>

      <div className="bg-primary border border-secondary rounded-lg p-6 text-center">
        <h3 className="text-xl text-foreground">Próximamente...</h3>
        <p className="text-subtle mt-2">Aquí se mostrará la tabla con la lista de tickets pendientes.</p>
      </div>
    </AppLayout>
  );
};

export default TicketListPage;