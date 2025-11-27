import React, { useState } from "react";
// 1. Importa `Outlet` junto con los otros componentes de react-router-dom
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import NoraLogo from "@/shared/components/ui/NoraLogo";
import UserAvatar from "@/shared/components/ui/UserAvatar";

const navLinkClasses =
  "flex items-center px-4 py-2 text-dt-subtle rounded-md hover:bg-dt-secondary hover:text-dt-foreground transition-colors";
const activeNavLinkClasses = "bg-dt-secondary text-dt-foreground";

const roleDisplayNames = {
  AGENTE: "Agente de Soporte",
  ADMINISTRADOR: "Administrador",
};

// 2. Elimina `children` de los parámetros de la función
const AppLayout = () => {
  const { currentUser, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dt-background">
        Cargando...
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-dt-background">
      <aside
        className={`bg-dt-primary p-4 border-r border-secondary flex flex-col h-screen sticky top-0 overflow-y-auto transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}
      >
        {/* ... (toda la lógica del sidebar se mantiene igual) ... */}
        <div className="mb-8">
          <Link
            to="/"
            className="text-dt-foreground text-dt-xl font-bold flex items-center justify-center"
          >
            <NoraLogo collapsed={!sidebarOpen} />
          </Link>
          {sidebarOpen && (
            <p className="text-dt-subtle text-dt-sm text-dt-center mt-2">
              para GearUp Gadgets
            </p>
          )}
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
                <span>📊</span>
                {sidebarOpen && "Dashboard"}
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
                <span>🎫</span>
                {sidebarOpen && "Tickets"}
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
                <span>📥</span>
                {sidebarOpen && "Importar"}
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
                <span>📋</span>
                {sidebarOpen && "Órdenes"}
              </NavLink>
            </li>

            {currentUser.rol === "ADMINISTRADOR" && (
              <>
                <li>
                  <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) =>
                      isActive
                        ? `${navLinkClasses} ${activeNavLinkClasses}`
                        : navLinkClasses
                    }
                  >
                    <span>⚙️</span>
                    {sidebarOpen && "Admin Dashboard"}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/agent/c7b5a2e0-f2a8-4f7a-8b1e-9d2c5e6f8a3b"
                    className={({ isActive }) =>
                      isActive
                        ? `${navLinkClasses} ${activeNavLinkClasses}`
                        : navLinkClasses
                    }
                  >
                    <span>👤</span>
                    {sidebarOpen && "Dashboard Brenda"}
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
        <div className="mt-auto">
          <div
            className={`mt-auto ${sidebarOpen ? "p-4 rounded-md bg-dt-secondary text-dt-center" : "flex items-center justify-center"}`}
          >
            <div className="flex items-center justify-center mb-2">
              <UserAvatar user={currentUser} collapsed={!sidebarOpen} />
            </div>
            {sidebarOpen && (
              <>
                <p className="font-bold text-dt-foreground">
                  {currentUser.nombre}
                </p>
                <p className="text-dt-sm text-dt-subtle">
                  {roleDisplayNames[currentUser.rol] || "Usuario"}
                </p>
              </>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full mt-4 px-4 py-2 bg-dt-secondary text-dt-foreground rounded-md hover:bg-dt-primary transition-colors"
          >
            {sidebarOpen ? "▶" : "◀"}
          </button>
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
