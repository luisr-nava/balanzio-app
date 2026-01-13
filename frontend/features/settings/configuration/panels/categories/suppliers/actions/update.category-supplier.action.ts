import { kioscoApi } from "@/lib/kioscoApi";
import {
  CategorySupplier,
  CreateCategorySupplierDto,
  CreateCategorySupplierResponse,
} from "../types";

export const updateCategorySupplierAction = async (
  id: string,
  payload: Partial<CreateCategorySupplierDto>
): Promise<CategorySupplier[]> => {
  const { data } = await kioscoApi.patch<CreateCategorySupplierResponse>(
    `/Supplier-category/${id}`,
    payload
  );
  return data.data;
};
