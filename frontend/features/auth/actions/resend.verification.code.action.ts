import { authApi } from "@/lib/authApi";

interface ResendCodeResponse {
  message: string;
}

export const resendVerificationCodeAction = async (
  email: string,
): Promise<ResendCodeResponse> => {
  const project = process.env.NEXT_PUBLIC_PROJECT;
  try {
    const { data } = await authApi.post<ResendCodeResponse>(
      "/auth/resend-verification-code",

      { email, appKey: project },
    );
    return data;
  } catch (error) {
    throw error;
  }
};

