import { kioscoApi } from "@/lib/kioscoApi";
import { CreatePurchaseDto, CreatePurchaseResponse, Purchase } from "../types";

export const createPurchaseAction = async (
  payload: Partial<CreatePurchaseDto>
): Promise<Purchase> => {
  const { data } = await kioscoApi.post<CreatePurchaseResponse>(
    "/purchase",
    payload
  );

  return data.data;
};
