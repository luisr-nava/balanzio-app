import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resendVerificationCodeAction } from "../actions/resend.verification.code.action";

export const useResendCode = () => {
  const mutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      return await resendVerificationCodeAction(email);
    },
    onSuccess: (data) => {
      // Toast de éxito
      toast.success("Código enviado", {
        description:
          "Te hemos enviado un nuevo código de verificación. Revisa tu email.",
        duration: 5000,
      });
    },
    onError: (error: unknown) => {
      let errorTitle = "Error al enviar código";
      let errorMessage =
        "No se pudo enviar el código. Por favor intenta de nuevo.";

      toast.error(errorTitle, {
        description: errorMessage,
        duration: 5000,
      });
    },
  });

  return {
    resendCode: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data,
    reset: mutation.reset,
  };
};

