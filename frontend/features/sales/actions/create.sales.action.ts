import { kioscoApi } from "@/lib/kioscoApi";
import { CreateSaleDto, CreateSaleResponse, Sale } from "../types";

export const CreateSale = async (
  payload: Partial<CreateSaleDto>
): Promise<Sale> => {
  const { data } = await kioscoApi.post<CreateSaleResponse>("/sale", payload);
  return data.data;
};

