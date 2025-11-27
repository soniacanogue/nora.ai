import React from "react";

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-dt-primary p-6 rounded-lg border border-secondary flex items-center">
      {icon && <div className="mr-4 text-dt-accent text-dt-3xl">{icon}</div>}
      <div>
        <p className="text-dt-sm text-dt-subtle font-medium">{title}</p>
        <p className="text-dt-2xl font-bold text-dt-foreground">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
