import { toast } from "sonner";
import { useShopStore } from "@/app/(private)/store/shops.slice";
import { useNotificationsStore } from "@/app/(private)/store/notifications.slice";
import { useAuthStore } from "../auth.slice";
import { useLogoutMutation } from "./useAuthMutations";

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearShops = useShopStore((state) => state.clearShops);
  const setNotifications = useNotificationsStore(
    (state) => state.setNotifications,
  );

  const { mutate, isPending } = useLogoutMutation();

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        clearAuth();
        clearShops();
        setNotifications([]);

        toast.success("Sesión cerrada", {
          description: "Has cerrado sesión correctamente",
        });
      },
      onError: (error: unknown) => {
        toast.warning("Sesión cerrada localmente", {
          description:
            "No se pudo contactar con el servidor, pero la sesión se cerró localmente.",
        });

        clearAuth();
        clearShops();
        setNotifications([]);
      },
    });
  };

  return {
    logout: handleLogout,
    isLoading: isPending,
  };
};

