import { ExpenseQueryParams } from "../types";
import { useExpenseQuery } from "./useExpenseQuery";

export const useExpenses = ({ ...params }: ExpenseQueryParams) => {
  const { expenses, pagination, expensesLoading, isFetching, refetch } =
    useExpenseQuery(params);

  return {
    expenses,
    pagination,
    expensesLoading,
    isFetching,
    refetch,
  };
};
