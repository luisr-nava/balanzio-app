import { useCustomerQuery } from "./useCustomerQuery";

export const useCustomers = (
  search: string,
  page: number,
  limit: number = 10,
) => {
  const { customers, customersLoading, pagination, isFetching, refetch } =
    useCustomerQuery({ search, page, limit });

  return {
    customers,
    customersLoading,
    pagination,
    isFetching,
    refetch,
  };
};

