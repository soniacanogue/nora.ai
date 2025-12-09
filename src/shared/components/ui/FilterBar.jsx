import React from "react";
import { FiFilter } from "react-icons/fi";

const FilterBar = ({ children, className = "" }) => {
  return (
    <div className={`flex flex-wrap gap-4 items-center ${className}`}>
      <div className="flex items-center gap-2 text-sm text-dt-subtle uppercase tracking-wide">
        <FiFilter />
        <span>Filtros</span>
      </div>
      {children}
    </div>
  );
};

export default FilterBar;
