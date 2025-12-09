import React, { useState, useMemo } from "react";
import {
  FiUsers,
  FiPlus,
  FiEdit2,
  FiToggleLeft,
  FiToggleRight,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiShield,
  FiKey,
  FiMail,
  FiActivity,
  FiPieChart,
  FiBarChart2,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useChangePassword,
  useRequestPasswordReset,
  useResetPasswordWithToken,
} from "../hooks";
import DynamicFormModal from "@/shared/components/ui/DynamicFormModal";
import Button from "@/shared/components/ui/Button";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import Badge from "@/shared/components/ui/Badge";
import Modal from "@/shared/components/ui/Modal";
import DynamicTable from "@/shared/components/ui/DynamicTable";
import SearchInput from "@/shared/components/ui/SearchInput";
import Select from "@/shared/components/ui/Select";
import PageHeader from "@/shared/components/layout/PageHeader";
import FilterBar from "@/shared/components/ui/FilterBar";

const PasswordManagerModal = ({ user, onClose }) => {
  const [mode, setMode] = useState("change");
  const [formValues, setFormValues] = useState({
    newPassword: "",
    confirmPassword: "",
    token: "",
  });
  const [capabilities, setCapabilities] = useState({
    directChange: true,
    resetEmail: true,
    tokenReset: true,
  });
  const changePasswordMutation = useChangePassword();
  const requestPasswordResetMutation = useRequestPasswordReset();
  const resetPasswordWithTokenMutation = useResetPasswordWithToken();

  if (!user) return null;

  const resetForm = () =>
    setFormValues({
      newPassword: "",
      confirmPassword: "",
      token: "",
    });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const modeOptions = [
    { key: "change", label: "Cambio directo", capabilityKey: "directChange" },
    { key: "reset", label: "Enviar correo", capabilityKey: "resetEmail" },
    { key: "token", label: "Usar token", capabilityKey: "tokenReset" },
  ];

  const ensureValidMode = (nextCapabilities) => {
    const activeCapability = modeOptions.find(
      (option) => option.key === mode
    )?.capabilityKey;
    if (activeCapability && nextCapabilities[activeCapability]) {
      return;
    }
    const fallback = modeOptions.find(
      (option) => nextCapabilities[option.capabilityKey]
    );
    setMode(fallback ? fallback.key : "");
  };

  const handleCapabilityUnavailable = (capabilityKey, message) => {
    let shouldAnnounce = false;
    let nextState = null;
    setCapabilities((prev) => {
      if (!prev[capabilityKey]) {
        nextState = prev;
        return prev;
      }
      shouldAnnounce = true;
      nextState = { ...prev, [capabilityKey]: false };
      return nextState;
    });
    if (shouldAnnounce) {
      toast.error(message);
      ensureValidMode(nextState || {});
    }
  };

  const handleChangePassword = (event) => {
    event.preventDefault();
    if (!formValues.newPassword) {
      toast.error("Ingresa la nueva contraseña");
      return;
    }
    if (formValues.newPassword !== formValues.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    changePasswordMutation.mutate(
      {
        userId: user.id,
        newPassword: formValues.newPassword,
        force: true,
      },
      {
        onSuccess: () => {
          toast.success("Contraseña actualizada");
          resetForm();
          onClose();
        },
        onError: (error) => {
          const message =
            error.message || "No fue posible actualizar la contraseña";
          toast.error(message);
          if (message.toLowerCase().includes("no disponible")) {
            handleCapabilityUnavailable(
              "directChange",
              "El backend aún no soporta el cambio directo de contraseña."
            );
          }
        },
      }
    );
  };

  const handleSendResetEmail = (event) => {
    event.preventDefault();
    const targetEmail = user.correo || user.email;
    if (!targetEmail) {
      toast.error("El usuario no tiene correo registrado");
      return;
    }

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/reset-password`
        : undefined;

    requestPasswordResetMutation.mutate(
      { email: targetEmail, redirectTo },
      {
        onSuccess: () => {
          toast.success("Correo de recuperación enviado");
          onClose();
        },
        onError: (error) => {
          const message = error.message || "No fue posible enviar el correo";
          toast.error(message);
          if (message.toLowerCase().includes("no disponible")) {
            handleCapabilityUnavailable(
              "resetEmail",
              "El backend aún no soporta el envío de correos de recuperación."
            );
          }
        },
      }
    );
  };

  const handleResetWithToken = (event) => {
    event.preventDefault();
    if (!formValues.token) {
      toast.error("Ingresa el token de recuperación");
      return;
    }
    if (!formValues.newPassword) {
      toast.error("Ingresa la nueva contraseña");
      return;
    }

    const targetEmail = user.correo || user.email;
    if (!targetEmail) {
      toast.error("El usuario no tiene correo registrado");
      return;
    }

    resetPasswordWithTokenMutation.mutate(
      {
        email: targetEmail,
        token: formValues.token,
        newPassword: formValues.newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Contraseña restablecida con token");
          resetForm();
          onClose();
        },
        onError: (error) => {
          const message = error.message || "No fue posible aplicar el token";
          toast.error(message);
          if (message.toLowerCase().includes("no disponible")) {
            handleCapabilityUnavailable(
              "tokenReset",
              "El backend aún no soporta el flujo de token administrado."
            );
          }
        },
      }
    );
  };

  const isSubmitting =
    changePasswordMutation.isPending ||
    requestPasswordResetMutation.isPending ||
    resetPasswordWithTokenMutation.isPending;

  return (
    <Modal
      isOpen={!!user}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title={`Gestionar contraseña - ${user.nombre}`}
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {modeOptions.map((option) => {
          const isAvailable = capabilities[option.capabilityKey];
          return (
          <button
            key={option.key}
            type="button"
              onClick={() => setMode(option.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === option.key
                ? "bg-dt-accent text-white"
                : "bg-dt-card text-dt-subtle border border-dt-border"
            }`}
              disabled={isSubmitting || !isAvailable}
              title={
                !isAvailable
                  ? "Endpoint no disponible en el backend"
                  : undefined
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {!mode && (
        <>
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            No hay flujos de restablecimiento de contraseña disponibles en el backend.
          </div>

          {/* Simple pagination controls for server-side paginated users */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-dt-subtle">
              Página <span className="font-medium text-dt-foreground">{pageParam}</span>
              {users?.pagination?.totalPages ? (
                <> de <span className="font-medium text-dt-foreground">{users.pagination.totalPages}</span></>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("page", String(Math.max(1, pageParam - 1)));
                  setSearchParams(params);
                }}
                disabled={pageParam <= 1}
                className="px-3 py-1 bg-dt-card border border-dt-border rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("page", String(pageParam + 1));
                  setSearchParams(params);
                }}
                disabled={users?.pagination?.totalPages ? pageParam >= users.pagination.totalPages : users.length < limitParam}
                className="px-3 py-1 bg-dt-card border border-dt-border rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}

      {mode === "change" && capabilities.directChange && (
        <form className="space-y-4" onSubmit={handleChangePassword}>
          <input
            type="password"
            name="newPassword"
            value={formValues.newPassword}
            onChange={handleInputChange}
            placeholder="Nueva contraseña"
            className="w-full px-4 py-2 bg-dt-card border border-dt-border rounded-lg"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formValues.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirmar contraseña"
            className="w-full px-4 py-2 bg-dt-card border border-dt-border rounded-lg"
          />
          <Button type="submit" variant="primary" icon={FiKey} disabled={isSubmitting}>
            Actualizar contraseña
          </Button>
        </form>
      )}

      {mode === "reset" && capabilities.resetEmail && (
        <form className="space-y-4" onSubmit={handleSendResetEmail}>
          <p className="text-sm text-dt-subtle">
            Enviaremos un correo a <strong>{user.correo}</strong> con un enlace para
            restablecer la contraseña.
          </p>
          <Button type="submit" variant="secondary" icon={FiMail} disabled={isSubmitting}>
            Enviar correo de recuperación
          </Button>
        </form>
      )}

      {mode === "token" && capabilities.tokenReset && (
        <form className="space-y-4" onSubmit={handleResetWithToken}>
          <input
            type="text"
            name="token"
            value={formValues.token}
            onChange={handleInputChange}
            placeholder="Token proporcionado por backend"
            className="w-full px-4 py-2 bg-dt-card border border-dt-border rounded-lg"
          />
          <input
            type="password"
            name="newPassword"
            value={formValues.newPassword}
            onChange={handleInputChange}
            placeholder="Nueva contraseña"
            className="w-full px-4 py-2 bg-dt-card border border-dt-border rounded-lg"
          />
          <Button type="submit" variant="primary" icon={FiShield} disabled={isSubmitting}>
            Aplicar token y restablecer
          </Button>
        </form>
      )}
    </Modal>
  );
};

/**
 * UC-16: Users Management Page
 * Full CRUD implementation for managing system users
 */
export const UsersListPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [passwordManagerUser, setPasswordManagerUser] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get("page") || 1);
  const limitParam = Number(searchParams.get("limit") || 25);

  const { data: users = [], isLoading, error } = useUsers({ page: pageParam, limit: limitParam });
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const availableTeams = useMemo(() => {
    const uniqueTeams = new Set();
    users.forEach((user) => {
      if (user.equipo) {
        uniqueTeams.add(user.equipo);
      }
    });
    return Array.from(uniqueTeams);
  }, [users]);

  const userStats = useMemo(() => {
    if (!users.length) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        assigned: 0,
        resolved: 0,
        slaAvg: 0,
      };
    }

    const total = users.length;
    const active = users.filter((user) => user.activo).length;
    const inactive = total - active;
    const assigned = users.reduce(
      (sum, user) => sum + (user.metricas?.ticketsAsignados ?? user.ticketsAsignados ?? 0),
      0
    );
    const resolved = users.reduce(
      (sum, user) => sum + (user.metricas?.ticketsResueltos ?? user.ticketsResueltos ?? 0),
      0
    );
    const slaAvg = Math.round(
      users.reduce(
        (sum, user) => sum + (user.metricas?.slaCumplido ?? user.slaCumplido ?? 0),
        0
      ) / total
    );

    return { total, active, inactive, assigned, resolved, slaAvg };
  }, [users]);

  const userKpiCards = [
    {
      label: "Usuarios totales",
      value: userStats.total,
      icon: FiUsers,
      tone: "text-dt-foreground",
    },
    {
      label: "Activos",
      value: userStats.active,
      icon: FiActivity,
      tone: "text-green-400",
    },
    {
      label: "Tickets asignados",
      value: userStats.assigned,
      icon: FiBarChart2,
      tone: "text-blue-400",
    },
    {
      label: "Tickets resueltos",
      value: userStats.resolved,
      icon: FiCheckCircle,
      tone: "text-emerald-400",
    },
    {
      label: "SLA promedio",
      value: `${userStats.slaAvg || 0}%`,
      icon: FiPieChart,
      tone: "text-purple-400",
    },
  ];

  // Filter users by search term and role
  const filteredUsers = useMemo(() => {
    let result = users;

    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter((user) => {
        const nombre = (user.nombre || "").toString().toLowerCase();
        const correo = (user.correo || user.email || "").toString().toLowerCase();
        return nombre.includes(search) || correo.includes(search);
      });
    }

    // Filter by role
    if (roleFilter) {
      result = result.filter((user) => user.rol === roleFilter);
    }

    if (statusFilter) {
      result = result.filter((user) =>
        statusFilter === "active" ? user.activo : !user.activo
      );
    }

    if (teamFilter) {
      result = result.filter((user) => (user.equipo || "") === teamFilter);
    }

    return result;
  }, [users, searchTerm, roleFilter, statusFilter, teamFilter]);

  const handleCreate = (formData) => {
    createUserMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Usuario creado exitosamente");
        setIsCreateModalOpen(false);
      },
      onError: (err) => {
        toast.error(err.message || "Error al crear usuario");
      },
    });
  };

  const handleUpdate = (formData) => {
    // Don't send password if it's empty (not being changed)
    const dataToUpdate = { ...formData };
    if (!dataToUpdate.contrasena) {
      delete dataToUpdate.contrasena;
    }

    updateUserMutation.mutate(
      { id: editingUser.id, data: dataToUpdate },
      {
        onSuccess: () => {
          toast.success("Usuario actualizado exitosamente");
          setEditingUser(null);
        },
        onError: (err) => {
          toast.error(err.message || "Error al actualizar usuario");
        },
      }
    );
  };

  const handleToggleActive = (user) => {
    updateUserMutation.mutate(
      {
        id: user.id,
        data: { activo: !user.activo },
      },
      {
        onSuccess: () => {
          toast.success(
            user.activo ? "Usuario desactivado" : "Usuario activado"
          );
        },
        onError: (err) => {
          toast.error(err.message || "Error al cambiar estado");
        },
      }
    );
  };

  const userFormConfig = {
    fields: {
      nombre: {
        label: "Nombre Completo",
        placeholder: "Ej: Juan Pérez",
        required: true,
      },
      correo: {
        label: "Correo Electrónico",
        type: "email",
        placeholder: "juan@example.com",
        required: true,
      },
      contrasena: {
        label: editingUser ? "Contraseña (dejar vacío para no cambiar)" : "Contraseña",
        type: "password",
        placeholder: "••••••••",
        required: !editingUser, // Required only for new users
      },
      rol: {
        label: "Rol",
        type: "select",
        options: [
          { value: "ADMINISTRADOR", label: "Administrador" },
          { value: "AGENTE", label: "Agente" },
          { value: "CLIENTE", label: "Cliente" },
        ],
        required: true,
      },
      activo: {
        label: "Activo",
        type: "checkbox",
      },
    },
    buttons: {
      cancel: {
        label: "Cancelar",
        variant: "secondary",
        onClick: () => {
          setIsCreateModalOpen(false);
          setEditingUser(null);
        },
      },
      submit: {
        label: editingUser ? "Actualizar Usuario" : "Crear Usuario",
        variant: "primary",
        onClick: editingUser ? handleUpdate : handleCreate,
      },
    },
  };

  const getRoleBadgeVariant = (rol) => {
    switch (rol) {
      case "ADMINISTRADOR":
        return "danger";
      case "AGENTE":
        return "success";
      case "CLIENTE":
        return "neutral";
      default:
        return "neutral";
    }
  };

  const getUserMetrics = (user) => ({
    assigned: user.metricas?.ticketsAsignados ?? user.ticketsAsignados ?? 0,
    resolved: user.metricas?.ticketsResueltos ?? user.ticketsResueltos ?? 0,
    sla: user.metricas?.slaCumplido ?? user.slaCumplido ?? 0,
  });

  const getSlaVariant = (value) => {
    if (value >= 90) return "success";
    if (value >= 75) return "warning";
    return "error";
  };

  const columns = useMemo(() => [
    {
      key: "nombre",
      label: "Usuario",
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-dt-accent/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-dt-accent">
              {(user.nombre || "?").charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <span className="font-medium text-dt-foreground block">
              {user.nombre || "—"}
            </span>
            <span className="text-xs text-dt-subtle">{user.equipo || "Sin equipo"}</span>
          </div>
        </div>
      ),
    },
    {
      key: "correo",
      label: "Correo",
      sortable: true,
      className: "text-dt-subtle",
      render: (user) => user.correo || user.email || "—",
    },
    {
      key: "rol",
      label: "Rol",
      sortable: true,
      render: (user) => (
        <Badge variant={getRoleBadgeVariant(user.rol)} icon={FiShield}>
          {user.rol || "—"}
        </Badge>
      ),
    },
    {
      key: "activo",
      label: "Estado",
      render: (user) => (
        <Badge variant={user.activo ? "success" : "neutral"} icon={user.activo ? FiCheckCircle : FiXCircle}>
          {user.activo ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      key: "kpis",
      label: "KPIs",
      className: "text-xs text-dt-subtle",
      render: (user) => {
        const metrics = getUserMetrics(user);
        return (
          <div className="space-y-1 text-xs text-dt-subtle">
            <div className="flex justify-between">
              <span>Asignados</span>
              <span className="font-semibold text-dt-foreground">{metrics.assigned}</span>
            </div>
            <div className="flex justify-between">
              <span>Resueltos</span>
              <span className="font-semibold text-dt-foreground">{metrics.resolved}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>SLA</span>
              <Badge variant={getSlaVariant(metrics.sla)}>{Math.round(metrics.sla || 0)}%</Badge>
            </div>
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Acciones",
      headerClassName: "text-right",
      className: "text-right",
      render: (user) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleToggleActive(user)}
            className="p-2 text-dt-subtle hover:text-dt-accent transition-colors"
            title={user.activo ? "Desactivar" : "Activar"}
          >
            {user.activo ? <FiToggleRight size={20} className="text-green-500" /> : <FiToggleLeft size={20} />}
          </button>
          <button
            onClick={() => setPasswordManagerUser(user)}
            className="p-2 text-dt-subtle hover:text-dt-accent transition-colors"
            title="Gestionar contraseña"
          >
            <FiKey size={16} />
          </button>
          <button
            onClick={() => setEditingUser(user)}
            className="p-2 text-dt-subtle hover:text-dt-accent transition-colors"
            title="Editar"
          >
            <FiEdit2 size={16} />
          </button>
        </div>
      ),
    },
  ], [getRoleBadgeVariant, getUserMetrics, getSlaVariant, handleToggleActive]);

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          message="Error al cargar los usuarios"
          details={error.message}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        icon={FiUsers}
        title="Gestión de Usuarios"
        description="Administra usuarios y permisos del sistema"
        action={{ label: "Nuevo Usuario", onClick: () => setIsCreateModalOpen(true), icon: FiPlus }}
      />

        {/* KPI Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {userKpiCards.map((card) => (
            <div
              key={card.label}
              className="bg-dt-card border border-dt-border rounded-xl p-4 flex items-center gap-3 shadow-sm"
            >
              <div className={`text-2xl ${card.tone}`}>
                <card.icon />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-dt-subtle">{card.label}</p>
                <p className="text-2xl font-semibold text-dt-foreground">
                  {typeof card.value === "number"
                    ? card.value.toLocaleString("es-MX")
                    : card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

      {/* Filters */}
      <FilterBar>
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar usuarios por nombre o correo..."
          className="flex-1"
        />

        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          placeholder="Todos los roles"
          options={[
            { value: "", label: "Todos los roles" },
            { value: "ADMINISTRADOR", label: "Administradores" },
            { value: "AGENTE", label: "Agentes" },
            { value: "CLIENTE", label: "Clientes" },
          ]}
        />

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="Todos los estados"
          options={[
            { value: "", label: "Todos los estados" },
            { value: "active", label: "Activos" },
            { value: "inactive", label: "Inactivos" },
          ]}
        />

        {availableTeams.length > 0 && (
          <Select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            placeholder="Todos los equipos"
            options={[{ value: "", label: "Todos los equipos" }, ...availableTeams.map((team) => ({ value: team, label: team }))]}
          />
        )}
      </FilterBar>

      {/* Users Table */}
      <DynamicTable
        columns={columns}
        data={filteredUsers}
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
        totalPages={users?.pagination?.totalPages}
        totalItems={users?.pagination?.totalItems}
        emptyState={
          <EmptyState
            icon={FiUsers}
            title="No hay usuarios"
            description={
              searchTerm || roleFilter
                ? "No se encontraron usuarios con los filtros aplicados"
                : "Crea tu primer usuario para comenzar"
            }
            action={!searchTerm && !roleFilter ? { label: "Crear Usuario", onClick: () => setIsCreateModalOpen(true) } : undefined}
          />
        }
      />

      {/* Create Modal */}
      {isCreateModalOpen && (
        <DynamicFormModal
          title="Crear Nuevo Usuario"
          description="Completa los campos para crear un nuevo usuario"
          config={userFormConfig}
          onClose={() => setIsCreateModalOpen(false)}
          isLoading={createUserMutation.isPending}
        />
      )}

      {/* Edit Modal */}
      {editingUser && (
        <DynamicFormModal
          title="Editar Usuario"
          description="Modifica la información del usuario"
          config={userFormConfig}
          defaultValues={{
            ...editingUser,
            contrasena: "", // Don't pre-fill password
          }}
          onClose={() => setEditingUser(null)}
          isLoading={updateUserMutation.isPending}
        />
      )}

      {passwordManagerUser && (
        <PasswordManagerModal
          user={passwordManagerUser}
          onClose={() => setPasswordManagerUser(null)}
        />
      )}
    </div>
  );
};
