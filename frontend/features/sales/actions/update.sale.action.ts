import { kioscoApi } from "@/lib/kioscoApi";
import { CreateSaleDto } from "../types";

export const updateSaleAction = async (
  saleId: string,
  payload: CreateSaleDto
) => {
  console.log(payload);
  const { data } = await kioscoApi.patch(`/sale/${saleId}`, payload);
  
  console.log(data);
  return data;
};
