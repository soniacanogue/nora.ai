// src/shared/components/ui/EmptyState.jsx
import React from "react";
import PropTypes from "prop-types";

/**
 * EmptyState component - displays a message when no data is available
 * @param {Object} props
 * @param {string} props.message - The message to display
 * @param {string} props.icon - Optional emoji icon to display
 */
const EmptyState = ({ message = "No hay datos disponibles.", icon = "📭" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Sin Datos</h2>
      <p className="text-subtle max-w-md">{message}</p>
    </div>
  );
};

EmptyState.propTypes = {
  message: PropTypes.string,
  icon: PropTypes.string,
};

export default EmptyState;
