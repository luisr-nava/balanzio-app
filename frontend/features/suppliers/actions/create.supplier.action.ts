import { kioscoApi } from "@/lib/kioscoApi";
import { CreateSupplierDto, CreateSupplierResponse, Supplier } from "../types";

export const createSupplierAction = async (
  payload: CreateSupplierDto
): Promise<Supplier> => {
  const { data } = await kioscoApi.post<CreateSupplierResponse>(
    "/supplier",
    payload
  );
  return data.data;
};
