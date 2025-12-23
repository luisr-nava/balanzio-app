import { authApi } from "@/lib/authApi";
import { RegisterResponse } from "../interfaces";
import { AxiosError } from "axios";
import { toApiError } from "@/lib/error-handler";
import type { ApiError } from "@/lib/error-handler";

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  projectId: string;
}

export const registerAction = async (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  const project = process.env.NEXT_PUBLIC_PROJECT;
  try {
    const { data } = await authApi.post<RegisterResponse>("/auth/register", {
      ...payload,
      appKey: project,
    });
    return data;
  } catch (error) {
    console.error("Error en registerAction:", error);

    if (error instanceof AxiosError) {
      throw toApiError(error);
    }

    const fallbackError: ApiError = Object.assign(
      new Error("No se pudo completar el registro."),
      { statusCode: 500 },
    );

    throw error instanceof Error ? error : fallbackError;
  }
};

