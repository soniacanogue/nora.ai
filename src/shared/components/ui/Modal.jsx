import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Contenedor del Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dt-background border border-white/10 rounded-lg shadow-glow z-50 w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Encabezado del Modal */}
        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
          <h2 className="text-lg font-bold text-dt-foreground uppercase tracking-wider">{title}</h2>
          <button
            onClick={onClose}
            className="text-dt-subtle hover:text-dt-foreground text-2xl transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Contenido del Modal */}
        <div>{children}</div>
      </div>
    </>,
    document.getElementById("modal-root") // Necesitaremos añadir este div en index.html
  );
};

export default Modal;
