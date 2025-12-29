import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getAuthErrorMessage } from "@/lib/error-handler";
import { useAuthStore } from "../auth.slice";
import { LoginResponse } from "../types";
import { loginActions } from "../actions/login.action";

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return await loginActions(email, password);
    },
    onSuccess: (data: LoginResponse) => {
      // Guardar en Zustand store (también guarda en cookies)
      setAuth({
        user: data.user,
        token: data.token,
        ownerId: data.ownerId,
        plan: data.plan,
        subscriptionStatus: data.subscriptionStatus,
      });

      // Toast de éxito
      toast.success("¡Bienvenido!", {
        description: `Inicio de sesión exitoso. Hola, ${data.user.fullName}`,
      });

      // Redirigir al dashboard
      router.replace("/dashboard");
    },
    onError: () => {
      toast.error("Credenciales incorrectas", {
        description: "El email o la contraseña son incorrectos.",
        duration: 5000,
      });
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data,
    reset: mutation.reset,
  };
};

