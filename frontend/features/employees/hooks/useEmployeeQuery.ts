import { useQuery } from "@tanstack/react-query";
import { getEmployeesAction } from "../actions";
import { useShopStore } from "@/features/shop/shop.store";
import { EmployeeQueryParams } from "../types";

export const useEmployeeQuery = (params?: EmployeeQueryParams) => {
  const { activeShopId } = useShopStore();

  const query = useQuery({
    queryKey: ["employees", activeShopId, JSON.stringify(params)],
    queryFn: () =>
      getEmployeesAction(activeShopId!, {
        ...params,
      }),
    enabled: !!activeShopId,
    staleTime: 5000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const employees = query.data?.employees || [];
  const pagination = query.data?.pagination;

  return {
    employees,
    pagination,
    employeesLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};
