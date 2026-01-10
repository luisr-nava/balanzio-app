import { kioscoApi } from "@/lib/kioscoApi";
import {
  CreatePurchaseDto,
  CreatePurchaseResponse,
  Purchase,
} from "../types";

const resolvePurchase = (response: CreatePurchaseResponse): Purchase =>
  "purchase" in response.data ? response.data.purchase : response.data;

export const updatePurchaseAction = async (
  id: string,
  payload: Partial<CreatePurchaseDto>
): Promise<Purchase> => {
  const { data } = await kioscoApi.patch<CreatePurchaseResponse>(
    `/purchase/${id}`,
    payload
  );

  return resolvePurchase(data);
};
