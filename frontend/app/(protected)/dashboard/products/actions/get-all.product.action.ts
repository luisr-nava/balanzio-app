import { kioscoApi } from "@/lib/kioscoApi";
import { Product } from "../interfaces";
export interface GetAllProductResponse {
  message: string;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: Product[];
}
export const GetAllProductAction = async (
  shopId: string,
  params: { search?: string; page?: number; limit?: number },
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
