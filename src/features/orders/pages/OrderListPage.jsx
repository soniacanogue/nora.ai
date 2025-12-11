import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";
import DynamicTable from "@/shared/components/ui/DynamicTable";
import Button from "@/shared/components/ui/Button";
import PageHeader from "@/shared/components/layout/PageHeader";
import FilterPanel from "@/shared/components/ui/FilterPanel";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import Badge from "@/shared/components/ui/Badge";
import { FiShoppingCart, FiFilter, FiSearch } from "react-icons/fi";

const OrderListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [estadoFilter, setEstadoFilter] = useState("");

  const pageParam = Number(searchParams.get("page") || 1);
  const limitParam = Number(searchParams.get("limit") || 25);
  const sortBy = searchParams.get("sortBy") || "creadoEn";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const sortConfig = { key: sortBy, order: sortOrder };

  const { orders, isLoading, error, pagination } = useOrders({
    page: pageParam,
    limit: limitParam,
  });

  const handleSort = (key) => {
    const newOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", key);
    params.set("sortOrder", newOrder);
    setSearchParams(params);
  };

  const filterConfig = useMemo(() => [
    {
      key: "estadoFilter",
      type: "select",
      label: "Estado",
      options: [
        { value: "", label: "Todos los estados" },
        { value: "pendiente", label: "Pendiente" },
        { value: "en_transito", label: "En tránsito" },
        { value: "entregado", label: "Entregado" },
      ],
    },
  ], []);

  const handleFilterChange = (key, value) => {
    if (key === "estadoFilter") setEstadoFilter(value);
  };

  const filteredOrders = useMemo(() => {
    let result = orders || [];

    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter((order) => {
        const id = (order.id || "").toString().toLowerCase();
        const clienteCorreo = (order.cliente?.correo || "").toString().toLowerCase();
        const numeroSeguimiento = (order.numeroSeguimiento || "").toString().toLowerCase();
        const transportista = (order.transportista || "").toString().toLowerCase();
        const estado = (order.estado || "").toString().toLowerCase();
        return id.includes(search) || clienteCorreo.includes(search) || 
               numeroSeguimiento.includes(search) || transportista.includes(search) || 
               estado.includes(search);
      });
    }

    // Filter by estado
    if (estadoFilter) {
      result = result.filter((order) => order.estado === estadoFilter);
    }

    return result;
  }, [orders, searchTerm, estadoFilter]);

  const getEstadoBadgeVariant = (estado) => {
    switch (estado) {
      case "entregado":
        return "success";
      case "en_transito":
        return "warning";
      default:
        return "neutral";
    }
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
        key: "clienteId",
        label: "Email del Cliente",
        sortable: true,
        className: "text-dt-subtle",
        render: (order) => order.cliente?.correo || "—",
      },
      {
        key: "estado",
        label: "Estado",
        sortable: true,
        render: (order) => (
          <Badge variant={getEstadoBadgeVariant(order.estado)}>
            {order.estado || "—"}
          </Badge>
        ),
      },
      {
        key: "numeroSeguimiento",
        label: "Nº de Seguimiento",
        sortable: true,
        className: "font-mono text-dt-subtle text-xs",
        render: (order) => order.numeroSeguimiento || "—",
      },
      {
        key: "transportista",
        label: "Transportista",
        sortable: true,
        className: "text-dt-foreground",
        render: (order) => order.transportista || "—",
      },
      {
        key: "creadoEn",
        label: "Creado",
        sortable: true,
        className: "text-dt-subtle font-mono text-xs",
        render: (order) => new Date(order?.creadoEn || order?.createdAt || 0).toLocaleDateString(),
      },
    ],
    [getEstadoBadgeVariant],
  );

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          message="Error al cargar las órdenes"
          details={error?.message}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        icon={FiShoppingCart}
        title="Gestión de Órdenes"
        description="Administra las órdenes importadas del sistema"
      >
        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="secondary"
            icon={FiFilter}
          >
            Filtros
          </Button>
        </div>
      </PageHeader>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dt-subtle" />
          <input
            type="text"
            placeholder="Buscar órdenes por ID, email, tracking o transportista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Advanced Filters */}
        <FilterPanel
          open={showFilters}
          config={filterConfig}
          values={{ estadoFilter }}
          onChange={handleFilterChange}
        />
      </div>

      {/* Orders Table */}
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
        totalPages={pagination?.totalPages}
        totalItems={pagination?.total}
        emptyState={
          <EmptyState
            icon={FiShoppingCart}
            title="No hay órdenes"
            description={
              searchTerm || estadoFilter
                ? "No se encontraron órdenes con los filtros aplicados"
                : "No hay órdenes registradas en el sistema"
            }
          />
        }
      />
    </div>
  );
};

export default OrderListPage;
