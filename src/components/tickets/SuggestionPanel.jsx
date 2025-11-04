import React, { useState } from 'react';
import Button from '../ui/Button';

const SuggestionPanel = ({ suggestion }) => {
  const [responseText, setResponseText] = useState(suggestion.reply_text);
  
  // CORRECCIÓN: Usar estados de carga separados para cada acción
  const [isSending, setIsSending] = useState(false);
  const [isEscalating, setIsEscalating] = useState(false);

  // Derivar un estado general de carga para deshabilitar interacciones
  const isLoading = isSending || isEscalating;

  const handleApproveAndSend = () => {
    setIsSending(true); // Solo activa el estado de envío
    console.log('--- ACCIÓN: Aprobar y Enviar ---');
    console.log('Enviando el siguiente texto:');
    console.log(responseText);
    
    setTimeout(() => {
      setIsSending(false); // Solo desactiva el estado de envío
      console.log('Respuesta enviada exitosamente.');
    }, 1500);
  };

  const handleEscalate = () => {
    setIsEscalating(true); // Solo activa el estado de escalado
    console.log('--- ACCIÓN: Escalar a Agente ---');
    
    setTimeout(() => {
      setIsEscalating(false); // Solo desactiva el estado de escalado
      console.log('Ticket escalado exitosamente.');
    }, 1500);
  };

  return (
    <div className="bg-primary border border-secondary rounded-lg p-6 sticky top-8">
      <h3 className="text-lg font-bold text-foreground mb-1">Sugerencia de Nora AI</h3>
      <p className="text-subtle mb-4">
        Confianza: <span className="font-bold text-green-400">{(suggestion.confidence * 100).toFixed(0)}%</span>
      </p>

      <textarea
        className="w-full h-48 p-3 bg-background border border-secondary rounded-md text-foreground placeholder-subtle focus:outline-none focus:ring-2 focus:ring-accent"
        value={responseText}
        onChange={(e) => setResponseText(e.target.value)}
        disabled={isLoading} // El textarea se deshabilita si CUALQUIER acción está en progreso
      />
      
      <div className="mt-6 space-y-3">
        {/* CORRECCIÓN: Cada botón ahora está controlado por su propio estado de carga */}
        <Button 
          variant="primary" 
          onClick={handleApproveAndSend} 
          disabled={isLoading}
        >
          {isSending ? 'Enviando...' : '✅ Aprobar y Enviar'}
        </Button>
        <Button 
          variant="secondary" 
          onClick={handleEscalate} 
          disabled={isLoading}
        >
          {isEscalating ? 'Escalando...' : '➡️ Escalar a Agente'}
        </Button>
      </div>
    </div>
  );
};

export default SuggestionPanel;