import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCustomer, useCustomerTickets } from "../hooks/useCustomer";
import TicketRow from "src/features/tickets/components/TicketRow";

const CustomerDetailSkeleton = () => (
  <div className="animate-pulse max-w-5xl mx-auto p-6">
    <div className="h-6 bg-white/5 rounded w-48 mb-4"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="h-20 bg-white/5 rounded"></div>
      <div className="h-20 bg-white/5 rounded"></div>
      <div className="h-20 bg-white/5 rounded"></div>
    </div>
    <div className="space-y-3">
      <div className="h-12 bg-white/5 rounded"></div>
      <div className="h-12 bg-white/5 rounded"></div>
      <div className="h-12 bg-white/5 rounded"></div>
    </div>
  </div>
);

const EmptyState = ({ children }) => (
  <div className="p-8 text-center text-dt-subtle">{children}</div>
);

const CustomerDetailPage = () => {
  const { id: customerId } = useParams();
  const navigate = useNavigate();

  const { data: customer, isLoading: isCustomerLoading, isError: isCustomerError } = useCustomer(customerId);
  const { data: tickets = [], isLoading: isTicketsLoading } = useCustomerTickets(customerId);

  if (isCustomerLoading || isTicketsLoading) return <CustomerDetailSkeleton />;

  if (isCustomerError || !customer) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h3 className="text-white text-lg mb-2">Cliente no encontrado</h3>
        <p className="text-dt-subtle">No se pudo cargar la información del cliente.</p>
      </div>
    );
  }

  const handleTicketClick = (ticket) => {
    if (!ticket || !ticket.id) return;
    navigate(`/tickets/${ticket.id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-white">{customer.nombre || customer.name}</h1>
        <p className="text-dt-subtle">{customer.correo || customer.email}</p>
      </header>

      <section className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white/3 rounded border border-white/5">
          <h4 className="text-sm text-dt-subtle">Tickets</h4>
          <div className="text-xl font-medium">{(tickets && tickets.length) || (customer.tickets && customer.tickets.length) || 0}</div>
        </div>
        <div className="p-4 bg-white/3 rounded border border-white/5">
          <h4 className="text-sm text-dt-subtle">Órdenes</h4>
          <div className="text-xl font-medium">{(customer.ordenes && customer.ordenes.length) || 0}</div>
        </div>
        <div className="p-4 bg-white/3 rounded border border-white/5">
          <h4 className="text-sm text-dt-subtle">Teléfono</h4>
          <div className="text-md">{customer.telefono || "—"}</div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Historial de Tickets</h2>

        {(!tickets || tickets.length === 0) && (!customer.tickets || customer.tickets.length === 0) ? (
          <EmptyState>No hay tickets históricos para este cliente.</EmptyState>
        ) : (
          <div className="space-y-2">
            {(tickets && tickets.length ? tickets : customer.tickets || []).map((ticket) => (
              <TicketRow key={ticket.id || ticket._id} ticket={ticket} onClick={() => handleTicketClick(ticket)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerDetailPage;
