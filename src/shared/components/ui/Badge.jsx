import React from "react";
import clsx from "clsx";

const Badge = ({ children, variant = "default", className = "" }) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm";

  const variants = {
    default: "bg-white/5 text-dt-foreground border-white/10",
    accent: "bg-dt-accent/10 text-dt-accent border-dt-accent/20 shadow-glow",
    success:
      "bg-dt-success/10 text-dt-success border-dt-success/20 shadow-glow-success",
    error: "bg-dt-error/10 text-dt-error border-dt-error/20 shadow-glow-error",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <span className={clsx(baseStyles, variants[variant], className)}>
      {children}
    </span>
  );
};

export default Badge;
