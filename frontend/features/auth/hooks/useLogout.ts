import { toast } from "sonner";
import { useShopStore } from "@/app/(protected)/store/shops.slice";
import { useAuthStore } from "../auth.slice";
import { useLogoutMutation } from "./useAuthMutations";

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearShops = useShopStore((state) => state.clearShops);

  const { mutate, isPending } = useLogoutMutation();

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        clearAuth();
        clearShops();
        toast.success("Sesión cerrada", {
          description: "Has cerrado sesión correctamente",
        });
      },
      onError: () => {
        toast.warning("Sesión cerrada localmente", {
          description:
            "No se pudo contactar con el servidor, pero la sesión se cerró localmente.",
        });

        clearAuth();
        clearShops();
      },
    });
  };

  return {
    logout: handleLogout,
    isLoading: isPending,
  };
};

