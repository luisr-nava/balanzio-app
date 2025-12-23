import { authApi } from "@/lib/authApi";
import { AxiosError } from "axios";
import { toApiError } from "@/lib/error-handler";
import type { ApiError } from "@/lib/error-handler";

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
    if (error instanceof AxiosError) {
      throw toApiError(error);
    }

    const fallbackError: ApiError = Object.assign(
      new Error("No se pudo verificar el código"),
      { statusCode: 500 },
    );

    throw error instanceof Error ? error : fallbackError;
  }
};

