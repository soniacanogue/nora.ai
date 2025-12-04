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
  const [expandedSections, setExpandedSections] = useState({
    principal: false,
    admin: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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
        className={`bg-dt-primary border-r border-secondary flex flex-col h-screen sticky top-0 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}
      >
        {/* Fixed Header: Logo */}
        <div className="p-4 mb-4 flex-shrink-0">
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

        {/* Scrollable Nav */}
        <nav className="flex-1 overflow-y-auto px-4">
          <ul className="space-y-2">
            {/* --- PRINCIPAL SECTION --- */}
            <li>
              <button
                onClick={() => toggleSection("principal")}
                className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-dt-subtle uppercase tracking-wider hover:text-dt-foreground transition-colors"
              >
                <span>{sidebarOpen ? "Principal" : "•"}</span>
                {sidebarOpen && (
                  <span className="text-lg">
                    {expandedSections.principal ? "▼" : "▶"}
                  </span>
                )}
              </button>
            </li>

            {expandedSections.principal && (
              <>
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
              </>
            )}

            {/* --- AJUSTE CLAVE: Sección de Administrador Mejorada (Colapsable) --- */}
            {currentUser.rol === "ADMINISTRADOR" && (
              <>
                <li className="pt-4">
                  <button
                    onClick={() => toggleSection("admin")}
                    className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-dt-subtle uppercase tracking-wider hover:text-dt-foreground transition-colors"
                  >
                    <span>{sidebarOpen ? "Administración" : "⚙"}</span>
                    {sidebarOpen && (
                      <span className="text-lg">
                        {expandedSections.admin ? "▼" : "▶"}
                      </span>
                    )}
                  </button>
                </li>

                {expandedSections.admin && (
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
                        {sidebarOpen && (
                          <span className="ml-3">Agentes IA</span>
                        )}
                      </NavLink>
                    </li>

                    {/* --- NUEVO: Enlace a la gestión de Plantillas (dentro de Administración) --- */}
                    <li>
                      <NavLink
                        to="/admin/templates"
                        className={({ isActive }) =>
                          isActive
                            ? `${navLinkClasses} ${activeNavLinkClasses}`
                            : navLinkClasses
                        }
                      >
                        <span>📄</span>
                        {sidebarOpen && (
                          <span className="ml-3">Plantillas</span>
                        )}
                      </NavLink>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </nav>

        {/* Fixed Footer: User Card & Toggle */}
        <div className="p-4 flex-shrink-0 border-t border-secondary">
          <div
            className={
              sidebarOpen
                ? "p-4 rounded-md bg-dt-secondary text-center"
                : "flex items-center justify-center"
            }
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
