import { kioscoApi } from "@/lib/kioscoApi";
import { GetSuppliersResponse, Supplier } from "../types";
import { Pagination } from "@/src/types";

type GetSuppliersParams = {
  search?: string;
  limit?: number;
  page?: number;
};
export const getSuppliersAction = async (
  shopId: string,
  params: GetSuppliersParams
): Promise<{ suppliers: Supplier[]; pagination: Pagination }> => {
  const { data } = await kioscoApi.get<GetSuppliersResponse>("/supplier", {
    params: {
      shopId,
      search: params.search,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    },
  });

  return {
    suppliers: data.suppliers,
    pagination: data.pagination,
  };
};
