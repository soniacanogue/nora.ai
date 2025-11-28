import React, { useState, useRef, useEffect } from "react";

const SearchInput = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  suggestions = [],
  onSelectSuggestion,
  className = "",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filtrar sugerencias basadas en el valor del input
  useEffect(() => {
    if (value && suggestions.length > 0) {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 10)); // Limitar a 10 sugerencias
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setIsOpen(false);
    }
  }, [value, suggestions]);

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
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

  const handleInputChange = (e) => {
    onChange(e);
    if (e.target.value) {
      setIsOpen(true);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    onChange({ target: { value: suggestion } });
    setIsOpen(false);
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion);
    }
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (filteredSuggestions.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className={`w-full relative ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-dt-subtle mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative" ref={dropdownRef}>
        <input
          ref={inputRef}
          id={id}
          name={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="w-full px-3 py-2 bg-white border border-secondary rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
          autoComplete="off"
          {...props}
        />
        {isOpen && filteredSuggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-dt-primary border border-secondary rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectSuggestion(suggestion)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#8A2BE2";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.color = "";
                }}
                className="w-full text-left px-4 py-2 text-dt-foreground transition-none"
                style={{
                  transition: "none",
                  willChange: "background-color, color",
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInput;

