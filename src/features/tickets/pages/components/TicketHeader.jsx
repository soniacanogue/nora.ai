import React from "react";
import { Link } from "react-router-dom";
import Button from "src/shared/components/ui/Button";

export const TicketHeader = ({ ticket, onOpenResolve }) => (
  <header className="px-4 sm:px-6 py-4 flex justify-between items-center bg-dt-background">
    <div className="flex flex-col gap-1 min-w-0">
      <div className="flex items-center gap-3 text-xs text-dt-subtle uppercase tracking-wider">
        <Link to="/tickets" className="hover:text-white transition-colors">
          ← Bandeja
        </Link>
        <span className="text-white/20">/</span>
        <span className="font-mono truncate">ID: {ticket.id}</span>
        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
          {ticket.estado}
        </span>
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-2xl">
        {ticket.asunto}
      </h1>
    </div>
    <div className="flex items-center gap-3">
      {/* Aquí podrías poner avatares de agentes asignados */}
      <div className="h-6 w-px bg-white/10 mx-2" />
      <Button variant="ghost" size="sm" onClick={onOpenResolve}>
        ✓ Marcar Resuelto
      </Button>
    </div>
  </header>
);

export default TicketHeader;
