import { IncomeQueryParams } from "../types";
import { useIncomeQuery } from "./useIncomeQuery";

export const useIncomes = ({ ...params }: IncomeQueryParams) => {
  const { incomes, pagination, incomesLoading, isFetching, refetch } =
    useIncomeQuery(params);

  return { incomes, pagination, incomesLoading, isFetching, refetch };
};
