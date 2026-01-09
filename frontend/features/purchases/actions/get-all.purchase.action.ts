import { kioscoApi } from "@/lib/kioscoApi";
import {
  GetAllPurchaseResponse,
  Purchase,
  PurchaseQueryParams,
} from "../types";
import { Pagination } from "@/src/types";

export const getAllPurchaseAction = async (
  shopId: string,
  params: PurchaseQueryParams
): Promise<{
  purchases: Purchase[];
  pagination: Pagination;
}> => {
  const { data } = await kioscoApi.get<GetAllPurchaseResponse>("/purchase", {
    params: {
      shopId,
      search: params.search,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    },
  });

  return {
    purchases: data.data,
    pagination: data.pagination,
  };
};
