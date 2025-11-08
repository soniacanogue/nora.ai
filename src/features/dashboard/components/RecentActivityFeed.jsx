// src/features/dashboard/components/RecentActivityFeed.jsx
import React from "react";

// Un componente simple para mostrar la lista de eventos
// En el futuro, podría conectarse a SSE (COM-03) para actualizaciones en vivo.
const RecentActivityFeed = ({ activities }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
      {activities && activities.length > 0 ? (
        activities.map((activity) => (
          <div key={activity.eventId} className="text-sm">
            <p className="text-foreground">{activity.message}</p>
            <p className="text-subtle text-xs">
              {new Date(activity.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-subtle text-sm">No hay actividad reciente.</p>
      )}
    </div>
  );
};

export default RecentActivityFeed;
