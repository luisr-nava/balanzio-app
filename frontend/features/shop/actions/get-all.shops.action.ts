import { kioscoApi } from "@/lib/kioscoApi";
import { Shop } from "../types";

export const getAllShops = async (): Promise<Shop[]> => {
  const { data } = await kioscoApi.get<Shop[] | { data: Shop[] }>(
    `/shop/my-shops`,
  );
  return Array.isArray(data) ? data : data.data;
};

