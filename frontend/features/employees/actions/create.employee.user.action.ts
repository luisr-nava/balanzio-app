import { CreateEmployeeDto, Employee, EmployeeAuth } from "../types";
import { authApi } from "@/lib/authApi";

export const createAuthUserAction = async (
  payload: CreateEmployeeDto,
): Promise<EmployeeAuth> => {
  const { data } = await authApi.post<EmployeeAuth>("/employee", payload);
  return data;
};

