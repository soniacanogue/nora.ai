import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../../../shared/components/layout/AuthLayout";
import Input from "../../../shared/components/ui/Input";
import Button from "../../../shared/components/ui/Button";
import { useAuth } from "../../../shared/hooks/useAuth";
import { sendMagicLink } from "../api/authApi";

const LoginPage = () => {
  // Estados para guardar lo que el usuario escribe
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estado para controlar si estamos enviando el formulario
  const [loading, setLoading] = useState(false);

  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirigir automáticamente cuando el usuario esté autenticado
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("¡Inicio de sesión exitoso!");
      // No navegar aquí, esperar a que currentUser se cargue
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.message || "Error al iniciar sesión. Verifica tus credenciales.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendMagicLink = async (event) => {
    event.preventDefault();
    if (!email) return toast.error('Ingresa un correo válido');
    setLoading(true);
    try {
      await sendMagicLink(email);
      toast.success('Magic link enviado. Revisa tu correo.');
    } catch (error) {
      console.error('Magic link error:', error);
      toast.error(error.message || 'No se pudo enviar el magic link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white/5 backdrop-blur-md p-8 rounded-lg border border-white/10 shadow-glow w-full relative overflow-hidden">
        {/* Decorative top line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-dt-accent to-transparent"></div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-dt-foreground tracking-tight">
            Bienvenido de Nuevo
          </h2>
          <p className="text-dt-subtle text-sm mt-2">
            Ingresa a tu cuenta de ASCI
          </p>
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
            className="w-full shadow-glow hover:shadow-glow-strong transition-all duration-300"
          >
            {loading ? "Autenticando..." : "Iniciar Sesión"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={handleSendMagicLink}
            className="w-full mt-2"
          >
            {loading ? 'Enviando...' : 'Enviar Magic Link'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-dt-subtle font-mono opacity-50">
            SECURE SYSTEM ACCESS V2.0
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
