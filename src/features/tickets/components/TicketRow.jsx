import React from "react";

const CHANNEL_STYLES = {
  email: {
    label: "Email",
    icon: "@",
    badgeClass:
      "bg-amber-500/10 text-amber-200 border-amber-500/30 shadow-[0_0_10px_rgba(251,191,36,0.25)]",
  },
  web: {
    label: "Web",
    icon: "//",
    badgeClass:
      "bg-sky-500/10 text-sky-200 border-sky-500/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]",
  },
  telefono: {
    label: "Teléfono",
    icon: "TEL",
    badgeClass:
      "bg-emerald-500/10 text-emerald-200 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
  },
  default: {
    label: "Manual",
    icon: "-",
    badgeClass:
      "bg-white/5 text-dt-subtle border-white/15 shadow-[0_0_10px_rgba(255,255,255,0.08)]",
  },
};

const TicketRow = ({ ticket, onClick }) => {
  // Adapt properties to match the component's expected structure
  const status = ticket.status || ticket.prioridad || "NORMAL";
  const title = ticket.title || ticket.asunto || "Sin asunto";
  const client = ticket.client || ticket.cliente?.nombre || "Cliente desconocido";
  const id = ticket.id;

  const isUrgent = status === 'URGENTE' || status === 'alta';
  const rawChannel = (ticket.canalOrigen || ticket.canal || ticket.channel || "web").toLowerCase();
  let channelKey = rawChannel;
  if (rawChannel.includes("mail")) channelKey = "email";
  else if (rawChannel.includes("tel")) channelKey = "telefono";
  else if (rawChannel.includes("web")) channelKey = "web";
  const channelMeta = CHANNEL_STYLES[channelKey] || CHANNEL_STYLES.default;

  return (
    <div 
      onClick={onClick}
      className="group grid grid-cols-12 gap-4 border-b border-white/5 p-4 transition-colors hover:bg-white/[0.02] items-center text-sm cursor-pointer"
    >
      
      {/* Badge de estado: Minimalist pill */}
      <div className="col-span-2 flex flex-col gap-2">
        <span className={`
          px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wide border
          ${isUrgent
            ? 'bg-red-500/10 text-red-400 border-red-500/20' 
            : 'bg-dt-accent-dim text-dt-accent-text border-dt-accent/20'}
        `}>
          {status}
        </span>
        <span
          className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider border flex items-center gap-1 ${channelMeta.badgeClass}`}
          title={`Origen: ${channelMeta.label}`}
        >
          <span className="font-mono text-[9px]">{channelMeta.icon}</span>
          {channelMeta.label}
        </span>
      </div>

      {/* Info Principal */}
      <div className="col-span-4">
        <h4 className="text-white font-medium truncate pr-4 group-hover:text-dt-accent transition-colors">
          {title}
        </h4>
        <span className="text-xs text-dt-subtle font-mono">ID: {id}</span>
      </div>

      {/* Metadatos alineados */}
      <div className="col-span-3 text-dt-subtle text-xs">
        {client}
      </div>

      <div className="col-span-3 flex justify-end">
         <button className="opacity-0 group-hover:opacity-100 transition-all duration-200 px-4 py-1.5 text-xs font-medium bg-white text-black hover:bg-dt-accent hover:text-white rounded shadow-glow">
            Procesar AI
         </button>
      </div>
    </div>
  );
};

export default TicketRow;
