import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/authApi";

/**
 * Hook para obtener el perfil del usuario actual.
 * Configurado con staleTime: Infinity para evitar recargas innecesarias,
 * ya que la información del perfil cambia poco.
 * @param {Object} options - Opciones adicionales para useQuery (ej. enabled).
 */
export const useProfile = (options = {}) => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: Infinity, // Los datos se consideran frescos indefinidamente
    cacheTime: Infinity, // Mantener en caché tanto como sea posible
    retry: false, // No reintentar si falla (ej. token inválido)
    refetchOnWindowFocus: false, // No recargar al cambiar de ventana
    ...options,
  });
};
