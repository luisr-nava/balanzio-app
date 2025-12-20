import { useIncomeQuery } from "./useIncomeQuery";

export const useIncomes = (
  search: string,
  page: number,
  limit: number,
  enabled: boolean,
  startDate?: string,
  endDate?: string,
) => {
  const incomesQuery = useIncomeQuery(
    search,
    page,
    limit,
    enabled,
    startDate,
    endDate,
  );

  return {
    incomes: incomesQuery.data?.incomes || [],
    pagination: incomesQuery.data?.pagination,
    incomesLoading: incomesQuery.isLoading,
    isFetching: incomesQuery.isFetching,
  };
};
