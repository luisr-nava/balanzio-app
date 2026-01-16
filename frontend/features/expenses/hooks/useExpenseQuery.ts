import { useQuery } from "@tanstack/react-query";
import { getExpensesAction } from "../actions";
import { useShopStore } from "@/features/shop/shop.store";
import { ExpenseQueryParams } from "../types";

export const useExpenseQuery = (params?: ExpenseQueryParams) => {
  const { activeShopId } = useShopStore();

  const query = useQuery({
    queryKey: ["expenses", activeShopId, JSON.stringify(params)],
    queryFn: () =>
      getExpensesAction(activeShopId!, {
        ...params,
      }),
    enabled: !!activeShopId,
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

  const expenses = query.data?.expenses || [];
  const pagination = query.data?.pagination;

  return {
    expenses,
    pagination,
    expensesLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};
