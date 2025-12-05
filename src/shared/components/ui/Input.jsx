import React from "react";
import { twMerge } from "tailwind-merge";

// Fíjate que añadimos `required` a las props que desestructuramos
const Input = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-dt-subtle mb-2"
      >
        {label}
        {/* Lógica para mostrar el asterisco si el campo es requerido */}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={twMerge(
          "w-full px-3 py-2 bg-neutral-800/50 border border-white/10 rounded-md text-dt-foreground placeholder-dt-subtle focus:outline-none focus:ring-2 focus:ring-dt-accent focus:border-dt-accent focus:shadow-glow transition-all duration-300 ease-bezier-out focus:bg-neutral-700/50",
          className
        )}
        style={{
          colorScheme: "dark",
        }}
        autoComplete="off"
        required={required} // Pasamos el prop al input real
        {...props}
      />
    </div>
  );
};

export default Input;
