// src/shared/components/ui/EmptyState.jsx
import React from "react";
import PropTypes from "prop-types";

/**
 * EmptyState component - displays a message when no data is available
 * Accepts either a string/icon component for `icon` and optional `title` and `action`.
 */
const EmptyState = ({
  title = "Sin Datos",
  message,
  description, // legacy prop name
  icon = "📭",
  action = null,
  children,
}) => {
  // Prefer explicit message, then description (legacy), then children, then default
  const resolvedMessage = message ?? description ?? (typeof children === "string" ? children : undefined) ?? "No hay datos disponibles.";
  const renderIcon = () => {
    if (!icon) return null;
    // If icon is a React component (function or element type), render it
    if (typeof icon === "function") {
      const IconComp = icon;
      return <IconComp className="text-6xl mb-4" />;
    }
    // Otherwise render as text/node
    return <div className="text-6xl mb-4">{icon}</div>;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {renderIcon()}
      <h2 className="text-xl font-semibold text-dt-foreground mb-2">{title}</h2>
      <p className="text-dt-subtle max-w-md mb-4">{resolvedMessage}</p>
      {action && (
        <div>
          <button
            type="button"
            onClick={action.onClick}
            className="px-4 py-2 bg-dt-accent text-white rounded-md"
          >
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType, PropTypes.node]),
  action: PropTypes.shape({ onClick: PropTypes.func, label: PropTypes.string }),
};

export default EmptyState;
