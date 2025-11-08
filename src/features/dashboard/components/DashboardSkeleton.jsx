// src/features/dashboard/components/DashboardSkeleton.jsx
import React from "react";

// Un esqueleto simple usando clases de Tailwind para la animación de pulso
const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-700 rounded-md animate-pulse ${className}`} />
);

const DashboardSkeleton = () => {
  return (
    <div>
      <div className="mb-8">
        <SkeletonBox className="h-9 w-1/3 mb-2" />
        <SkeletonBox className="h-5 w-1/2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <SkeletonBox className="h-28" />
        <SkeletonBox className="h-28" />
        <SkeletonBox className="h-28" />
      </div>
      <div>
        <SkeletonBox className="h-8 w-1/4 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonBox className="h-32" />
          <SkeletonBox className="h-32" />
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
