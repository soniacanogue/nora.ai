// src/components/tickets/TicketRow.jsx
import React from 'react';

// Un pequeño componente para las "píldoras" de estado y etiquetas
const Badge = ({ text, color }) => (
  <span className={`px-2 py-1 text-xs font-bold rounded-full ${color}`}>
    {text}
  </span>
);

const TicketRow = ({ ticket }) => {
  const statusConfig = {
    sugerido: { text: 'SUGERIDO', color: 'bg-green-500 text-white' },
    escalado: { text: 'ESCALADO', color: 'bg-yellow-500 text-black' },
    nuevo: { text: 'NUEVO', color: 'bg-blue-500 text-white' },
    cerrado: { text: 'CERRADO', color: 'bg-gray-600 text-white' },
  };

  return (
    <tr className="border-b border-secondary hover:bg-secondary cursor-pointer">
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