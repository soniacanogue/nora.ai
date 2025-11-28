import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom"; // Importar Link
import { useOrders } from "../hooks/useOrders"; // 1. Usar el hook de datos
import SearchInput from "src/shared/components/ui/SearchInput";

const OrderListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { orders, isLoading, error } = useOrders(); // 2. Obtener datos, loading y error

  // Generar sugerencias basadas en los datos de las órdenes
  const searchSuggestions = useMemo(() => {
    const suggestions = new Set();
    orders.forEach((order) => {
      if (order.id) suggestions.add(order.id);
      if (order.cliente?.correo) suggestions.add(order.cliente.correo);
      if (order.numeroSeguimiento) suggestions.add(order.numeroSeguimiento);
      if (order.transportista) suggestions.add(order.transportista);
    });
    return Array.from(suggestions);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    // 3. Usar `orders` del hook en lugar de `mockOrdenes`
    if (!searchTerm.trim()) {
      return orders;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    // 4. Adaptar el filtro a la estructura de datos correcta
    // Buscar en todos los campos: ID, email, tracking, transportista y estado
    return orders.filter(
      (order) =>
        (order.id && order.id.toLowerCase().includes(lowercasedTerm)) ||
        (order.cliente?.correo &&
          order.cliente.correo.toLowerCase().includes(lowercasedTerm)) ||
        (order.numeroSeguimiento &&
          order.numeroSeguimiento.toLowerCase().includes(lowercasedTerm)) ||
        (order.transportista &&
          order.transportista.toLowerCase().includes(lowercasedTerm)) ||
        (order.estado &&
          order.estado.toLowerCase().includes(lowercasedTerm))
    );
  }, [searchTerm, orders]); // 5. Añadir `orders` a las dependencias

  if (isLoading) {
    return <div>Cargando órdenes...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-dt-foreground flex-shrink-0">
          Órdenes Importadas
        </h1>
        <div className="w-full md:flex-1 md:max-w-none lg:max-w-4xl xl:max-w-5xl">
          <SearchInput
            id="search"
            label="Buscar"
            placeholder="Buscar por ID, email, tracking, transportista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            suggestions={searchSuggestions}
          />
        </div>
      </div>

      <div className="bg-dt-primary border border-secondary rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-dt-secondary text-left text-dt-subtle text-sm">
              <tr>
                <th className="p-4 whitespace-nowrap">ID de Orden</th>
                <th className="p-4 whitespace-nowrap">Email del Cliente</th>
                <th className="p-4 whitespace-nowrap">Estado</th>
                <th className="p-4 whitespace-nowrap">Nº de Seguimiento</th>
                <th className="p-4 whitespace-nowrap">Transportista</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-secondary">
                    <td className="p-4 font-mono text-dt-foreground whitespace-nowrap">
                      {/* 6. Enlazar al detalle de la orden si existe */}
                      <Link
                        to={`/orders/${order.id}`}
                        className="hover:underline"
                      >
                        {order.id}
                      </Link>
                    </td>
                    {/* 7. Usar la estructura correcta para el correo */}
                    <td className="p-4 text-dt-subtle whitespace-nowrap">
                      {order.cliente?.correo || "N/A"}
                    </td>
                    <td className="p-4 text-dt-foreground whitespace-nowrap">{order.estado}</td>
                    <td className="p-4 font-mono text-dt-subtle whitespace-nowrap">
                      {order.numeroSeguimiento || "N/A"}
                    </td>
                    <td className="p-4 text-dt-foreground whitespace-nowrap">
                      {order.transportista}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-dt-subtle">
                    No se encontraron órdenes que coincidan con tu búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderListPage;
