import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";

const Select = ({
  value,
  onChange,
  options,
  placeholder = "Selecciona una opción...",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  const handleSelect = useCallback(
    (optionValue) => {
      onChange({ target: { value: optionValue } });
      setIsOpen(false);
    },
    [onChange]
  );

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full bg-dt-background border border-secondary rounded-md p-2 
          text-left text-dt-foreground 
          focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent 
          cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-between
        `}
      >
        <span className={selectedOption ? "text-dt-foreground" : "text-dt-subtle"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-dt-subtle transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-dt-background border border-secondary rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "#8A2BE2";
                    e.currentTarget.style.color = "#FFFFFF";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "";
                    e.currentTarget.style.color = "";
                  }
                }}
                className={`
                  w-full text-left px-4 py-2 
                  ${isSelected ? "bg-dt-accent text-white" : "text-dt-foreground"}
                `}
                style={{
                  transition: "none",
                  willChange: "background-color, color",
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;

