import React from "react";

export const TicketSkeleton = () => (
  <div className="animate-pulse max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <div className="h-4 bg-white/5 rounded w-32 mb-4"></div>
    <div className="flex justify-between items-start mb-8">
      <div className="w-2/3">
        <div className="h-10 bg-white/10 rounded w-3/4 mb-2"></div>
        <div className="h-5 bg-white/5 rounded w-1/2"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="h-32 bg-white/5 rounded-lg border border-white/5"></div>
        <div className="h-96 bg-white/5 rounded-lg border border-white/5"></div>
      </div>
      <div className="lg:col-span-1">
        <div className="h-80 bg-white/5 rounded-lg border border-white/5"></div>
      </div>
    </div>
  </div>
);

export default TicketSkeleton;
