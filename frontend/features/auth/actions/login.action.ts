import { authApi } from "@/lib/authApi";
import { LoginResponse } from "../types";

export const loginActions = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const project = process.env.NEXT_PUBLIC_PROJECT;
  try {
    const { data } = await authApi.post<LoginResponse>("/auth/login", {
      email,
      password,
      appKey: project,
    });

    if (!data?.token || !data?.user) {
      throw new Error("Respuesta de login inválida: faltan datos de sesión.");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

