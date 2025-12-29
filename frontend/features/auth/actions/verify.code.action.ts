import { authApi } from "@/lib/authApi";

interface VerifyCodeResponse {
  message: string;
}

export const verifyCodeAction = async (
  code: string,
): Promise<VerifyCodeResponse> => {
  const project = process.env.NEXT_PUBLIC_PROJECT;
  try {
    const { data } = await authApi.post<VerifyCodeResponse>(
      "/auth/verify-code",
      { code, appKey: project },
    );
    return data;
  } catch (error) {
    throw error;
  }
};

