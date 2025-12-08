import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomers } from "../hooks/useCustomer";
import SearchInput from "@/shared/components/ui/SearchInput";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";

const CustomerListSkeleton = () => (
  <div className="animate-pulse space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="h-20 bg-white/5 rounded-lg"></div>
    ))}
  </div>
);

const CustomerListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: customers = [], isLoading, isError, error } = useCustomers();

  // Filter customers based on search
  const filteredCustomers = customers.filter((customer) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      customer.nombre?.toLowerCase().includes(query) ||
      customer.correo?.toLowerCase().includes(query) ||
      customer.telefono?.includes(query)
    );
  });

  const handleCustomerClick = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Clientes</h1>
        <CustomerListSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Clientes</h1>
        <ErrorState message={error?.message || "Error al cargar clientes"} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Clientes</h1>
        <p className="text-dt-subtle">
          Gestiona y consulta el historial de tus clientes
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre, email o teléfono..."
          className="max-w-md"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-dt-subtle text-sm mb-1">Total Clientes</div>
          <div className="text-2xl font-bold text-white">{customers.length}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-dt-subtle text-sm mb-1">Resultados</div>
          <div className="text-2xl font-bold text-white">{filteredCustomers.length}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-dt-subtle text-sm mb-1">Con Tickets</div>
          <div className="text-2xl font-bold text-white">
            {customers.filter(c => c.tickets?.length > 0 || c.ticketsCount > 0).length}
          </div>
        </div>
      </div>

      {/* Customer List */}
      {filteredCustomers.length === 0 ? (
        <EmptyState>
          {searchQuery 
            ? `No se encontraron clientes que coincidan con "${searchQuery}"`
            : "No hay clientes registrados en el sistema"}
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {filteredCustomers.map((customer) => {
            const ticketCount = customer.tickets?.length || customer.ticketsCount || 0;
            const orderCount = customer.ordenes?.length || customer.ordenesCount || 0;
            
            return (
              <div
                key={customer.id}
                onClick={() => handleCustomerClick(customer.id)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-dt-accent/30 rounded-lg p-4 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-2xl text-dt-accent">
                        person
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate group-hover:text-dt-accent transition-colors">
                          {customer.nombre || customer.name || "Sin nombre"}
                        </h3>
                        <p className="text-sm text-dt-subtle truncate">
                          {customer.correo || customer.email || "Sin email"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-dt-subtle ml-11">
                      {customer.telefono && (
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">phone</span>
                          <span>{customer.telefono}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">confirmation_number</span>
                        <span>{ticketCount} ticket{ticketCount !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">inventory_2</span>
                        <span>{orderCount} orden{orderCount !== 1 ? 'es' : ''}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 ml-4">
                    <span className="material-symbols-outlined text-dt-subtle group-hover:text-dt-accent transition-colors">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerListPage;
