"use client";

import { useQuery } from "@tanstack/react-query";
import { shopApi } from "@/lib/api/shop.api";
import type { Shop } from "@/lib/types/shop";
import { useAuth } from "@/app/(auth)/hooks";

const MY_SHOPS_QUERY_KEY = ["my-shops"] as const;

export const useMyShops = () => {
  const { isAuthenticated } = useAuth();

  return useQuery<Shop[]>({
    queryKey: MY_SHOPS_QUERY_KEY,
    queryFn: shopApi.getMyShops,
    enabled: isAuthenticated,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};

export const myShopsQueryKey = MY_SHOPS_QUERY_KEY;
