import React, { useState } from "react";
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
        <div className="mb-8">
          <Link
            to="/"
            className="text-dt-foreground text-xl font-bold flex items-center justify-center"
          >
            <NoraLogo collapsed={!sidebarOpen} />
          </Link>
          {sidebarOpen && (
            <p className="text-dt-subtle text-sm text-center mt-2">
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
                {sidebarOpen && <span className="ml-3">Dashboard</span>}
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
                {sidebarOpen && <span className="ml-3">Tickets</span>}
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
                {sidebarOpen && <span className="ml-3">Importar</span>}
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
                {sidebarOpen && <span className="ml-3">Órdenes</span>}
              </NavLink>
            </li>

            {/* --- AJUSTE CLAVE: Sección de Administrador Mejorada --- */}
            {currentUser.rol === "ADMINISTRADOR" && (
              <>
                {/* Separador visual para agrupar los enlaces de admin */}
                <li className="pt-4">
                  {sidebarOpen && (
                    <p className="px-4 text-xs font-bold text-dt-subtle uppercase tracking-wider mb-2">
                      Administración
                    </p>
                  )}
                  {!sidebarOpen && <hr className="my-2 border-secondary" />}
                </li>

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
                    {sidebarOpen && (
                      <span className="ml-3">Admin Dashboard</span>
                    )}
                  </NavLink>
                </li>

                {/* --- NUEVO: Enlace a la configuración de Agentes de IA --- */}
                <li>
                  <NavLink
                    to="/admin/ai-agents"
                    className={({ isActive }) =>
                      isActive
                        ? `${navLinkClasses} ${activeNavLinkClasses}`
                        : navLinkClasses
                    }
                  >
                    <span>🤖</span>
                    {sidebarOpen && <span className="ml-3">Agentes IA</span>}
                  </NavLink>
                </li>

                {/* --- ELIMINADO: Se quita el enlace antiguo y hardcodeado a /admin/agent/... --- */}
              </>
            )}
          </ul>
        </nav>
        <div className="mt-auto">
          <div
            className={`mt-auto ${sidebarOpen ? "p-4 rounded-md bg-dt-secondary text-center" : "flex items-center justify-center"}`}
          >
            <div className="flex items-center justify-center mb-2">
              <UserAvatar user={currentUser} collapsed={!sidebarOpen} />
            </div>
            {sidebarOpen && (
              <>
                <p className="font-bold text-dt-foreground">
                  {currentUser.nombre}
                </p>
                <p className="text-sm text-dt-subtle">
                  {roleDisplayNames[currentUser.rol] || "Usuario"}
                </p>
              </>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full mt-4 px-4 py-2 bg-dt-secondary text-dt-foreground rounded-md hover:bg-dt-primary transition-colors"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
