import React from "react";

const SkeletonList = ({ count = 5, className = "" }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-dt-card border border-dt-border rounded-lg p-4 animate-pulse">
          <div className="h-4 bg-dt-border rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-dt-border rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonList;
