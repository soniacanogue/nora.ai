// src/features/tickets/components/OrderInfoPanel.jsx
import React from "react";

const OrderInfoPanel = ({ order }) => {
  if (!order) {
    return null;
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "entregado":
        return "bg-dt-green-700 text-dt-green-200";
      case "en_transito":
        return "bg-dt-blue-700 text-dt-blue-200";
      case "procesando":
        return "bg-dt-yellow-700 text-dt-yellow-200";
      case "cancelado":
        return "bg-dt-red-700 text-dt-red-200";
      default:
        return "bg-dt-gray-700 text-dt-gray-200";
    }
  };

  return (
    <div className="bg-dt-primary border border-secondary rounded-lg p-6 mb-6">
      <h3 className="text-dt-lg font-bold text-dt-foreground mb-4">
        Información de la Orden
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-dt-subtle">ID de Orden:</span>
          <span className="text-dt-foreground font-medium">{order.id}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-dt-subtle">Estado:</span>
          <span
            className={`px-2 py-1 rounded text-dt-xs font-semibold ${getStatusBadgeColor(order.estado)}`}
          >
            {order.estado}
          </span>
        </div>

        {order.transportista && (
          <div className="flex justify-between">
            <span className="text-dt-subtle">Transportista:</span>
            <span className="text-dt-foreground">{order.transportista}</span>
          </div>
        )}

        {order.numeroSeguimiento && (
          <div className="flex justify-between">
            <span className="text-dt-subtle">Tracking:</span>
            <span className="text-dt-foreground font-mono text-dt-sm">
              {order.numeroSeguimiento}
            </span>
          </div>
        )}

        {order.articulos && order.articulos.length > 0 && (
          <div className="mt-4">
            <span className="text-dt-subtle text-dt-sm">Artículos:</span>
            <ul className="mt-2 space-y-2">
              {order.articulos.map((item, index) => (
                <li
                  key={index}
                  className="text-dt-foreground text-dt-sm flex justify-between"
                >
                  <span>{item.nombre}</span>
                  <span className="text-dt-subtle">x{item.cantidad}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {order.total && (
          <div className="flex justify-between pt-3 border-t border-secondary mt-3">
            <span className="text-dt-subtle font-semibold">Total:</span>
            <span className="text-dt-foreground font-bold">${order.total}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderInfoPanel;
