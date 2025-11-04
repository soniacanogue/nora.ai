// src/components/tickets/TicketRow.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. IMPORTAR HOOK

const Badge = ({ text, color }) => (
  <span className={`px-2 py-1 text-xs font-bold rounded-full ${color}`}>
    {text}
  </span>
);

const TicketRow = ({ ticket }) => {
  const navigate = useNavigate(); // 2. INICIALIZAR HOOK

  // 3. CREAR FUNCIÓN DE NAVEGACIÓN
  const handleRowClick = () => {
    navigate(`/tickets/${ticket.id}`); // Navega a una URL como "/tickets/TKT-001"
  };

  const statusConfig = {
    sugerido: { text: 'SUGERIDO', color: 'bg-green-500 text-white' },
    escalado: { text: 'ESCALADO', color: 'bg-yellow-500 text-black' },
    nuevo: { text: 'NUEVO', color: 'bg-blue-500 text-white' },
    cerrado: { text: 'CERRADO', color: 'bg-gray-600 text-white' },
  };

  return (
    // 4. AÑADIR EL EVENTO ONCLICK
    <tr onClick={handleRowClick} className="border-b border-secondary hover:bg-secondary cursor-pointer transition-colors duration-150">
      <td className="p-4">
        <div className="font-bold text-foreground">{ticket.subject}</div>
        <div className="text-sm text-subtle">{ticket.client.name}</div>
      </td>
      <td className="p-4 text-center">
        <Badge 
          text={statusConfig[ticket.status]?.text || 'DESCONOCIDO'}
          color={statusConfig[ticket.status]?.color || 'bg-gray-500'}
        />
      </td>
      <td className="p-4 text-center text-foreground font-mono">
        {ticket.aiConfidence ? `${(ticket.aiConfidence * 100).toFixed(0)}%` : 'N/A'}
      </td>
      <td className="p-4">
        <div className="flex flex-wrap gap-2">
          {ticket.suggestedTags.map(tag => (
            <Badge key={tag} text={tag} color="bg-primary border border-subtle text-subtle" />
          ))}
        </div>
      </td>
    </tr>
  );
};

export default TicketRow;