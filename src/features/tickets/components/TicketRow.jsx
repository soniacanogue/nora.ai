// src/features/tickets/components/TicketRow.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // 1. Importar useNavigate

// ... (El resto del componente permanece igual)
const statusStyles = {
  nuevo: "bg-dt-blue-500/20 text-dt-blue-300",
  ia_sugerido: "bg-dt-purple-500/20 text-dt-purple-300",
  escalado_nivel_2: "bg-dt-yellow-500/20 text-dt-yellow-300",
  cerrado: "bg-dt-gray-500/20 text-dt-gray-400",
};

const getConfidenceColor = (confidence) => {
  if (confidence === null || confidence === undefined)
    return "text-dt-gray-500";
  if (confidence >= 0.9) return "text-dt-green-400";
  if (confidence >= 0.75) return "text-dt-yellow-400";
  return "text-dt-orange-500";
};

// 2. AÑADIR `id` a las props
const TicketRow = ({ id, subject, status, aiConfidence, tags }) => {
  const navigate = useNavigate(); // 3. Inicializar el hook de navegación

  const handleRowClick = () => {
    navigate(`/tickets/${id}`); // 4. Navegar a la página de detalle
  };

  const statusClass =
    statusStyles[status] || "bg-dt-gray-500/20 text-dt-gray-400";
  const confidenceColor = getConfidenceColor(aiConfidence);

  return (
    // 5. AÑADIR el handler y clases para feedback visual
    <tr
      className="border-b border-secondary hover:bg-dt-white/5 transition-colors cursor-pointer"
      onClick={handleRowClick}
    >
      <td className="p-4">
        <span className="font-medium text-dt-foreground">{subject}</span>
      </td>
      <td className="p-4 text-dt-center">
        <span
          className={`px-3 py-1 text-dt-xs font-semibold rounded-full ${statusClass}`}
        >
          {status.replace(/_/g, " ").toUpperCase()}
        </span>
      </td>
      <td
        className={`p-4 text-dt-center font-mono font-bold ${confidenceColor}`}
      >
        {aiConfidence !== null && aiConfidence !== undefined
          ? `${(aiConfidence * 100).toFixed(0)}%`
          : "N/A"}
      </td>
      <td className="p-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-dt-gray-700 text-dt-gray-300 text-dt-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </td>
    </tr>
  );
};

export default TicketRow;
