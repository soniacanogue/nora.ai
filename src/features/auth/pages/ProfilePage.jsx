import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "@/shared/hooks/useAuth";
import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";
import { usersApi } from "@/features/admin/users/api";

const ProfilePage = () => {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: currentUser?.nombre || "",
    correo: currentUser?.correo || "",
  });

  const [pwData, setPwData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updated = await usersApi.updateProfile({ nombre: formData.nombre });
      // updateUser updates the react-query cache for profile
      updateUser(updated);
      toast.success("Perfil actualizado");
      navigate("/");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("No se pudo actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwData((p) => ({ ...p, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    // Basic client-side validation
    if (!pwData.currentPassword) {
      toast.error("Ingrese su contraseña actual");
      return;
    }
    if (pwData.newPassword.length < 8) {
      toast.error("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (pwData.newPassword !== pwData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    try {
      await usersApi.changePassword({
        userId: currentUser.id,
        currentPassword: pwData.currentPassword,
        newPassword: pwData.newPassword,
      });
      toast.success("Contraseña actualizada");
      setPwData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Error changing password:", err);
      const message = err?.response?.data?.message || err?.message || "No se pudo cambiar la contraseña";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/5 backdrop-blur-md rounded-md border border-white/10">
      <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="correo"
          label="Correo Electrónico"
          type="email"
          name="correo"
          value={formData.correo}
          disabled
        />

        <Input
          id="nombre"
          label="Nombre completo"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />

        <div className="flex gap-3 mt-4">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Guardar
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          
        </div>
      </form>

      <div className="mt-8 border-t border-white/5 pt-6">
        <h3 className="text-lg font-semibold mb-3">Cambiar contraseña</h3>
        <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
          <Input
            id="currentPassword"
            name="currentPassword"
            label="Contraseña actual"
            type="password"
            value={pwData.currentPassword}
            onChange={handlePwChange}
            required
          />

          <Input
            id="newPassword"
            name="newPassword"
            label="Nueva contraseña"
            type="password"
            value={pwData.newPassword}
            onChange={handlePwChange}
            required
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            label="Confirmar nueva contraseña"
            type="password"
            value={pwData.confirmPassword}
            onChange={handlePwChange}
            required
          />

          <div className="flex gap-3 mt-2">
            <Button type="submit" variant="danger" isLoading={isLoading}>
              Cambiar contraseña
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPwData({ currentPassword: "", newPassword: "", confirmPassword: "" })}
            >
              Limpiar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
