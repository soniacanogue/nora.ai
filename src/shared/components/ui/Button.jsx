import React from "react";
import clsx from "clsx";

// Nota: clsx es una pequeña librería auxiliar.
// Una vez copies los archivos, ejecuta en tu terminal: npm install clsx

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  isLoading = false,
  fullWidth = true,
}) => {
  // Estilos base - aplicados a todos los botones
  const baseStyles =
    "font-semibold rounded-sm transition-all duration-200 ease-bezier-out transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap hover:scale-[1.02]";

  // Variantes de color
  const variantStyles = {
    primary:
      "bg-gradient-to-r from-dt-accent to-dt-accent-hover text-white shadow-lg shadow-dt-accent/20 hover:shadow-dt-accent/40 border border-transparent",
    secondary:
      "bg-white/5 text-dt-foreground hover:bg-white/10 border border-white/10 hover:border-dt-accent/50 backdrop-blur-sm",
    ghost:
      "text-dt-foreground hover:bg-white/5 border border-transparent hover:text-dt-accent",
    outline:
      "bg-transparent text-dt-foreground border border-white/10 hover:border-dt-accent hover:text-dt-accent hover:shadow-glow",
    danger:
      "bg-dt-error/10 text-dt-error border border-dt-error/20 hover:bg-dt-error/20 hover:shadow-glow-error",
  };

  // Tamaños - más balanceados y profesionales
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };

  // Ancho
  const widthClass = fullWidth ? "w-full" : "w-auto";

  const combinedClasses = clsx(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    widthClass,
    className,
  );

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Cargando...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
