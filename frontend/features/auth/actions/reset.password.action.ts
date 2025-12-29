import { authApi } from "@/lib/authApi";

interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  message: string;
}

export const resetPasswordAction = async (
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResponse> => {
  const project = process.env.NEXT_PUBLIC_PROJECT;
  try {
    const { data } = await authApi.post<ResetPasswordResponse>(
      "/auth/reset-password",
      { ...payload, appKey: project },
    );
    return data;
  } catch (error) {
    throw error;
  }
};

