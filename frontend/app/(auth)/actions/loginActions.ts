import { authApi } from "@/lib/authApi";
import { LoginResponse } from "../interfaces";
import { AxiosError } from "axios";
import { unwrapResponse } from "@/lib/api/utils";
import type { ApiError } from "@/lib/error-handler";
import { toApiError } from "@/lib/error-handler";

type LoginApiResponse = LoginResponse | { data: LoginResponse };

export const loginActions = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const project = process.env.NEXT_PUBLIC_PROJECT;
  try {
    const { data } = await authApi.post<LoginApiResponse>("/auth/login", {
      email,
      password,
      appKey: project,
    });
    const payload = unwrapResponse<LoginResponse>(data);

    if (!payload?.token || !payload?.user) {
      const invalidResponseError: ApiError = Object.assign(
        new Error("Respuesta de login inválida: faltan datos de sesión."),
        { statusCode: 500 },
      );
      throw invalidResponseError;
    }

    return payload as LoginResponse;
  } catch (error) {
    console.error("Error en loginActions:", error);

    if (error instanceof AxiosError) {
      throw toApiError(error);
    }

    throw error instanceof Error
      ? error
      : new Error("Error desconocido al iniciar sesión");
  }
};

