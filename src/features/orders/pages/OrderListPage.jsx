import React, { useState, useMemo } from "react";
import { mockOrdenes } from "@/data/mockOrders";
import AppLayout from "src/shared/components/layout/AppLayout";
import Input from "src/shared/components/ui/Input";

const OrderListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) {
      return mockOrdenes;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return mockOrdenes.filter(
      (order) =>
        order.orderId.toLowerCase().includes(lowercasedTerm) ||
        order.clientEmail.toLowerCase().includes(lowercasedTerm) ||
        (order.trackingNumber &&
          order.trackingNumber.toLowerCase().includes(lowercasedTerm))
    );
  }, [searchTerm]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Órdenes Importadas
        </h1>
        <div className="w-full md:w-auto md:max-w-xs">
          <Input
            id="search"
            label="Buscar"
            type="text"
            placeholder="Buscar por ID, email, tracking..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-primary border border-secondary rounded-lg overflow-hidden">
        <table className="w-full">
          {/* CÓDIGO DEL ENCABEZADO RESTAURADO */}
          <thead className="bg-secondary text-left text-subtle text-sm">
            <tr>
              <th className="p-4">ID de Orden</th>
              <th className="p-4">Email del Cliente</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Nº de Seguimiento</th>
              <th className="p-4">Transportista</th>
            </tr>
          </thead>
          {/* CÓDIGO DEL CUERPO RESTAURADO */}
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.orderId} className="border-b border-secondary">
                  <td className="p-4 font-mono text-foreground">
                    {order.orderId}
                  </td>
                  <td className="p-4 text-subtle">{order.clientEmail}</td>
                  <td className="p-4 text-foreground">{order.status}</td>
                  <td className="p-4 font-mono text-subtle">
                    {order.trackingNumber || "N/A"}
                  </td>
                  <td className="p-4 text-foreground">{order.carrier}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-8 text-subtle">
                  No se encontraron órdenes que coincidan con tu búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderListPage;
