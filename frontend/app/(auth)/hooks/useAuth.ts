import { useAuthStore } from "../store/slices/auth.slice";

/**
 * Hook para acceder al estado de autenticación
 * Proporciona una interfaz limpia para acceder al usuario y estado de auth
 */
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const project = useAuthStore((state) => state.appKey);
  const isLoading = useAuthStore((state) => state.isLoading);
  const plan = useAuthStore((state) => state.plan);
  const isAuthenticated = Boolean(token);

  return {
    user,
    token,
    project,
    isLoading,
    plan,
    isAuthenticated,
  };
};
