import { kioscoApi } from "@/lib/kioscoApi";
import { DeletePurchaseResponse } from "../types";

export const deletePurchaseAction = async (
  id: string,
  payload?: DeletePurchaseResponse
): Promise<string> => {
  const { data } = await kioscoApi.delete<string>(`/purchase/${id}`, {
    data: payload,
  });

  return data;
};
