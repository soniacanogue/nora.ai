import React from "react";

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-dt-background text-dt-foreground flex flex-col items-center p-4 sm:p-8">
      <header className="w-full max-w-2xl mb-8">
        <h1 className="text-3xl font-bold text-center text-dt-foreground">
          Nora AI
        </h1>
        <p className="text-dt-subtle text-center">
          Centro de Soporte para GearUp Gadgets
        </p>
      </header>
      <main className="w-full max-w-2xl">{children}</main>
    </div>
  );
};

export default PublicLayout;
