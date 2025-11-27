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
  fullWidth = true,
}) => {
  // Estilos base - aplicados a todos los botones
  const baseStyles =
    "font-semibold rounded-md transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap";

  // Variantes de color
  const variantStyles = {
    primary:
      "bg-dt-accent text-dt-foreground hover:bg-dt-accent-hover active:bg-dt-accent-hover/80",
    secondary:
      "bg-dt-secondary text-dt-foreground hover:bg-dt-primary border border-subtle hover:border-accent",
    ghost: "text-dt-foreground hover:bg-white/10 border border-transparent",
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
    className
  );

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
