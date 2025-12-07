// src/features/dashboard/components/RecentActivityFeed.jsx
import React from "react";
import { Link } from "react-router-dom";

// Un componente simple para mostrar la lista de eventos
// En el futuro, podría conectarse a SSE (COM-03) para actualizaciones en vivo.
const RecentActivityFeed = ({ activities }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 space-y-2 border border-white/10 hover:shadow-glow transition-shadow duration-300">
      {activities && activities.length > 0 ? (
        activities.map((activity) => {
          // If activity has a ticketId, make it a link
          const content = (
            <>
              <p className="text-dt-foreground text-sm font-medium">
                {activity.message}
              </p>
              <p className="text-dt-subtle text-[10px] font-mono mt-1 uppercase tracking-wider opacity-70">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </p>
            </>
          );

          if (activity.ticketId) {
            return (
              <Link
                key={activity.eventId}
                to={`/tickets/${activity.ticketId}`}
                className="block hover:bg-white/5 p-3 rounded border border-transparent hover:border-white/10 transition-all duration-200 group"
              >
                <div className="group-hover:translate-x-1 transition-transform duration-200">
                  {content}
                </div>
              </Link>
            );
          }

          return (
            <div
              key={activity.eventId}
              className="p-3 border-b border-white/5 last:border-0"
            >
              {content}
            </div>
          );
        })
      ) : (
        <p className="text-dt-subtle text-sm p-4 text-center italic">
          No hay actividad reciente.
        </p>
      )}
    </div>
  );
};

export default RecentActivityFeed;
