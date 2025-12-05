import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { StaggerContainer, StaggerItem } from "@/shared/components/ui/StaggerContainer";

const DynamicTable = ({ 
  columns, 
  data, 
  sortConfig, 
  onSort, 
  isLoading,
  emptyState,
  initialItemsPerPage = 10
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Reset page when data length changes (e.g. filtering)
  useEffect(() => {
    setCurrentPage(1);
  }, [data?.length]);
  
  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.order === "asc" ? (
      <FaArrowUp className="inline ml-1" />
    ) : (
      <FaArrowDown className="inline ml-1" />
    );
  };

  if (isLoading) {
    return (
      <div className="bg-neutral-900/60 border border-white/5 rounded-lg overflow-hidden animate-pulse">
        <div className="h-12 bg-white/5 border-b border-white/10" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 border-b border-white/5 bg-neutral-800/20" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return emptyState || (
      <div className="p-8 text-center text-dt-subtle bg-neutral-900/60 border border-white/5 rounded-lg">
        No hay datos para mostrar
      </div>
    );
  }

  // Pagination Logic
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-lg overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-dt-subtle font-mono">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`p-3 text-left ${col.sortable ? "cursor-pointer hover:text-dt-foreground transition-colors" : ""} ${col.headerClassName || ""}`}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                >
                  {col.label}
                  {col.sortable && getSortIcon(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <StaggerContainer 
            as="tbody" 
            className="divide-y divide-white/5"
            key={`${currentPage}-${data.length}`} // Force re-render on page or data change
          >
            {currentData.map((item, index) => (
              <StaggerItem
                as="tr"
                key={item.id || index}
                className="hover:bg-neutral-800/80 transition-all duration-200 group relative"
              >
                {columns.map((col) => (
                  <td key={`${item.id || index}-${col.key}`} className={`p-3 ${col.className || ""}`}>
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
              </StaggerItem>
            ))}
          </StaggerContainer>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-white/10 bg-white/5 gap-4">
        <div className="text-xs text-dt-subtle">
          Mostrando <span className="font-medium text-dt-foreground">{startIndex + 1}</span> a <span className="font-medium text-dt-foreground">{endIndex}</span> de <span className="font-medium text-dt-foreground">{totalItems}</span> resultados
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-dt-subtle hidden sm:inline">Filas por página:</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="bg-neutral-900 border border-white/10 rounded text-xs text-dt-foreground focus:outline-none focus:border-dt-accent p-1"
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-dt-subtle hover:text-dt-foreground transition-colors"
            >
              <FaChevronLeft size={12} />
            </button>
            <span className="text-xs text-dt-subtle">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-dt-subtle hover:text-dt-foreground transition-colors"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicTable;
