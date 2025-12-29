import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resetPasswordAction } from "../actions/reset.password.action";

export const useResetPassword = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => {
      return await resetPasswordAction({ token, newPassword });
    },
    onSuccess: (data) => {
      // Toast de éxito
      toast.success("¡Contraseña restablecida!", {
        description:
          "Tu contraseña ha sido actualizada correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.",
        duration: 5000,
      });

      // Redirigir al login
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    },
    onError: (error: unknown) => {
      let errorTitle = "Error al restablecer contraseña";
      let errorMessage =
        "No se pudo restablecer la contraseña. Por favor intenta de nuevo.";

      toast.error(errorTitle, {
        description: errorMessage,
        duration: 5000,
      });
    },
  });

  return {
    resetPassword: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data,
    reset: mutation.reset,
  };
};

