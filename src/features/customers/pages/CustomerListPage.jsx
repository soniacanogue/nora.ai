import React, { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCustomers } from "../hooks/useCustomer";
import { updateCustomer } from "../api/customersApi";
import { useDynamicSearch } from "@/shared/hooks/useDynamicSearch";
import DynamicTable from "@/shared/components/ui/DynamicTable";
import DynamicSearch from "@/shared/components/ui/DynamicSearch";
import DynamicFormModal from "@/shared/components/ui/DynamicFormModal";
import Button from "@/shared/components/ui/Button";
import PageHeader from "@/shared/components/layout/PageHeader";
import { FiUsers } from "react-icons/fi";
import toast from "react-hot-toast";

const CustomerListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: "nombre",
    order: "asc",
  });

  // Filters from URL
  const pageParam = Number(searchParams.get("page") || 1);
  const limitParam = Number(searchParams.get("limit") || 25);

  // Hook for data with pagination
  const {
    data: customersData,
    isLoading,
    isError,
    error,
  } = useCustomers({
    page: pageParam,
    limit: limitParam,
  });

  // Extract customers and pagination info
  const customers = customersData?.data || customersData || [];
  const pagination = customersData?.pagination || {};

  // Search configuration
  const searchConfig = useMemo(
    () => ({
      searchKeys: [
        "id",
        "nombre",
        "correo",
        "telefono",
      ],
    }),
    [],
  );

  // Hook for dynamic search
  const {
    searchTerm,
    setSearchTerm,
    filteredData: searchedCustomers,
    suggestions: searchSuggestions,
  } = useDynamicSearch(customers, searchConfig);

  // Sorted customers
  const sortedCustomers = useMemo(() => {
    if (!searchedCustomers) return [];
    let result = [...searchedCustomers];
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Special cases for count fields
        if (sortConfig.key === "ticketsCount") {
          aValue = a._count?.tickets || a.tickets?.length || a.ticketsCount || 0;
          bValue = b._count?.tickets || b.tickets?.length || b.ticketsCount || 0;
        } else if (sortConfig.key === "ordenesCount") {
          aValue = a._count?.ordenes || a.ordenes?.length || a.ordenesCount || 0;
          bValue = b._count?.ordenes || b.ordenes?.length || b.ordenesCount || 0;
        }

        // Case-insensitive sorting for strings
        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

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
  }, [searchedCustomers, sortConfig]);

  const handleSort = (key) => {
    let order = "asc";
    if (sortConfig.key === key && sortConfig.order === "asc") {
      order = "desc";
    }
    setSortConfig({ key, order });
  };

  const handleCustomerClick = (customer) => {
    navigate(`/customers/${customer.id}`);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCustomerEdited = () => {
    queryClient.invalidateQueries(["customers"]);
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const columns = useMemo(
    () => [
      {
        key: "nombre",
        label: "Nombre",
        sortable: true,
        className: "text-dt-foreground font-medium cursor-pointer group-hover:text-white transition-colors",
        render: (customer) => (
          <div onClick={() => handleCustomerClick(customer)}>
            {customer?.nombre || customer?.name || "Sin nombre"}
          </div>
        ),
      },
      {
        key: "correo",
        label: "Correo",
        sortable: true,
        className: "text-dt-subtle",
        render: (customer) => customer?.correo || customer?.email || "Sin email",
      },
      {
        key: "telefono",
        label: "Teléfono",
        sortable: true,
        className: "text-dt-subtle",
        render: (customer) => customer?.telefono || "Sin teléfono",
      },
      {
        key: "ticketsCount",
        label: "Tickets",
        sortable: true,
        className: "text-dt-subtle text-center",
        render: (customer) => {
          const count = customer._count?.tickets || customer.tickets?.length || customer.ticketsCount || 0;
          return (
            <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-medium">
              {count}
            </span>
          );
        },
      },
      {
        key: "ordenesCount",
        label: "Órdenes",
        sortable: true,
        className: "text-dt-subtle text-center",
        render: (customer) => {
          const count = customer._count?.ordenes || customer.ordenes?.length || customer.ordenesCount || 0;
          return (
            <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
              {count}
            </span>
          );
        },
      },
      {
        key: "creadoEn",
        label: "Creado",
        sortable: true,
        className: "text-dt-subtle font-mono text-xs",
        render: (customer) => new Date(customer?.creadoEn || customer?.createdAt || 0).toLocaleDateString(),
      },
      {
        key: "actions",
        label: "Acción",
        render: (customer) => (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="primary"
              size="sm"
              fullWidth={false}
              onClick={() => handleEditCustomer(customer)}
              className="text-xs py-1 px-3 h-8"
            >
              Editar
            </Button>
          </div>
        ),
      },
    ],
    [navigate, handleEditCustomer],
  );

  const formConfig = {
    fields: {
      nombre: {
        label: "Nombre",
        type: "text",
        placeholder: "Ingresa el nombre del cliente",
        required: true,
      },
      correo: {
        label: "Correo",
        type: "email",
        placeholder: "Ingresa el correo del cliente",
        required: true,
      },
      telefono: {
        label: "Teléfono",
        type: "text",
        placeholder: "Ingresa el teléfono del cliente",
      },
    },
    buttons: {
      cancel: {
        label: "Cancelar",
        variant: "secondary",
        onClick: () => setIsModalOpen(false),
      },
      submit: {
        label: "Guardar",
        variant: "primary",
        onClick: async (data) => {
          try {
            await updateCustomer(editingCustomer.id, data);
            toast.success("Cliente actualizado exitosamente");
            handleCustomerEdited();
          } catch (error) {
            console.error("Error updating customer:", error);
            toast.error("Error al actualizar el cliente");
          }
        },
      },
    },
  };

  if (isError) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div>
      <PageHeader icon={FiUsers} title="Clientes" />

      <div className="w-full md:w-64 lg:w-80">
        <DynamicSearch
          id="search-customers"
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          suggestions={searchSuggestions}
        />
      </div>

      <DynamicTable
        columns={columns}
        data={sortedCustomers}
        sortConfig={sortConfig}
        onSort={handleSort}
        isLoading={isLoading}
        // Controlled pagination
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
        totalItems={pagination?.total || pagination?.totalItems || pagination?.totalCount || customers.length}
        totalPages={pagination?.totalPages}
      />

      <DynamicFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Editar Cliente"
        config={formConfig}
        defaultValues={editingCustomer ? {
          nombre: editingCustomer.nombre || "",
          correo: editingCustomer.correo || "",
          telefono: editingCustomer.telefono || "",
        } : {}}
      />
    </div>
  );
};

export default CustomerListPage;
