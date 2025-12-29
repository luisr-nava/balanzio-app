import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { forgotPasswordAction } from "../actions/forgot.password.action";

export const useForgotPassword = () => {
  const mutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      return await forgotPasswordAction(email);
    },
    onSuccess: (data) => {
      console.log("Solicitud de recuperación exitosa:", data);

      toast.success("Email enviado", {
        description:
          "Te hemos enviado un email con instrucciones para restablecer tu contraseña. Revisa tu bandeja de entrada.",
        duration: 6000,
      });
    },
    onError: (error: unknown) => {
      console.error("Error en forgot password:", error);

      let errorTitle = "Error al enviar email";
      let errorMessage =
        "No se pudo enviar el email de recuperación. Por favor intenta de nuevo.";

      toast.error(errorTitle, {
        description: errorMessage,
        duration: 5000,
      });
    },
  });

  return {
    sendResetEmail: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data,
    reset: mutation.reset,
  };
};

