import React from "react";

// Fíjate que añadimos `required` a las props que desestructuramos
const Input = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
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
        className="w-full px-3 py-2 bg-white border border-secondary rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
        style={{
          colorScheme: "light",
        }}
        autoComplete="off"
        required={required} // Pasamos el prop al input real
        {...props}
      />
    </div>
  );
};

export default Input;
