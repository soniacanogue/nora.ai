import React from "react";
import clsx from "clsx";

// Nota: clsx es una pequeña librería auxiliar.
// Una vez copies los archivos, ejecuta en tu terminal: npm install clsx

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}) => {
  const baseStyles =
    "w-full px-4 py-2 font-bold rounded-md transition-transform transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";

  const variantStyles = {
    primary: "bg-accent text-foreground hover:bg-accent-hover",
    secondary:
      "bg-secondary text-foreground hover:bg-primary border border-subtle",
  };

  const combinedClasses = clsx(baseStyles, variantStyles[variant], className);

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
