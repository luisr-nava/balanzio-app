import { kioscoApi } from "@/lib/kioscoApi";

export const deleteEmployeeAction = async (id: string): Promise<void> => {
  await kioscoApi.delete(`/employee/${id}`);
};
