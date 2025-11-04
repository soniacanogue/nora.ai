// src/components/ui/Input.jsx
import React from 'react';

const Input = ({ id, label, type = 'text', placeholder, value, onChange, ...props }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-subtle mb-2">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 bg-background border border-secondary rounded-md text-foreground placeholder-subtle focus:outline-none focus:ring-2 focus:ring-accent"
        {...props} 
      />
    </div>
  );
};

export default Input;