import React from "react";
// 1. Importa `Outlet` junto con los otros componentes de react-router-dom
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";

const navLinkClasses =
  "flex items-center px-4 py-2 text-subtle rounded-md hover:bg-secondary hover:text-foreground transition-colors";
const activeNavLinkClasses = "bg-secondary text-foreground";

const roleDisplayNames = {
  AGENTE: "Agente de Soporte",
  ADMINISTRADOR: "Administrador",
};

// 2. Elimina `children` de los parámetros de la función
const AppLayout = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        Cargando...
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 bg-primary p-4 border-r border-secondary flex flex-col">
        {/* ... (toda la lógica del sidebar se mantiene igual) ... */}
        <div className="mb-8">
          <Link to="/" className="text-foreground text-xl font-bold">
            Nora AI
          </Link>
          <p className="text-subtle text-sm">para GearUp Gadgets</p>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? `${navLinkClasses} ${activeNavLinkClasses}`
                    : navLinkClasses
                }
                end
              >
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/tickets"
                className={({ isActive }) =>
                  isActive
                    ? `${navLinkClasses} ${activeNavLinkClasses}`
                    : navLinkClasses
                }
              >
                Tickets
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/import"
                className={({ isActive }) =>
                  isActive
                    ? `${navLinkClasses} ${activeNavLinkClasses}`
                    : navLinkClasses
                }
              >
                Importar
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  isActive
                    ? `${navLinkClasses} ${activeNavLinkClasses}`
                    : navLinkClasses
                }
              >
                Órdenes
              </NavLink>
            </li>

            {currentUser.rol === "ADMINISTRADOR" && (
              <li>
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? `${navLinkClasses} ${activeNavLinkClasses}`
                      : navLinkClasses
                  }
                >
                  Admin Dashboard
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
        <div className="mt-auto">
          <div className="p-4 rounded-md bg-secondary text-center">
            <p className="font-bold text-foreground">{currentUser.nombre}</p>
            <p className="text-sm text-subtle">
              {roleDisplayNames[currentUser.rol] || "Usuario"}
            </p>
          </div>
        </div>
      </aside>

      {/* 3. Reemplaza `{children}` con `<Outlet />` */}
      {/* Aquí es donde React Router renderizará el componente de la ruta hija activa */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
