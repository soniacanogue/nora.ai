import React from "react";

const TicketRow = ({ ticket, onClick }) => {
  // Adapt properties to match the component's expected structure
  const status = ticket.status || ticket.prioridad || "NORMAL";
  const title = ticket.title || ticket.asunto || "Sin asunto";
  const client = ticket.client || ticket.cliente?.nombre || "Cliente desconocido";
  const id = ticket.id;

  const isUrgent = status === 'URGENTE' || status === 'alta';

  return (
    <div 
      onClick={onClick}
      className="group grid grid-cols-12 gap-4 border-b border-white/5 p-4 transition-colors hover:bg-white/[0.02] items-center text-sm cursor-pointer"
    >
      
      {/* Badge de estado: Minimalist pill */}
      <div className="col-span-2">
        <span className={`
          px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wide border
          ${isUrgent
            ? 'bg-red-500/10 text-red-400 border-red-500/20' 
            : 'bg-dt-accent-dim text-dt-accent-text border-dt-accent/20'}
        `}>
          {status}
        </span>
      </div>

      {/* Info Principal */}
      <div className="col-span-4">
        <h4 className="text-white font-medium truncate pr-4 group-hover:text-dt-accent transition-colors">
          {title}
        </h4>
        <span className="text-xs text-dt-subtle font-mono">ID: {id}</span>
      </div>

      {/* Metadatos alineados */}
      <div className="col-span-3 text-dt-subtle text-xs">
        {client}
      </div>

      <div className="col-span-3 flex justify-end">
         <button className="opacity-0 group-hover:opacity-100 transition-all duration-200 px-4 py-1.5 text-xs font-medium bg-white text-black hover:bg-dt-accent hover:text-white rounded shadow-glow">
            Procesar AI
         </button>
      </div>
    </div>
  );
};

export default TicketRow;
