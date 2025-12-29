import { authApi } from "@/lib/authApi";
import { RegisterResponse } from "../types";

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
    });
    return data;
  } catch (error) {
    throw error;
  }
};

