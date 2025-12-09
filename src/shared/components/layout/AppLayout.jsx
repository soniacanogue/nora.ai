import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { toast } from "react-hot-toast";
import NoraLogo from "@/shared/components/ui/NoraLogo";
import UserAvatar from "@/shared/components/ui/UserAvatar";

const navLinkClasses =
  "flex items-center px-4 py-2 text-dt-subtle rounded-md hover:bg-white/5 hover:text-dt-foreground transition-all duration-200 relative group";
const activeNavLinkClasses = "text-dt-accent bg-white/5 shadow-glow";

const roleDisplayNames = {
  AGENTE: "Agente de Soporte",
  ADMINISTRADOR: "Administrador",
};

const AppLayout = () => {
  const { currentUser, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    navigate("/login");
  };
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    principal: true, // Default open for better UX
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
        <div className="animate-pulse text-dt-accent">Cargando sistema...</div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-dt-background text-dt-foreground font-sans selection:bg-dt-accent selection:text-white">
      <aside
        className={`bg-dt-background/50 backdrop-blur-xl border-r border-white/5 flex flex-col h-screen sticky top-0 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}
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
            <p className="text-dt-subtle text-xs text-center mt-2 font-mono tracking-wider opacity-70">
              SYSTEM V.2.0
            </p>
          )}
        </div>

        {/* Scrollable Nav */}
        <nav className="flex-1 overflow-y-auto px-2">
          <ul className="space-y-1">
            {/* --- PRINCIPAL SECTION --- */}
            <li>
              <button
                onClick={() => toggleSection("principal")}
                className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold text-dt-subtle uppercase tracking-widest hover:text-dt-foreground transition-colors font-mono"
              >
                <span>{sidebarOpen ? "Principal" : "•"}</span>
                {sidebarOpen && (
                  <span className="text-xs">
                    {expandedSections.principal ? "▼" : "▶"}
                  </span>
                )}
              </button>
            </li>

            {expandedSections.principal && (
              <>
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      isActive
                        ? `${navLinkClasses} ${activeNavLinkClasses}`
                        : navLinkClasses
                    }
                    end
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-dt-accent rounded-r-full shadow-[0_0_10px_rgba(138,43,226,0.8)]" />
                        )}
                        <span className="material-symbols-outlined text-xl relative z-10">
                          dashboard
                        </span>
                        {sidebarOpen && (
                          <span className="ml-3 text-sm font-medium relative z-10">
                            Dashboard
                          </span>
                        )}
                      </>
                    )}
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
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-dt-accent rounded-r-full shadow-[0_0_10px_rgba(138,43,226,0.8)]" />
                        )}
                        <span className="material-symbols-outlined text-xl relative z-10">
                          confirmation_number
                        </span>
                        {sidebarOpen && (
                          <span className="ml-3 text-sm font-medium relative z-10">
                            Tickets
                          </span>
                        )}
                      </>
                    )}
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
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-dt-accent rounded-r-full shadow-[0_0_10px_rgba(138,43,226,0.8)]" />
                        )}
                        <span className="material-symbols-outlined text-xl relative z-10">
                          upload_file
                        </span>
                        {sidebarOpen && (
                          <span className="ml-3 text-sm font-medium relative z-10">
                            Importar
                          </span>
                        )}
                      </>
                    )}
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
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-dt-accent rounded-r-full shadow-[0_0_10px_rgba(138,43,226,0.8)]" />
                        )}
                        <span className="material-symbols-outlined text-xl relative z-10">
                          inventory_2
                        </span>
                        {sidebarOpen && (
                          <span className="ml-3 text-sm font-medium relative z-10">
                            Órdenes
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              </>
            )}

            {/* --- UC-09: Customers Navigation (Medium Priority) --- */}
            {expandedSections.principal && (
              <li>
                <NavLink
                  to="/customers"
                  className={({ isActive }) =>
                    isActive
                      ? `${navLinkClasses} ${activeNavLinkClasses}`
                      : navLinkClasses
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-dt-accent rounded-r-full shadow-[0_0_10px_rgba(138,43,226,0.8)]" />
                      )}
                      <span className="material-symbols-outlined text-xl relative z-10">
                        people
                      </span>
                      {sidebarOpen && (
                        <span className="ml-3 text-sm font-medium relative z-10">
                          Clientes
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            )}

            {/* --- AJUSTE CLAVE: Sección de Administrador Mejorada (Colapsable) --- */}
            {currentUser.rol === "ADMINISTRADOR" && (
              <>
                <li className="pt-4">
                  <button
                    onClick={() => toggleSection("admin")}
                    className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold text-dt-subtle uppercase tracking-widest hover:text-dt-foreground transition-colors font-mono"
                  >
                    <span>{sidebarOpen ? "Admin" : "⚙"}</span>
                    {sidebarOpen && (
                      <span className="text-xs">
                        {expandedSections.admin ? "▼" : "▶"}
                      </span>
                    )}
                  </button>
                </li>

                {expandedSections.admin && (
                  <>
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
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-dt-accent rounded-r-full shadow-[0_0_10px_rgba(138,43,226,0.8)]" />
                            )}
                            <span className="material-symbols-outlined text-xl relative z-10">
                              smart_toy
                            </span>
                            {sidebarOpen && (
                              <span className="ml-3 text-sm font-medium relative z-10">
                                Agentes IA
                              </span>
                            )}
                          </>
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
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-dt-accent rounded-r-full shadow-[0_0_10px_rgba(138,43,226,0.8)]" />
                            )}
                            <span className="material-symbols-outlined text-xl relative z-10">
                              description
                            </span>
                            {sidebarOpen && (
                              <span className="ml-3 text-sm font-medium relative z-10">
                                Plantillas
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </li>

                    {/* --- NUEVO: Enlace a la Base de Conocimiento (dentro de Administración) --- */}
                    <li>
                      <NavLink
                        to="/admin/knowledge-base"
                        className={({ isActive }) =>
                          isActive
                            ? `${navLinkClasses} ${activeNavLinkClasses}`
                            : navLinkClasses
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-dt-accent rounded-r-full shadow-[0_0_10px_rgba(138,43,226,0.8)]" />
                            )}
                            <span className="material-symbols-outlined text-xl relative z-10">
                              book
                            </span>
                            {sidebarOpen && (
                              <span className="ml-3 text-sm font-medium relative z-10">
                                Base de Conocimiento
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </li>

                    {/* --- NUEVO: Enlace a Usuarios (dentro de Administración) --- */}
                    <li>
                      <NavLink
                        to="/admin/users"
                        className={({ isActive }) =>
                          isActive
                            ? `${navLinkClasses} ${activeNavLinkClasses}`
                            : navLinkClasses
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-dt-accent rounded-r-full shadow-[0_0_10px_rgba(138,43,226,0.8)]" />
                            )}
                            <span className="material-symbols-outlined text-xl relative z-10">
                              group
                            </span>
                            {sidebarOpen && (
                              <span className="ml-3 text-sm font-medium relative z-10">
                                Usuarios
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </li>

                    {/* --- NUEVO: Enlace a Etiquetas (dentro de Administración) --- */}
                    <li>
                      <NavLink
                        to="/admin/tags"
                        className={({ isActive }) =>
                          isActive
                            ? `${navLinkClasses} ${activeNavLinkClasses}`
                            : navLinkClasses
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-dt-accent rounded-r-full shadow-[0_0_10px_rgba(138,43,226,0.8)]" />
                            )}
                            <span className="material-symbols-outlined text-xl relative z-10">
                              label
                            </span>
                            {sidebarOpen && (
                              <span className="ml-3 text-sm font-medium relative z-10">
                                Etiquetas
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </li>

                    {/* --- NUEVO: Enlace a Integraciones (dentro de Administración) --- */}
                    <li>
                      <NavLink
                        to="/admin/integrations"
                        className={({ isActive }) =>
                          isActive
                            ? `${navLinkClasses} ${activeNavLinkClasses}`
                            : navLinkClasses
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-dt-accent rounded-r-full shadow-[0_0_10px_rgba(138,43,226,0.8)]" />
                            )}
                            <span className="material-symbols-outlined text-xl relative z-10">
                              link
                            </span>
                            {sidebarOpen && (
                              <span className="ml-3 text-sm font-medium relative z-10">
                                Integraciones
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </li>

                    {/* --- NUEVO: Enlace a Auditoría (dentro de Administración) --- */}
                    <li>
                      <NavLink
                        to="/admin/audit-logs"
                        className={({ isActive }) =>
                          isActive
                            ? `${navLinkClasses} ${activeNavLinkClasses}`
                            : navLinkClasses
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-dt-accent rounded-r-full shadow-[0_0_10px_rgba(138,43,226,0.8)]" />
                            )}
                            <span className="material-symbols-outlined text-xl relative z-10">
                              fact_check
                            </span>
                            {sidebarOpen && (
                              <span className="ml-3 text-sm font-medium relative z-10">
                                Auditoría
                              </span>
                            )}
                          </>
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
        <div className="p-4 flex-shrink-0 border-t border-white/5">
          <div
            className={
              sidebarOpen
                ? "p-3 rounded-md bg-white/5 border border-white/5 text-center backdrop-blur-sm"
                : "flex items-center justify-center"
            }
          >
            <div className="flex items-center justify-center mb-2">
              <UserAvatar user={currentUser} collapsed={!sidebarOpen} />
            </div>
            {sidebarOpen && (
              <>
                <p className="font-bold text-dt-foreground text-sm">
                  {currentUser.nombre}
                </p>
                <p className="text-xs text-dt-subtle font-mono">
                  {roleDisplayNames[currentUser.rol] || "Usuario"}
                </p>
                  <div className="mt-2 flex items-center justify-center gap-3">
                    <Link
                      to="/profile"
                      className="text-xs text-dt-accent hover:underline"
                    >
                      Editar perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Cerrar sesión
                    </button>
                  </div>
              </>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full mt-4 px-4 py-2 bg-transparent border border-white/10 text-dt-subtle rounded-md hover:bg-white/5 hover:text-dt-foreground transition-colors text-xs uppercase tracking-widest"
          >
            {sidebarOpen ? "Colapsar" : "▶"}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto relative">
        {/* Debug helper (solo en desarrollo): registra clicks y elemento en el punto para detectar overlays) */}
        {process.env.NODE_ENV !== "production" && <DebugClickInspector />}
        {/* Background ambient glow */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
          <div
            aria-hidden="true"
            className="absolute top-[-15%] right-[-10%] w-[650px] h-[650px] bg-dt-accent/30 rounded-full mix-blend-overlay transform-gpu will-change-transform ambient-glow"
          ></div>
          <div
            aria-hidden="true"
            className="absolute bottom-[-12%] left-[-8%] w-[600px] h-[600px] bg-blue-500/20 rounded-full mix-blend-overlay transform-gpu will-change-transform ambient-glow-2"
          ></div>
        </div>
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;

// Componente de depuración para ayudar a localizar overlays/elementos que bloqueen clicks
const DebugClickInspector = () => {
  React.useEffect(() => {
    const handler = (e) => {
      try {
        const elAtPoint = document.elementFromPoint(e.clientX, e.clientY);
        console.debug("[ClickInspector] event.target:", e.target);
        console.debug("[ClickInspector] elementFromPoint:", elAtPoint);
        if (elAtPoint) {
          const cs = window.getComputedStyle(elAtPoint);
          console.debug("[ClickInspector] computed: pointer-events=", cs.pointerEvents, " z-index=", cs.zIndex);
        }
      } catch (err) {
        console.error("[ClickInspector] error:", err);
      }
    };

    document.addEventListener("click", handler, { capture: true });
    return () => document.removeEventListener("click", handler, { capture: true });
  }, []);

  return null;
};
