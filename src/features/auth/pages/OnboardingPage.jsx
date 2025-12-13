import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { usersApi } from "@/features/admin/users/api";
import { toast } from "react-hot-toast";
import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";
import NoraLogo from "@/shared/components/ui/NoraLogo";

const OnboardingPage = () => {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: currentUser?.nombre || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Update profile with new data (do NOT clear primeraVez here)
      const updatedUser = await usersApi.updateProfile({
        ...formData,
      });

      updateUser(updatedUser);
      toast.success("Perfil actualizado correctamente");
      // Redirect user to create password flow
      navigate("/auth/set-password");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-dt-accent to-transparent opacity-50"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-dt-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-lg shadow-glow relative z-10">
        <div className="flex flex-col items-center text-center">
          <NoraLogo className="h-12 w-auto mb-4" />
          <h2 className="text-2xl font-bold text-dt-foreground">
            Bienvenido a Nora
          </h2>
          <p className="mt-2 text-sm text-dt-subtle">
            Antes de comenzar, por favor confirma tus datos.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Input
                id="email"
                label="Correo Electrónico"
                type="email"
                value={currentUser?.correo || ""}
                disabled
                className="text-dt-subtle cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-dt-subtle">
                El correo no se puede cambiar.
              </p>
            </div>

            <div>
              <Input
                id="nombre"
                name="nombre"
                label="Nombre Completo"
                type="text"
                required
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Guardar y Continuar
            </Button>

            {/* Skip removed: user must set password in the next step */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
