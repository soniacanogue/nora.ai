import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom"; // Importar Link
import { useOrders } from "../hooks/useOrders"; // 1. Usar el hook de datos
import Input from "src/shared/components/ui/Input";

const OrderListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { orders, isLoading, error } = useOrders(); // 2. Obtener datos, loading y error

  const filteredOrders = useMemo(() => {
    // 3. Usar `orders` del hook en lugar de `mockOrdenes`
    if (!searchTerm.trim()) {
      return orders;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    // 4. Adaptar el filtro a la estructura de datos correcta
    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(lowercasedTerm) ||
        (order.cliente?.correo &&
          order.cliente.correo.toLowerCase().includes(lowercasedTerm)) ||
        (order.numeroSeguimiento &&
          order.numeroSeguimiento.toLowerCase().includes(lowercasedTerm)),
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
          <thead className="bg-secondary text-left text-subtle text-sm">
            <tr>
              <th className="p-4">ID de Orden</th>
              <th className="p-4">Email del Cliente</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Nº de Seguimiento</th>
              <th className="p-4">Transportista</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-secondary">
                  <td className="p-4 font-mono text-foreground">
                    {/* 6. Enlazar al detalle de la orden si existe */}
                    <Link
                      to={`/orders/${order.id}`}
                      className="hover:underline"
                    >
                      {order.id}
                    </Link>
                  </td>
                  {/* 7. Usar la estructura correcta para el correo */}
                  <td className="p-4 text-subtle">
                    {order.cliente?.correo || "N/A"}
                  </td>
                  <td className="p-4 text-foreground">{order.estado}</td>
                  <td className="p-4 font-mono text-subtle">
                    {order.numeroSeguimiento || "N/A"}
                  </td>
                  <td className="p-4 text-foreground">{order.transportista}</td>
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
