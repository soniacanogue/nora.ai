import React from 'react';

const StatCard = ({ title, value, icon, trend, variant = "card", className = "" }) => {
  const isCard = variant === "card";
  
  const containerClasses = isCard 
    ? "group relative overflow-hidden rounded-xl border border-dt-surface-border bg-dt-surface-glass backdrop-blur-md transition-all duration-300 hover:border-dt-accent/50 hover:shadow-neon"
    : "group relative p-6 transition-colors hover:bg-white/5";

  return (
    <div className={`${containerClasses} ${className}`}>
      {/* Glow Effect on Hover (Background gradient) - Only for card */}
      {isCard && (
        <div className="absolute inset-0 bg-gradient-to-br from-dt-accent/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      
      <div className={`relative ${isCard ? 'p-5' : ''} flex items-start justify-between`}>
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-dt-subtle mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-sans font-bold text-white tracking-tight">
            {value}
          </h3>
          {trend && (
             <span className="text-xs text-dt-success font-mono mt-2 block">
               {trend} ▲
             </span>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${isCard ? 'bg-white/5 border border-white/5' : 'bg-transparent'} text-dt-accent group-hover:text-white group-hover:bg-dt-accent transition-colors duration-300`}>
          {icon}
        </div>
      </div>
      
      {/* Decorative Bottom Line - Only for card */}
      {isCard && (
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-dt-accent/50 to-transparent scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
      )}
    </div>
  );
};

export default StatCard;
