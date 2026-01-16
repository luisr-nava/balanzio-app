import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RegisterFormData, RegisterResponse } from "../types";
import { useRegisterMutation } from "./useAuthMutations";

export const useRegister = () => {
  const router = useRouter();
  const { mutate, isPending } = useRegisterMutation();

  const onSubmit = (data: RegisterFormData) => {
    mutate(
      {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success("¡Cuenta creada exitosamente!", {
            description:
              "Te hemos enviado un código de verificación de 6 dígitos a tu email.",
            duration: 5000,
          });

          setTimeout(() => {
            router.push("/verify-account");
          }, 1500);
        },
        onError: (error: unknown) => {
          toast.error("Error al registrar");
        },
      }
    );
  };
  return {
    onSubmit,
    isLoading: isPending,
  };
};
