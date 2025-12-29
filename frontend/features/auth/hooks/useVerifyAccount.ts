import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { verifyCodeAction } from "../actions/verify.code.action";

export const useVerifyAccount = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (code: string) => {
      return await verifyCodeAction(code);
    },
    onSuccess: () => {
      // Toast de éxito
      toast.success("¡Cuenta verificada!", {
        description:
          "Tu cuenta ha sido verificada correctamente. Ahora puedes iniciar sesión.",
        duration: 5000,
      });

      // Redirigir al login
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    },
    onError: (error: unknown) => {
      let errorTitle = "Error en la verificación";
      let errorMessage =
        "No se pudo verificar tu cuenta. Por favor intenta de nuevo.";

      toast.error(errorTitle, {
        description: errorMessage,
        duration: 5000,
      });
    },
  });

  return {
    verifyAccount: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data,
    reset: mutation.reset,
  };
};

