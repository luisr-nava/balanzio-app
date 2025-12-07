import { kioscoApi } from "@/lib/kioscoApi";
import { CategoryProduct, CategorySupplier } from "../interfaces";

export interface CategoryPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const GetAllCategoryProductAction = async (params?: {
  page?: number;
  limit?: number;
}): Promise<{
  categoryProducts: CategoryProduct[];
  pagination: CategoryPagination;
}> => {
  const { data } = await kioscoApi.get<{
    data: CategoryProduct[];
    pagination: CategoryPagination;
  }>(`/category`, {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
    },
  });

  return {
    categoryProducts: data.data,
    pagination: data.pagination,
  };
};

export const GetAllCategorySupplierAction = async (params?: {
  page?: number;
  limit?: number;
}): Promise<{
  categorySuppliers: CategorySupplier[];
  pagination: CategoryPagination;
}> => {
  const { data } = await kioscoApi.get<{
    data: CategorySupplier[];
    pagination: CategoryPagination;
  }>(`/supplier-category`, {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
    },
  });

  return {
    categorySuppliers: data.data,
    pagination: data.pagination,
  };
};
