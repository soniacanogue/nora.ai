// src/features/dashboard/components/RecentActivityFeed.jsx
import React from "react";
import { Link } from "react-router-dom";

// Un componente simple para mostrar la lista de eventos
// En el futuro, podría conectarse a SSE (COM-03) para actualizaciones en vivo.
const RecentActivityFeed = ({ activities }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
      {activities && activities.length > 0 ? (
        activities.map((activity) => {
          // If activity has a ticketId, make it a link
          const content = (
            <>
              <p className="text-dt-foreground">{activity.message}</p>
              <p className="text-dt-subtle text-xs">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </p>
            </>
          );

          if (activity.ticketId) {
            return (
              <Link
                key={activity.eventId}
                to={`/tickets/${activity.ticketId}`}
                className="block text-sm hover:bg-gray-700/50 p-2 rounded transition-colors"
              >
                {content}
              </Link>
            );
          }

          return (
            <div key={activity.eventId} className="text-sm p-2">
              {content}
            </div>
          );
        })
      ) : (
        <p className="text-dt-subtle text-sm">No hay actividad reciente.</p>
      )}
    </div>
  );
};

export default RecentActivityFeed;
