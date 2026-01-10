import { useShopStore } from "@/features/shop/shop.store";
import { useQuery } from "@tanstack/react-query";
import { getAllPurchaseAction } from "../actions";

interface UsePurchaseQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export const usePurchaseQuery = (params: UsePurchaseQueryParams) => {
  const { activeShopId } = useShopStore();
  const query = useQuery({
    queryKey: [
      "purchases",
      activeShopId,
      params.page,
      params.limit,
      params.search ?? "",
    ],
    queryFn: () =>
      getAllPurchaseAction(activeShopId!, {
        ...params,
      }),
    enabled: Boolean(activeShopId),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

  const purchase = query.data?.purchases || [];
  const pagination = query.data?.pagination;

  return {
    purchase,
    pagination,
    purchaseLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};
