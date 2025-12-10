import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTicket } from "../hooks/useTicket";
import { useTicketRealtime } from "../hooks/useTicketRealtime";
import { TicketHeader } from "./components/TicketHeader";
import { TicketSidebar } from "./components/TicketSidebar";
import { TicketConversation } from "./components/TicketConversation";
import { TicketModals } from "./components/TicketModals";
import { TicketSkeleton } from "./components/TicketSkeleton";


const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const { data: ticket, isLoading, isError } = useTicket(ticketId);
  useTicketRealtime(ticketId);

  // Estado para modales
  const [modals, setModals] = useState({ resolve: false, merge: false, note: false });
  const toggleModal = (key, value) => setModals(prev => ({ ...prev, [key]: value }));

  if (isLoading) return <TicketSkeleton />;
  if (isError || !ticket) return <div className="flex items-center justify-center h-screen text-center text-dt-error">Error o ticket no encontrado</div>;

  return (
    <div className="flex flex-col h-ticket-detail overflow-hidden bg-dt-background">
      {/* HEADER: Fijo arriba */}
      <div className="flex-none border-b border-white/5 bg-dt-background z-20">
        <TicketHeader ticket={ticket} onOpenResolve={() => toggleModal('resolve', true)} />
      </div>
      {/* CUERPO: Dividido en 2 columnas (Chat vs Sidebar) */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Conversación: scroll independiente, responsive */}
        <main className="flex-1 overflow-y-auto relative bg-gradient-to-br from-transparent to-white/[0.02]">
          <div className="mx-auto min-h-full flex flex-col w-full max-w-4xl px-2 sm:px-6 pb-20">
            <TicketConversation ticket={ticket} />
          </div>
        </main>
        {/* Sidebar: responsive, oculta en mobile, drawer en mobile si lo deseas */}
        <aside className="w-full md:w-[400px] flex-none border-t md:border-t-0 md:border-l border-white/10 glass overflow-y-auto custom-scrollbar">
          <TicketSidebar
            ticket={ticket}
            onOpenMerge={() => toggleModal('merge', true)}
            onOpenNote={() => toggleModal('note', true)}
          />
        </aside>
      </div>
      {/* Modales centralizados */}
      <TicketModals
        ticket={ticket}
        state={modals}
        onClose={key => toggleModal(key, false)}
      />
    </div>
  );
};

export default TicketDetailPage;
