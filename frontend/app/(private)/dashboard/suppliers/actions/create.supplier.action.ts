import { kioscoApi } from "@/lib/kioscoApi";
import type { CreateSupplierDto, Supplier } from "@/lib/types/supplier";

export const createSupplierAction = async (
  payload: CreateSupplierDto,
): Promise<Supplier> => {
  const { data } = await kioscoApi.post("/supplier", payload);
  return (data as any)?.data ?? data;
};
