import { kioscoApi } from "@/lib/kioscoApi";
import { CreateShopDto, Shop } from "../types";

export const createShopAction = async (data: CreateShopDto): Promise<Shop> => {
  const { data: shopData } = await kioscoApi.post<Shop>("/shops", data);
  
  return shopData;
};

