import { kioscoApi } from "@/lib/kioscoApi";
import {
  CategorySupplier,
  CreateCategorySupplierDto,
  CreateCategorySupplierResponse,
} from "../types";

export const createCategorySupplierAction = async (
  payload: Partial<CreateCategorySupplierDto>
): Promise<CategorySupplier[]> => {
  const { data } = await kioscoApi.post<CreateCategorySupplierResponse>(
    "/supplier-category",
    payload
  );

  return data.data;
};
