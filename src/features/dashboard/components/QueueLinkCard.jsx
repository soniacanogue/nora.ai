import React from "react";
import { Link } from "react-router-dom";

const QueueLinkCard = ({ title, count, linkTo, description }) => {
  return (
    <Link
      to={linkTo}
      className="block bg-white/5 backdrop-blur-md p-6 rounded-lg border border-white/10 hover:border-dt-accent hover:shadow-glow hover:bg-white/10 transition-all duration-200 group"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-bold text-dt-foreground uppercase tracking-wider group-hover:text-dt-accent transition-colors">
          {title}
        </h3>
        <span className="text-2xl font-bold text-dt-accent font-mono group-hover:scale-110 transition-transform drop-shadow-[0_0_5px_rgba(138,43,226,0.5)]">
          {count}
        </span>
      </div>
      <p className="text-xs text-dt-subtle leading-relaxed">{description}</p>
    </Link>
  );
};

export default QueueLinkCard;
