import { authApi } from "@/lib/authApi";
import { AxiosError } from "axios";
import { toApiError } from "@/lib/error-handler";
import type { ApiError } from "@/lib/error-handler";

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
    console.error("Error en resetPasswordAction:", error);

    if (error instanceof AxiosError) {
      throw toApiError(error);
    }

    const fallbackError: ApiError = Object.assign(
      new Error("No se pudo restablecer la contraseña."),
      { statusCode: 500 },
    );

    throw error instanceof Error ? error : fallbackError;
  }
};


