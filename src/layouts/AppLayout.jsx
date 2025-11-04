// src/layouts/AppLayout.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const navLinkClasses = "flex items-center px-4 py-2 text-subtle rounded-md hover:bg-secondary hover:text-foreground transition-colors";
const activeNavLinkClasses = "bg-secondary text-foreground";

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-primary p-4 border-r border-secondary flex flex-col">
        <div className="mb-8">
          <Link to="/" className="text-foreground text-xl font-bold">Nora AI</Link>
          <p className="text-subtle text-sm">para GearUp Gadgets</p>
        </div>

        {/* Menú de Navegación */}
        <nav>
          <ul className="space-y-2">
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? `${navLinkClasses} ${activeNavLinkClasses}` : navLinkClasses} end>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/tickets" className={({ isActive }) => isActive ? `${navLinkClasses} ${activeNavLinkClasses}` : navLinkClasses}>
                Tickets
              </NavLink>
            </li>
            <li>
              <NavLink to="/import" className={({ isActive }) => isActive ? `${navLinkClasses} ${activeNavLinkClasses}` : navLinkClasses}>
                Importar
              </NavLink>
            </li>
            {/* 👇 AQUÍ ESTÁ EL NUEVO ENLACE A "ÓRDENES" 👇 */}
            <li>
              <NavLink to="/orders" className={({ isActive }) => isActive ? `${navLinkClasses} ${activeNavLinkClasses}` : navLinkClasses}>
                Órdenes
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Perfil de Usuario (abajo) */}
        <div className="mt-auto">
          <div className="p-4 rounded-md bg-secondary text-center">
            <p className="font-bold text-foreground">Brenda</p>
            <p className="text-sm text-subtle">Agente de Soporte</p>
          </div>
        </div>
      </aside>

      {/* Contenedor del Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;