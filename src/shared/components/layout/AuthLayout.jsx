import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dt-background p-4">
      {/* Contenedor con un ancho máximo para el formulario de login */}
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default AuthLayout;
