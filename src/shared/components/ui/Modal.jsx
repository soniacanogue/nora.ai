import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 bg-black bg-opacity-70 z-40"
        onClick={onClose}
      />

      {/* Contenedor del Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary border border-secondary rounded-lg shadow-lg z-50 w-full max-w-lg p-6">
        {/* Encabezado del Modal */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="text-subtle hover:text-foreground text-2xl"
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
