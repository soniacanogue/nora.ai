import React, { useState, useMemo } from "react";
import {
  FiUsers,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiShield,
} from "react-icons/fi";
import toast from "react-hot-toast";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "../hooks";
import DynamicFormModal from "@/shared/components/ui/DynamicFormModal";
import Button from "@/shared/components/ui/Button";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import Badge from "@/shared/components/ui/Badge";

/**
 * UC-16: Users Management Page
 * Full CRUD implementation for managing system users
 */
export const UsersListPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const { data: users = [], isLoading, error } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Filter users by search term and role
  const filteredUsers = useMemo(() => {
    let result = users;

    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.nombre.toLowerCase().includes(search) ||
          user.correo.toLowerCase().includes(search)
      );
    }

    // Filter by role
    if (roleFilter) {
      result = result.filter((user) => user.rol === roleFilter);
    }

    return result;
  }, [users, searchTerm, roleFilter]);

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

  const handleDelete = (user) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar al usuario "${user.nombre}"?`
      )
    ) {
      deleteUserMutation.mutate(user.id, {
        onSuccess: () => {
          toast.success("Usuario eliminado");
        },
        onError: (err) => {
          toast.error(err.message || "Error al eliminar usuario");
        },
      });
    }
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiUsers className="text-2xl text-dt-accent" />
          <div>
            <h1 className="text-2xl font-bold text-dt-foreground">
              Gestión de Usuarios
            </h1>
            <p className="text-sm text-dt-subtle">
              Administra usuarios y permisos del sistema
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          variant="primary"
          icon={FiPlus}
        >
          Nuevo Usuario
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dt-subtle" />
          <input
            type="text"
            placeholder="Buscar usuarios por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dt-card border border-dt-border rounded-lg text-dt-foreground placeholder-dt-subtle focus:outline-none focus:ring-2 focus:ring-dt-accent"
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 bg-dt-card border border-dt-border rounded-lg text-dt-foreground focus:outline-none focus:ring-2 focus:ring-dt-accent"
        >
          <option value="">Todos los roles</option>
          <option value="ADMINISTRADOR">Administradores</option>
          <option value="AGENTE">Agentes</option>
          <option value="CLIENTE">Clientes</option>
        </select>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="bg-dt-card border border-dt-border rounded-lg overflow-hidden">
          <div className="animate-pulse p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-dt-border rounded"></div>
            ))}
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={FiUsers}
          title="No hay usuarios"
          description={
            searchTerm || roleFilter
              ? "No se encontraron usuarios con los filtros aplicados"
              : "Crea tu primer usuario para comenzar"
          }
          action={
            !searchTerm &&
            !roleFilter && {
              label: "Crear Usuario",
              onClick: () => setIsCreateModalOpen(true),
            }
          }
        />
      ) : (
        <div className="bg-dt-card border border-dt-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dt-background border-b border-dt-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-dt-subtle uppercase">
                    Usuario
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-dt-subtle uppercase">
                    Correo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-dt-subtle uppercase">
                    Rol
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-dt-subtle uppercase">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-dt-subtle uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dt-border">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-dt-background/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-dt-accent/20 flex items-center justify-center">
                          <span className="text-sm font-semibold text-dt-accent">
                            {user.nombre.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-dt-foreground">
                          {user.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-dt-subtle">
                      {user.correo}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={getRoleBadgeVariant(user.rol)}
                        icon={FiShield}
                      >
                        {user.rol}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={user.activo ? "success" : "neutral"}
                        icon={user.activo ? FiCheckCircle : FiXCircle}
                      >
                        {user.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleToggleActive(user)}
                          className="p-2 text-dt-subtle hover:text-dt-accent transition-colors"
                          title={user.activo ? "Desactivar" : "Activar"}
                        >
                          {user.activo ? (
                            <FiToggleRight
                              size={20}
                              className="text-green-500"
                            />
                          ) : (
                            <FiToggleLeft size={20} />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-2 text-dt-subtle hover:text-dt-accent transition-colors"
                          title="Editar"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-2 text-dt-subtle hover:text-red-500 transition-colors"
                          title="Eliminar"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
    </div>
  );
};
