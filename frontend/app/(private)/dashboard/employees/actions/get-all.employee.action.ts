import { kioscoApi } from "@/lib/kioscoApi";
import { Employee } from "../interfaces";

export const getEmployeesAction = async (shopId: string): Promise<Employee[]> => {
  const { data } = await kioscoApi.get("/employee", {
    params: { shopId },
  });

  return (data as any)?.data ?? data;
};
