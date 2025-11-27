import React, { useState } from "react";
import AuthLayout from "../../../shared/components/layout/AuthLayout";
import Input from "../../../shared/components/ui/Input";
import Button from "../../../shared/components/ui/Button";

const LoginPage = () => {
  // Estados para guardar lo que el usuario escribe
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estado para controlar si estamos enviando el formulario
  const [loading, setLoading] = useState(false);

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = (event) => {
    event.preventDefault(); // Evita que la página se recargue
    setLoading(true);

    console.log("Simulando envío de datos...");
    console.log("Email:", email);
    console.log("Password:", password);

    // Simulamos un retraso de 2 segundos (como si fuera una llamada a un servidor)
    setTimeout(() => {
      console.log("Respuesta recibida.");
      setLoading(false);
    }, 2000);
  };

  return (
    <AuthLayout>
      <div className="bg-dt-primary p-8 rounded-lg border border-secondary shadow-lg w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-dt-foreground">
            Bienvenido de Nuevo
          </h2>
          <p className="text-dt-subtle">Ingresa a tu cuenta de ASCI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="email"
            label="Correo Electrónico"
            type="email"
            placeholder="brenda@gearup.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            id="password"
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
