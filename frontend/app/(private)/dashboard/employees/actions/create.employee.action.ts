import { kioscoApi } from "@/lib/kioscoApi";
import { CreateEmployeeDto, Employee } from "../interfaces";

export const createEmployeeAction = async (
  payload: CreateEmployeeDto,
): Promise<Employee> => {
  const { data } = await kioscoApi.post("/employee", payload);
  return (data as any)?.data ?? data;
};
