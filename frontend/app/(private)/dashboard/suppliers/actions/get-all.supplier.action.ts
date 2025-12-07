import { kioscoApi } from "@/lib/kioscoApi";
import type { Supplier } from "@/lib/types/supplier";

export const getSuppliersAction = async (shopId: string): Promise<Supplier[]> => {
  const { data } = await kioscoApi.get("/supplier", {
    params: { shopId },
  });
  return (data as any)?.data ?? data;
};
