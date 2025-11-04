// src/layouts/AppLayout.jsx
import React from 'react';

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Falsa */}
      <aside className="w-64 bg-primary p-4 border-r border-secondary">
        <h1 className="text-foreground text-xl font-bold">ASCI</h1>
        <nav className="mt-8">
          <ul className="space-y-2">
            <li><a href="#" className="text-subtle hover:text-foreground">Dashboard</a></li>
            <li><a href="#" className="text-subtle hover:text-foreground">Tickets</a></li>
            <li><a href="#" className="text-subtle hover:text-foreground">Importar</a></li>
          </ul>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;