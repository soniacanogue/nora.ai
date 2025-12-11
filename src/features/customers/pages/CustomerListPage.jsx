import React, { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCustomers } from "../hooks/useCustomer";
import { updateCustomer } from "../api/customersApi";
import DynamicTable from "@/shared/components/ui/DynamicTable";
import DynamicFormModal from "@/shared/components/ui/DynamicFormModal";
import Button from "@/shared/components/ui/Button";
import PageHeader from "@/shared/components/layout/PageHeader";
import FilterPanel from "@/shared/components/ui/FilterPanel";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import { FiUsers, FiPlus, FiFilter, FiSearch, FiEdit2 } from "react-icons/fi";
import toast from "react-hot-toast";

const CustomerListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  
  // Search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filters from URL
  const pageParam = Number(searchParams.get("page") || 1);
  const limitParam = Number(searchParams.get("limit") || 25);
  const sortBy = searchParams.get("sortBy") || "nombre";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  const sortConfig = { key: sortBy, order: sortOrder };

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

  const handleSort = (key) => {
    const newOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", key);
    params.set("sortOrder", newOrder);
    setSearchParams(params);
  };

  // Filter config - similar to UsersListPage
  const filterConfig = useMemo(() => [], []); // No filters for now, but structure is ready

  const handleFilterChange = (key, value) => {
    // Ready for future filters
  };

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    let result = customers;

    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter((customer) => {
        const nombre = (customer.nombre || customer.name || "").toString().toLowerCase();
        const correo = (customer.correo || customer.email || "").toString().toLowerCase();
        const telefono = (customer.telefono || "").toString().toLowerCase();
        return nombre.includes(search) || correo.includes(search) || telefono.includes(search);
      });
    }

    return result;
  }, [customers, searchTerm]);

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
        className: "text-dt-foreground font-medium cursor-pointer",
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
        render: (customer) => customer?.correo || customer?.email || "—",
      },
      {
        key: "telefono",
        label: "Teléfono",
        sortable: true,
        className: "text-dt-subtle",
        render: (customer) => customer?.telefono || "—",
      },
      {
        key: "ticketsCount",
        label: "Tickets",
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
        label: "Acciones",
        headerClassName: "text-right",
        className: "text-right",
        render: (customer) => (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleEditCustomer(customer)}
              className="p-2 text-dt-subtle hover:text-dt-accent transition-colors"
              title="Editar"
            >
              <FiEdit2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [handleCustomerClick, handleEditCustomer],
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

  if (isError || error) {
    return (
      <div className="p-6">
        <ErrorState
          message="Error al cargar los clientes"
          details={error?.message}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        icon={FiUsers}
        title="Gestión de Clientes"
        description="Administra los clientes del sistema"
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
            placeholder="Buscar clientes por nombre, correo o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Advanced Filters */}
        <FilterPanel
          open={showFilters}
          config={filterConfig}
          values={{}}
          onChange={handleFilterChange}
        />
      </div>

      {/* Customers Table */}
      <DynamicTable
        columns={columns}
        data={filteredCustomers}
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
            icon={FiUsers}
            title="No hay clientes"
            description={
              searchTerm
                ? "No se encontraron clientes con los filtros aplicados"
                : "No hay clientes registrados en el sistema"
            }
          />
        }
      />

      {/* Edit Modal */}
      {isModalOpen && editingCustomer && (
        <DynamicFormModal
          title="Editar Cliente"
          description="Modifica la información del cliente"
          config={formConfig}
          defaultValues={{
            nombre: editingCustomer.nombre || "",
            correo: editingCustomer.correo || "",
            telefono: editingCustomer.telefono || "",
          }}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCustomer(null);
          }}
          isLoading={false}
        />
      )}
    </div>
  );
};

export default CustomerListPage;
