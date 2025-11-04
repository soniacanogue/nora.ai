// src/components/tickets/SuggestionPanel.jsx
import React from 'react';
import Button from '../ui/Button'; // Reutilizamos nuestro botón

const SuggestionPanel = ({ suggestion }) => {
  return (
    <div className="bg-primary border border-secondary rounded-lg p-6 sticky top-8">
      <h3 className="text-lg font-bold text-foreground mb-1">Sugerencia de Nora AI</h3>
      <p className="text-subtle mb-4">
        Confianza: <span className="font-bold text-green-400">{(suggestion.confidence * 100).toFixed(0)}%</span>
      </p>

      <textarea
        className="w-full h-48 p-3 bg-background border border-secondary rounded-md text-foreground placeholder-subtle focus:outline-none focus:ring-2 focus:ring-accent"
        defaultValue={suggestion.reply_text}
      />
      
      <div className="mt-6 space-y-3">
        <Button variant="primary">
          ✅ Aprobar y Enviar
        </Button>
        <Button variant="secondary">
          ➡️ Escalar a Agente
        </Button>
      </div>

       <div className="mt-4 text-center">
        <button className="text-sm text-subtle hover:text-foreground hover:underline">
          Editar y Enviar
        </button>
      </div>
    </div>
  );
};

export default SuggestionPanel;