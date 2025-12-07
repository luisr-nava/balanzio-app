import { kioscoApi } from "@/lib/kioscoApi";
import { CreateEmployeeDto, Employee } from "../interfaces";

export const updateEmployeeAction = async (
  id: string,
  payload: Partial<CreateEmployeeDto>,
): Promise<Employee> => {
  const { data } = await kioscoApi.patch(`/employee/${id}`, payload);
  return (data as any)?.data ?? data;
};
