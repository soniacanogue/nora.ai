import React, { useState, useEffect } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const DynamicTable = ({
  columns,
  data,
  sortConfig,
  onSort,
  isLoading,
  emptyState,
  // uncontrolled initial value
  initialItemsPerPage = 10,
  // controlled pagination props (optional)
  page: controlledPage,
  itemsPerPage: controlledItemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  totalItems: serverTotalItems,
  totalPages: serverTotalPages,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Reset page when data length changes (e.g. client-side filtering)
  useEffect(() => {
    // Only reset local page when uncontrolled
    if (controlledPage === undefined && controlledItemsPerPage === undefined) {
      setCurrentPage(1);
    }
  }, [data?.length, controlledPage, controlledItemsPerPage]);

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
      <div className="bg-dt-card border border-dt-border rounded-lg overflow-hidden animate-pulse">
        <div className="h-12 bg-dt-background border-b border-dt-border" />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 border-b border-dt-border bg-dt-card/50"
          />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      emptyState || (
          <div className="p-8 text-center text-dt-subtle bg-dt-card border border-dt-border rounded-lg">
            No hay datos para mostrar
          </div>
        )
    );
  }

  // Resolve whether pagination is controlled by parent (server-side) or local
  const isControlled = controlledPage !== undefined || controlledItemsPerPage !== undefined || serverTotalItems !== undefined || serverTotalPages !== undefined;

  // Use controlled values when provided, otherwise internal state
  const effectivePage = controlledPage !== undefined ? controlledPage : currentPage;
  const effectiveItemsPerPage = controlledItemsPerPage !== undefined ? controlledItemsPerPage : itemsPerPage;

  // Pagination numbers
  const totalItems = serverTotalItems !== undefined ? serverTotalItems : data.length;
  const totalPages = serverTotalPages !== undefined
    ? serverTotalPages
    : Math.max(1, Math.ceil(totalItems / Math.max(1, effectiveItemsPerPage)));

  const startIndex = (effectivePage - 1) * effectiveItemsPerPage + 1;
  const endIndex = Math.min((effectivePage - 1) * effectiveItemsPerPage + data.length, totalItems);

  // If controlled (server-side pagination), assume `data` is already the correct page slice
  const currentData = isControlled ? data : data.slice((effectivePage - 1) * effectiveItemsPerPage, (effectivePage - 1) * effectiveItemsPerPage + effectiveItemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    if (onPageChange) {
      onPageChange(newPage);
      return;
    }
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (e) => {
    const value = Number(e.target.value);
    if (onItemsPerPageChange) {
      onItemsPerPageChange(value);
      return;
    }
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden flex flex-col shadow-glow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dt-background border-b border-dt-border">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-dt-subtle uppercase ${col.sortable ? "cursor-pointer hover:text-dt-foreground transition-colors" : ""} ${col.headerClassName || ""} ${col.key === "actions" ? "border-l border-dt-border pl-6" : ""}`}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                >
                  {col.label}
                  {col.sortable && getSortIcon(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dt-border">
            {currentData.map((item, index) => (
              <tr
                key={item.id || index}
                className="group relative hover:bg-dt-background/50 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={`${item.id || index}-${col.key}`}
                    className={`px-4 py-3 text-sm text-dt-foreground ${col.className || ""} ${col.key === "actions" ? "border-l border-dt-border pl-6" : ""}`}
                  >
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-dt-border bg-dt-card gap-4">
        <div className="text-xs text-dt-subtle">
          {serverTotalItems !== undefined || serverTotalPages !== undefined ? (
            // Server-side pagination display
            serverTotalItems !== undefined ? (
              <>
                Mostrando <span className="font-medium text-dt-foreground">{startIndex}</span> a <span className="font-medium text-dt-foreground">{endIndex}</span> de <span className="font-medium text-dt-foreground">{totalItems}</span> resultados
              </>
            ) : (
              // If only totalPages provided, show page indicator
              <>Página <span className="font-medium text-dt-foreground">{effectivePage}</span> de <span className="font-medium text-dt-foreground">{totalPages}</span></>
            )
          ) : (
            // Client-side pagination display
            <>
              Mostrando <span className="font-medium text-dt-foreground">{(effectivePage - 1) * effectiveItemsPerPage + 1}</span> a <span className="font-medium text-dt-foreground">{Math.min(effectivePage * effectiveItemsPerPage, totalItems)}</span> de <span className="font-medium text-dt-foreground">{totalItems}</span> resultados
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-dt-subtle hidden sm:inline">
              Filas por página:
            </span>
            <select
              value={effectiveItemsPerPage}
              onChange={handleItemsPerPageChange}
              className="bg-dt-card border border-dt-border rounded text-xs text-dt-foreground focus:outline-none focus:ring-2 focus:ring-dt-accent p-1"
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(effectivePage - 1)}
              disabled={effectivePage === 1}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-dt-subtle hover:text-dt-foreground transition-colors"
            >
              <FaChevronLeft size={12} />
            </button>
            <span className="text-xs text-dt-subtle">
              {effectivePage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(effectivePage + 1)}
              disabled={effectivePage === totalPages}
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
