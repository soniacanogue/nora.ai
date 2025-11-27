// src/features/tickets/components/OrderInfoPanel.jsx
import React from "react";

const OrderInfoPanel = ({ order }) => {
  if (!order) {
    return null;
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "entregado":
        return "bg-green-700 text-green-200";
      case "en_transito":
        return "bg-blue-700 text-blue-200";
      case "procesando":
        return "bg-yellow-700 text-yellow-200";
      case "cancelado":
        return "bg-red-700 text-red-200";
      default:
        return "bg-gray-700 text-gray-200";
    }
  };

  return (
    <div className="bg-primary border border-secondary rounded-lg p-6 mb-6">
      <h3 className="text-lg font-bold text-foreground mb-4">
        Información de la Orden
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-subtle">ID de Orden:</span>
          <span className="text-foreground font-medium">{order.id}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-subtle">Estado:</span>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeColor(order.estado)}`}
          >
            {order.estado}
          </span>
        </div>

        {order.transportista && (
          <div className="flex justify-between">
            <span className="text-subtle">Transportista:</span>
            <span className="text-foreground">{order.transportista}</span>
          </div>
        )}

        {order.numeroSeguimiento && (
          <div className="flex justify-between">
            <span className="text-subtle">Tracking:</span>
            <span className="text-foreground font-mono text-sm">
              {order.numeroSeguimiento}
            </span>
          </div>
        )}

        {order.articulos && order.articulos.length > 0 && (
          <div className="mt-4">
            <span className="text-subtle text-sm">Artículos:</span>
            <ul className="mt-2 space-y-2">
              {order.articulos.map((item, index) => (
                <li
                  key={index}
                  className="text-foreground text-sm flex justify-between"
                >
                  <span>{item.nombre}</span>
                  <span className="text-subtle">x{item.cantidad}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {order.total && (
          <div className="flex justify-between pt-3 border-t border-secondary mt-3">
            <span className="text-subtle font-semibold">Total:</span>
            <span className="text-foreground font-bold">${order.total}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderInfoPanel;
