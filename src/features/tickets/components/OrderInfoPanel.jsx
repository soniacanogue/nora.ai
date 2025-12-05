// src/features/tickets/components/OrderInfoPanel.jsx
import React from "react";

const OrderInfoPanel = ({ order }) => {
  if (!order) {
    return null;
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "entregado":
        return "bg-dt-success/10 text-dt-success border border-dt-success/20";
      case "en_transito":
        return "bg-dt-accent/10 text-dt-accent border border-dt-accent/20 shadow-glow";
      case "procesando":
        return "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20";
      case "cancelado":
        return "bg-dt-error/10 text-dt-error border border-dt-error/20";
      default:
        return "bg-white/5 text-dt-subtle border border-white/10";
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6 backdrop-blur-md hover:shadow-glow transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
        <h3 className="text-xs font-bold text-dt-subtle uppercase tracking-wider">
            Información de la Orden
        </h3>
        <span className="material-symbols-outlined text-dt-subtle">inventory_2</span>
      </div>

      <div className="space-y-4 font-mono text-sm">
        <div className="flex justify-between items-center">
          <span className="text-dt-subtle text-xs">ID de Orden</span>
          <span className="text-dt-foreground font-bold tracking-wide">{order.id}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-dt-subtle text-xs">Estado</span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeColor(order.estado)}`}
          >
            {order.estado}
          </span>
        </div>

        {order.transportista && (
          <div className="flex justify-between items-center">
            <span className="text-dt-subtle text-xs">Transportista</span>
            <span className="text-dt-foreground">{order.transportista}</span>
          </div>
        )}

        {order.numeroSeguimiento && (
          <div className="flex justify-between items-center">
            <span className="text-dt-subtle text-xs">Tracking</span>
            <span className="text-dt-accent cursor-pointer hover:underline">
              {order.numeroSeguimiento}
            </span>
          </div>
        )}

        {order.articulos && order.articulos.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <span className="text-dt-subtle text-xs block mb-2">Artículos</span>
            <ul className="space-y-2">
              {order.articulos.map((item, index) => (
                <li
                  key={index}
                  className="text-dt-foreground flex justify-between items-center bg-black/20 p-2 rounded border border-white/5"
                >
                  <span className="font-sans text-xs">{item.nombre}</span>
                  <span className="text-dt-subtle text-xs">x{item.cantidad}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {order.total && (
          <div className="flex justify-between pt-4 border-t border-white/10 mt-4">
            <span className="text-dt-subtle font-bold text-xs uppercase">Total</span>
            <span className="text-dt-success font-bold text-lg">${order.total}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderInfoPanel;
