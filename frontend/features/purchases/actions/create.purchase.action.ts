import { kioscoApi } from "@/lib/kioscoApi";
import { CreatePurchaseDto, CreatePurchaseResponse, Purchase } from "../types";

const resolvePurchase = (response: CreatePurchaseResponse): Purchase =>
  "purchase" in response.data ? response.data.purchase : response.data;

export const createPurchaseAction = async (
  payload: Partial<CreatePurchaseDto>
): Promise<Purchase> => {
  const { data } = await kioscoApi.post<CreatePurchaseResponse>(
    "/purchase",
    payload
  );

  return resolvePurchase(data);
};
