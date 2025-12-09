import { useEffect } from 'react';
import supabase from '@/shared/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// use shared singleton client from src/shared/lib/supabaseClient.js

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    (async () => {
      console.log('[AuthCallback] mounted, url=', window.location.href);
      try {
        // First attempt: use the official helper to exchange code/hash for a session
        if (typeof supabase.auth.getSessionFromUrl === 'function') {
          const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
          if (error) {
            console.warn('getSessionFromUrl returned error:', error?.message || error);
          }
          if (data?.session) {
            if (mounted) navigate('/dashboard');
            return;
          }
        } else {
          console.warn('supabase.auth.getSessionFromUrl is not available on this client version');
        }

        // Fallback: parse both query and URL fragment for tokens
        const search = window.location.search ? window.location.search.substring(1) : '';
        const hash = window.location.hash ? window.location.hash.substring(1) : '';
        console.log('[AuthCallback] search=', search, ' hash=', hash);

        const combined = new URLSearchParams(search + (search && hash ? '&' : '') + hash);
        const access_token = combined.get('access_token') || combined.get('accessToken') || combined.get('access-token');
        const refresh_token = combined.get('refresh_token') || combined.get('refreshToken');
        const code = combined.get('code');

        if (code) {
          console.log('[AuthCallback] received code param, but PKCE/code exchange may require client helper or server-side exchange:', code);
          toast('Recibido code. Intercambio pendiente según versión del cliente.');
        }

        if (access_token) {
          console.log('[AuthCallback] found access_token in URL fragment/search. Attempting setSession fallback.');
          try {
            if (typeof supabase.auth.setSession === 'function') {
              await supabase.auth.setSession({ access_token, refresh_token });
              toast.success('Inicio de sesión completado');
              if (mounted) navigate('/dashboard');
              return;
            } else if (typeof supabase.auth.setAuth === 'function') {
              supabase.auth.setAuth(access_token);
              toast.success('Inicio de sesión completado (setAuth)');
              if (mounted) navigate('/dashboard');
              return;
            } else {
              console.warn('No compatible setSession/setAuth found on supabase client. Falling back to app-level token storage.');
              // As a last-resort fallback (when client lib lacks helpers), persist token under the
              // application key used by AuthProvider and force a full reload so the provider picks it up.
              try {
                localStorage.setItem('token', access_token);
                toast.success('Token guardado localmente. Redirigiendo...');
                // Force full reload to ensure AuthProvider re-reads localStorage on mount
                window.location.href = `${window.location.origin}/dashboard`;
                return;
              } catch (e) {
                console.error('Failed to persist token fallback:', e);
                toast.error('No se pudo persistir token en localStorage.');
              }
            }
          } catch (err) {
            console.error('Fallback setSession failed:', err);
            toast.error('Error al establecer sesión desde token.');
          }
        }

        // Final fallback: listen for auth state changes for a short time
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN') {
            if (mounted) navigate('/dashboard');
          }
        });

        // cleanup listener after 10s
        setTimeout(() => {
          try { listener?.subscription?.unsubscribe?.(); } catch (e) {}
        }, 10000);

      } catch (err) {
        console.error('Auth callback failed:', err);
        if (mounted) navigate('/login?error=auth');
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return <div>Verificando tu cuenta... espera un momento.</div>;
}
