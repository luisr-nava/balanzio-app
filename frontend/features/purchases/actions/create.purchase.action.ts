import { kioscoApi } from "@/lib/kioscoApi";
import { CreatePurchaseDto, Purchase } from "../types";

export const createPurchaseAction = async (
  payload: Partial<CreatePurchaseDto>
): Promise<Purchase> => {
  const { data } = await kioscoApi.post<Purchase>("/purchase", payload);

  return data;
};
