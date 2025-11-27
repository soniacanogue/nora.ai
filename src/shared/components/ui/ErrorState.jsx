// src/shared/components/ui/ErrorState.jsx
import React from "react";
import PropTypes from "prop-types";

/**
 * ErrorState component - displays an error message with a retry button
 * @param {Object} props
 * @param {string} props.message - The error message to display
 * @param {Function} props.onRetry - Function to call when retry button is clicked
 */
const ErrorState = ({
  message = "Ha ocurrido un error al cargar los datos.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Error</h2>
      <p className="text-subtle mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={typeof onRetry === "function" ? (e) => onRetry(e) : undefined}
          className="px-6 py-2 bg-accent text-foreground font-semibold rounded-md hover:bg-accent/80 transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
};

ErrorState.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
};

export default ErrorState;
