import { Pagination } from "@/src/types";
import { kioscoApi } from "@/lib/kioscoApi";
import { CategorySupplier, CreateCategorySupplierResponse } from "../types";
type GetCategorySupplierParams = {
  search?: string;
  limit?: number;
  page?: number;
};

export const getAllCategorySupplierAction = async (
  params: GetCategorySupplierParams
): Promise<{
  categorySuppliers: CategorySupplier[];
  pagination: Pagination;
}> => {
  const { data } = await kioscoApi.get<CreateCategorySupplierResponse>(
    `/supplier-category`,
    {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
      },
    }
  );

  return {
    categorySuppliers: data.data,
    pagination: data.meta,
  };
};
