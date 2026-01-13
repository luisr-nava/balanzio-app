import { Pagination } from "@/src/types";
import { kioscoApi } from "@/lib/kioscoApi";
import { CategoryProduct, CreateCategoryProductResponse } from "../types";
type GetCategoryProductParams = {
  search?: string;
  limit?: number;
  page?: number;
};

export const getAllCategoryProductAction = async (
  params: GetCategoryProductParams
): Promise<{
  categoryProducts: CategoryProduct[];
  pagination: Pagination;
}> => {
  const { data } = await kioscoApi.get<CreateCategoryProductResponse>(
    `/product-category`,
    {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
      },
    }
  );

  return {
    categoryProducts: data.data,
    pagination: data.meta,
  };
};
