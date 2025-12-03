import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../../../shared/components/layout/AuthLayout";
import Input from "../../../shared/components/ui/Input";
import Button from "../../../shared/components/ui/Button";
import { useAuth } from "../../../shared/hooks/useAuth";

const LoginPage = () => {
  // Estados para guardar lo que el usuario escribe
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estado para controlar si estamos enviando el formulario
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("¡Inicio de sesión exitoso!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
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
