import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom"; // Importar Link
import { useOrders } from "../hooks/useOrders"; // 1. Usar el hook de datos
import { useDynamicSearch } from "@/shared/hooks/useDynamicSearch";
import DynamicSearch from "@/shared/components/ui/DynamicSearch";
import { FiShoppingCart } from "react-icons/fi";
import DynamicTable from "@/shared/components/ui/DynamicTable";
import PageHeader from "@/shared/components/layout/PageHeader";

const OrderListPage = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, order: "asc" });
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get("page") || 1);
  const limitParam = Number(searchParams.get("limit") || 25);

  const { orders, isLoading, error, pagination } = useOrders({
    page: pageParam,
    limit: limitParam,
  }); // 2. Obtener datos, loading y error

  // Configuración de búsqueda
  const searchConfig = useMemo(
    () => ({
      searchKeys: [
        "id",
        "cliente.correo",
        "numeroSeguimiento",
        "transportista",
        "estado",
      ],
    }),
    [],
  );

  // Hook de búsqueda dinámica
  const {
    searchTerm,
    setSearchTerm,
    filteredData: searchedOrders,
    suggestions: searchSuggestions,
  } = useDynamicSearch(orders, searchConfig);

  const filteredOrders = useMemo(() => {
    let result = searchedOrders;

    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "cliente") {
          aValue = a.cliente?.correo || "";
          bValue = b.cliente?.correo || "";
        }

        if (aValue < bValue) {
          return sortConfig.order === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.order === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [searchedOrders, sortConfig]);

  const handleSort = (key) => {
    let order = "asc";
    if (sortConfig.key === key && sortConfig.order === "asc") {
      order = "desc";
    }
    setSortConfig({ key, order });
  };

  const columns = useMemo(
    () => [
      {
        key: "id",
        label: "ID de Orden",
        sortable: true,
        className: "font-mono text-dt-foreground whitespace-nowrap",
        render: (order) => (
          <Link
            to={`/orders/${order.id}`}
            className="hover:text-dt-accent transition-colors"
          >
            {order.id}
          </Link>
        ),
      },
      {
        key: "cliente",
        label: "Email del Cliente",
        sortable: true,
        className: "text-dt-subtle whitespace-nowrap",
        render: (order) => order.cliente?.correo || "N/A",
      },
      {
        key: "estado",
        label: "Estado",
        sortable: true,
        className: "whitespace-nowrap",
        render: (order) => (
          <span
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
              order.estado === "entregado"
                ? "bg-dt-success/10 text-dt-success border border-dt-success/20"
                : order.estado === "en_transito"
                  ? "bg-dt-accent/10 text-dt-accent border border-dt-accent/20"
                  : "bg-white/10 text-dt-subtle border border-white/10"
            }`}
          >
            {order.estado}
          </span>
        ),
      },
      {
        key: "numeroSeguimiento",
        label: "Nº de Seguimiento",
        sortable: true,
        className: "font-mono text-dt-subtle whitespace-nowrap text-xs",
        render: (order) => order.numeroSeguimiento || "N/A",
      },
      {
        key: "transportista",
        label: "Transportista",
        sortable: true,
        className: "text-dt-foreground whitespace-nowrap",
      },
    ],
    [],
  );

  if (isLoading) {
    return <div>Cargando órdenes...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <PageHeader icon={FiShoppingCart} title="Órdenes Importadas" />

      <div className="w-full md:w-64 lg:w-80">
        <DynamicSearch
          id="search"
          placeholder="Buscar por ID, email, tracking, transportista..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          suggestions={searchSuggestions}
        />
      </div>

      <DynamicTable
        columns={columns}
        data={filteredOrders}
        sortConfig={sortConfig}
        onSort={handleSort}
        isLoading={isLoading}
        page={pageParam}
        itemsPerPage={limitParam}
        onPageChange={(newPage) => {
          const params = new URLSearchParams(searchParams);
          params.set("page", String(newPage));
          setSearchParams(params);
        }}
        onItemsPerPageChange={(newLimit) => {
          const params = new URLSearchParams(searchParams);
          params.set("limit", String(newLimit));
          params.set("page", "1");
          setSearchParams(params);
        }}
        totalItems={orders?.pagination?.total || orders?.pagination?.totalItems || orders?.pagination?.totalCount}
        totalPages={orders?.pagination?.totalPages}
        emptyState={
          <div className="text-center p-8 text-dt-subtle italic bg-white/5 backdrop-blur-md border border-white/10 rounded-lg">
            No se encontraron órdenes que coincidan con tu búsqueda.
          </div>
        }
      />
    </div>
  );
};

export default OrderListPage;
