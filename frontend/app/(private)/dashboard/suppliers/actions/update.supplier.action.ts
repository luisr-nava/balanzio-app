import { kioscoApi } from "@/lib/kioscoApi";
import type { CreateSupplierDto, Supplier } from "@/lib/types/supplier";

export const updateSupplierAction = async (
  id: string,
  payload: Partial<CreateSupplierDto>,
): Promise<Supplier> => {
  const { data } = await kioscoApi.patch(`/supplier/${id}`, payload);
  return (data as any)?.data ?? data;
};
