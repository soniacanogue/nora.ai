// src/features/dashboard/components/DashboardSkeleton.jsx
import React from "react";

// Un esqueleto simple usando clases de Tailwind para la animación de pulso
const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-700 rounded-md animate-pulse ${className}`} />
);

/**
 * Generic dashboard skeleton - used for agent dashboard
 */
export const GenericDashboardSkeleton = () => {
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

/**
 * Admin dashboard skeleton - mimics the 2x2 grid layout of UI-01
 */
export const AdminDashboardSkeleton = () => {
  return (
    <div>
      {/* Title */}
      <SkeletonBox className="h-9 w-1/3 mb-6" />

      {/* Time Range Selector */}
      <div className="mb-6 flex gap-2">
        <SkeletonBox className="h-10 w-24" />
        <SkeletonBox className="h-10 w-32" />
      </div>

      {/* KPI Cards (4 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SkeletonBox className="h-32" />
        <SkeletonBox className="h-32" />
        <SkeletonBox className="h-32" />
        <SkeletonBox className="h-32" />
      </div>

      {/* First Row - 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SkeletonBox className="h-80" />
        <SkeletonBox className="h-80" />
      </div>

      {/* Second Row - 2 Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonBox className="h-80" />
        <SkeletonBox className="h-80" />
      </div>
    </div>
  );
};

// Export GenericDashboardSkeleton as default for backward compatibility
const DashboardSkeleton = GenericDashboardSkeleton;

export default DashboardSkeleton;
