import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../shared/components/ui/Button";
import PublicLayout from "../../../shared/components/layout/PublicLayout";

const TicketConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const ticketId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const idFromQuery = params.get("ticketId");
    return idFromQuery || location.state?.ticketId || null;
  }, [location]);

  const handleCreateAnother = () => {
    navigate("/new-ticket", { replace: false });
  };

  const handleGoHome = () => {
    navigate("/", { replace: false });
  };

  return (
    <PublicLayout>
      <div className="bg-dt-primary p-8 rounded-lg border border-secondary text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-4">¡Gracias!</h2>
        <p className="text-dt-foreground">
          Hemos recibido tu consulta. Recibirás una confirmación por correo
          electrónico en breve.
        </p>
        <p className="text-dt-subtle mt-2">
          {ticketId
            ? `Tu número de ticket de referencia es: ${ticketId}`
            : "No pudimos recuperar el identificador del ticket, pero tu solicitud fue registrada."}
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <Button
            onClick={handleCreateAnother}
            size="md"
            fullWidth={false}
            variant="secondary"
          >
            Crear otro ticket
          </Button>
          <button
            type="button"
            onClick={handleGoHome}
            className="text-sm text-dt-subtle hover:text-dt-foreground hover:underline"
          >
            o volver a la página principal
          </button>
        </div>
      </div>
    </PublicLayout>
  );
};

export default TicketConfirmationPage;
