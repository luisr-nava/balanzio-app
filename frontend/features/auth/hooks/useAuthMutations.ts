import { useMutation, useQueryClient } from "@tanstack/react-query";
import { forgotPasswordAction } from "../actions/forgot.password.action";
import { loginActions } from "../actions/login.action";
import { logoutActions } from "../actions/logout.action";
import { myShopsQueryKey } from "@/app/(private)/hooks/useMyShops";
import { RegisterFormData } from "../types";
import { registerAction } from "../actions/register.action";
import { resendVerificationCodeAction } from "../actions/resend.verification.code.action";
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      return forgotPasswordAction(email);
    },
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return await loginActions(email, password);
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => logoutActions(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: myShopsQueryKey, exact: true });
    },
    onError: () => {
      queryClient.removeQueries({ queryKey: myShopsQueryKey, exact: true });
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async ({ fullName, email, password }: RegisterFormData) => {
      return await registerAction({ fullName, email, password });
    },
  });
};

export const useResendCodeMutation = () => {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      return await resendVerificationCodeAction(email);
    },
  });
};

