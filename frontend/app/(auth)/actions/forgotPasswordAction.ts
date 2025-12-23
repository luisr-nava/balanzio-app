import { authApi } from "@/lib/authApi";
import { AxiosError } from "axios";
import { toApiError } from "@/lib/error-handler";
import type { ApiError } from "@/lib/error-handler";

interface ForgotPasswordResponse {
  message: string;
}

export const forgotPasswordAction = async (
  email: string,
): Promise<ForgotPasswordResponse> => {
  const project = process.env.NEXT_PUBLIC_PROJECT;
  try {
    const { data } = await authApi.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      { email, appKey: project },
    );
    return data;
  } catch (error) {
    console.error("Error en forgotPasswordAction:", error);

    if (error instanceof AxiosError) {
      throw toApiError(error);
    }

    const fallbackError: ApiError = Object.assign(
      new Error("No se pudo enviar el email de recuperación."),
      { statusCode: 500 },
    );

    throw error instanceof Error ? error : fallbackError;
  }
};


