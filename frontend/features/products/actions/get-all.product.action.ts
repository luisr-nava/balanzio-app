import { kioscoApi } from "@/lib/kioscoApi";
import { GetAllProductResponse, Product } from "../types";
import { Pagination } from "@/src/types";

export const GetAllProductAction = async (
  shopId: string,
  params: Pagination,
): Promise<{
  products: Product[];
  pagination: GetAllProductResponse["pagination"];
}> => {
  const { data } = await kioscoApi.get<GetAllProductResponse>(`/product`, {
    params: {
      shopId: shopId || undefined,
      ...params,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    },
  });

  return {
    products: data.data,
    pagination: data.pagination,
  };
};

