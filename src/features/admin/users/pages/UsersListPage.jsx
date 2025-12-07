import React from "react";
import { FiUsers, FiPlus } from "react-icons/fi";

// TODO: UC-16 - User Management UI
// Backend endpoints are implemented:
// GET /users - List all users
// POST /users - Create new user
// GET /users/:id - Get user by ID
// PATCH /users/:id - Update user
// DELETE /users/:id - Delete user
// GET /users/profile - Get current user profile
// PATCH /users/profile - Update current user profile
//
// Missing backend endpoints (noted in analysis):
// - POST /users/change-password - Change password
// - POST /auth/forgot-password - Request password reset
// - POST /auth/reset-password - Reset password with token
//
// Required implementation:
// 1. List all users with roles and status
// 2. Create/Edit user form with role selection
// 3. Activate/Deactivate users
// 4. Delete users with confirmation
// 5. Show user statistics (tickets assigned, resolved, etc.)
// 6. Password management (change, reset)

export const UsersListPage = () => {
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
        <button className="flex items-center gap-2 px-4 py-2 bg-dt-accent text-white rounded-lg hover:bg-dt-accent-hover transition-colors">
          <FiPlus />
          Nuevo Usuario
        </button>
      </div>

      {/* Placeholder Content */}
      <div className="bg-dt-card border border-dt-border rounded-lg p-12 text-center">
        <FiUsers className="text-6xl text-dt-subtle mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-dt-foreground mb-2">
          Página de Gestión de Usuarios
        </h3>
        <p className="text-dt-subtle mb-4">
          Esta página permitirá gestionar usuarios y sus roles en el sistema.
        </p>
        <div className="bg-dt-background border border-dt-border rounded-lg p-4 text-left max-w-2xl mx-auto">
          <p className="text-sm text-dt-foreground font-semibold mb-2">
            TODO: Implementar
          </p>
          <ul className="text-xs text-dt-subtle space-y-1 list-disc list-inside">
            <li>Listar todos los usuarios con roles y estado</li>
            <li>Crear nuevo usuario con asignación de rol</li>
            <li>Editar información de usuarios</li>
            <li>Activar/Desactivar usuarios</li>
            <li>Eliminar usuarios (con validación)</li>
            <li>Gestión de contraseñas y reset de contraseña</li>
            <li>Ver estadísticas de desempeño por usuario</li>
            <li>Filtrar por rol, estado, equipo</li>
          </ul>
          <p className="text-xs text-yellow-400 mt-3 font-mono">
            ⚠️ Nota: Faltan endpoints de backend para cambio de contraseña
          </p>
        </div>
      </div>
    </div>
  );
};
