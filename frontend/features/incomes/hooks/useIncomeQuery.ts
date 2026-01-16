import { useQuery } from "@tanstack/react-query";
import { getIncomesAction } from "../actions";
import { useShopStore } from "@/features/shop/shop.store";
import { IncomeQueryParams } from "../types";

export const useIncomeQuery = (params?: IncomeQueryParams) => {
  const { activeShopId } = useShopStore();

  const query = useQuery({
    queryKey: ["incomes", activeShopId, JSON.stringify(params)],
    queryFn: () =>
      getIncomesAction(activeShopId!, {
        ...params,
      }),
    enabled: !!activeShopId,
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });
  const incomes = query.data?.incomes || [];
  const pagination = query.data?.pagination;

  return {
    incomes,
    pagination,
    incomesLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};
