import React from "react";

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-primary p-6 rounded-lg border border-secondary flex items-center">
      {icon && <div className="mr-4 text-accent text-3xl">{icon}</div>}
      <div>
        <p className="text-sm text-subtle font-medium">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
