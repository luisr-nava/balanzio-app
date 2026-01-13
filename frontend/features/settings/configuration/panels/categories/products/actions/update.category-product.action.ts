import { kioscoApi } from "@/lib/kioscoApi";
import {
  CategoryProduct,
  CreateCategoryProductDto,
  CreateCategoryProductResponse,
} from "../types";

export const updateCategoryProductAction = async (
  id: string,
  payload: Partial<CreateCategoryProductDto>
): Promise<CategoryProduct[]> => {
  const { data } = await kioscoApi.patch<CreateCategoryProductResponse>(
    `/product-category/${id}`,
    payload
  );
  return data.data;
};
