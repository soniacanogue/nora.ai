import React from "react";

/**
 * FilterPanel
 * Props:
 * - open: boolean (mostrar u ocultar)
 * - config: array de campos { key, type: 'select'|'date'|'text', label, placeholder, options }
 * - values: object con valores actuales
 * - onChange: function(key, value)
 */
const FilterPanel = ({ open, config = [], values = {}, onChange = () => {} }) => {
  if (!open) return null;

  return (
    <div className="bg-dt-card border border-dt-border rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {config.map((field) => {
          const { key, type = "text", label, placeholder, options = [] } = field;
          const value = values[key] ?? "";

          if (type === "select") {
            return (
              <div key={key}>
                <label className="block text-sm font-medium text-dt-foreground mb-2">
                  {label}
                </label>
                <select
                  value={value}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="w-full px-3 py-2 bg-dt-background border border-dt-border rounded-lg text-dt-foreground focus:outline-none focus:ring-2 focus:ring-dt-accent"
                >
                  {options.map((opt) => (
                    <option key={opt.value ?? opt} value={opt.value ?? opt}>
                      {opt.label ?? opt}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (type === "date") {
            return (
              <div key={key}>
                <label className="block text-sm font-medium text-dt-foreground mb-2">
                  {label}
                </label>
                <input
                  type="date"
                  value={value}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="w-full px-3 py-2 bg-dt-background border border-dt-border rounded-lg text-dt-foreground focus:outline-none focus:ring-2 focus:ring-dt-accent"
                />
              </div>
            );
          }

          // default: text
          return (
            <div key={key}>
              <label className="block text-sm font-medium text-dt-foreground mb-2">
                {label}
              </label>
              <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(key, e.target.value)}
                className="w-full px-3 py-2 bg-dt-background border border-dt-border rounded-lg text-dt-foreground focus:outline-none focus:ring-2 focus:ring-dt-accent"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterPanel;
