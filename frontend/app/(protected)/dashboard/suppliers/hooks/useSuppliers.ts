import { useQuery } from "@tanstack/react-query";
import { useShopStore } from "@/app/(protected)/store/shops.slice";
import { getSuppliersAction } from "../actions/get-all.supplier.action";
import type { Supplier } from "@/lib/types/supplier";

export const useSuppliers = () => {
  const { activeShopId } = useShopStore();

  const query = useQuery({
    queryKey: ["suppliers", activeShopId],
    queryFn: () => getSuppliersAction(activeShopId || ""),
    enabled: Boolean(activeShopId),
  });

  return {
    suppliers: (query.data as Supplier[]) || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

