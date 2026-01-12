import { kioscoApi } from "@/lib/kioscoApi";
import { Sale } from "../../sales-history/types";

export const getSaleByIdAction = async (saleId: string): Promise<Sale> => {
  const { data } = await kioscoApi.get<Sale>(`/sale/${saleId}`);
  return data;
};
