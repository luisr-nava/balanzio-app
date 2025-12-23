import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { AuthState } from "../types/auth.entity";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      appKey: "",
      plan: "",
      isLoading: true,
      subscriptionStatus: "",
      // Guardar datos de autenticación
      setAuth: (data) => {
        // Guardar en cookies
        Cookies.set("token", data.token, { expires: 7 }); // 7 días

        Cookies.set("appKey", data.appKey, { expires: 7 });

        // Actualizar estado
        set({
          user: data.user,
          token: data.token,
          appKey: data.appKey,
          plan: data.plan,
          subscriptionStatus: data.subscriptionStatus,
          isLoading: false,
        });
      },

      // Actualizar solo el usuario
      setUser: (user) => {
        set({ user });
      },

      // Limpiar autenticación (logout)
      clearAuth: () => {
        // Limpiar cookies
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        Cookies.remove("projectId");

        // Resetear estado
        set({
          user: null,
          token: null,
          appKey: "",
          plan: "",
          subscriptionStatus: "",
          isLoading: false,
        });
      },

      // Verificar si hay autenticación válida
      checkAuth: () => {
        const token = Cookies.get("token");
        const appKey = Cookies.get("appKey");

        if (token && appKey) {
          set({
            token,
            appKey,
            isLoading: false,
          });
        } else {
          get().clearAuth();
        }
      },

      // Hidratar estado desde cookies (al cargar la app)
      hydrate: () => {
        const token = Cookies.get("token");
        const appKey = Cookies.get("appKey");
        const plan = Cookies.get("plan");
        const subscriptionStatus = Cookies.get("subscriptionStatus");

        if (token && appKey) {
          set({
            token,
            appKey: appKey || "",
            plan: plan || "",
            subscriptionStatus: subscriptionStatus || "",
            isLoading: false,
          });
        } else {
          set({
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage", // nombre en localStorage
      storage: createJSONStorage(() => localStorage),
      // Solo persistir estos campos (no tokens por seguridad)
      partialize: (state) => ({
        user: state.user,
        appKey: state.appKey,
        plan: state.plan,
        subscriptionStatus: state.subscriptionStatus,
      }),
    },
  ),
);

