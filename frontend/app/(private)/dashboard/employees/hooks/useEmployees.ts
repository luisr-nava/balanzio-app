import { useQuery } from "@tanstack/react-query";
import { useShopStore } from "@/app/(private)/store/shops.slice";
import { getEmployeesAction } from "../actions/get-all.employee.action";
import { Employee } from "../interfaces";

export const useEmployees = (enabled: boolean = true) => {
  const { activeShopId } = useShopStore();

  const query = useQuery({
    queryKey: ["employees", activeShopId],
    queryFn: () => getEmployeesAction(activeShopId || ""),
    enabled: enabled && Boolean(activeShopId),
  });

  return {
    employees: (query.data as Employee[]) || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};
