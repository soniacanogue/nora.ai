import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../../shared/components/layout/AuthLayout';
import Input from '../../../shared/components/ui/Input';
import Button from '../../../shared/components/ui/Button';
import { useAuth } from '../../../shared/hooks/useAuth';
import { changePassword, updateUser as updateUserApi } from '../api/authApi';

export default function SetPasswordPage() {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 8) return toast.error('La contraseña debe tener al menos 8 caracteres');
    if (password !== confirm) return toast.error('Las contraseñas no coinciden');
    if (!currentUser?.id) return toast.error('Usuario no disponible');

    setLoading(true);
    try {
      await changePassword(currentUser.id, password);
      // Mark primeraVez = false now that password is set
      try {
        const updatedUser = await updateUserApi(currentUser.id, { primeraVez: false });
        // update local cache/state
        updateUser(updatedUser);
      } catch (uerr) {
        console.warn('Could not update primeraVez flag:', uerr);
      }

      toast.success('Contraseña establecida correctamente');
      navigate('/dashboard');
    } catch (err) {
      console.error('changePassword error', err);
      toast.error(err.message || 'No se pudo establecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // Only allow access to this page if the user's `primeraVez` flag is true
    if (currentUser && currentUser.primeraVez !== true) {
      // If user exists and primeraVez is not true, redirect away
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto bg-white/5 p-8 rounded-lg border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Configura tu contraseña</h2>
        <p className="text-sm text-dt-subtle mb-6">Crea una contraseña para iniciar sesión posteriormente con email + contraseña.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="password" label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input id="confirm" label="Confirmar contraseña" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <Button type="submit" variant="primary" disabled={loading} className="w-full">
            {loading ? 'Guardando...' : 'Guardar contraseña'}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
