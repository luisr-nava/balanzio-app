import { useMutation } from "@tanstack/react-query";
import { forgotPasswordAction } from "../actions/forgot.password.action";

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      return forgotPasswordAction(email);
    },
  });
};

