import { kioscoApi } from "@/lib/kioscoApi";
import { CreatePurchaseDto, CreatePurchaseResponse, Purchase } from "../types";

export const updatePurchaseAction = async (
  id: string,
  payload: Partial<CreatePurchaseDto>
): Promise<Purchase> => {
  const { data } = await kioscoApi.patch<CreatePurchaseResponse>(
    `/purchase/${id}`,
    payload
  );

  return data.data.purchase;
};
