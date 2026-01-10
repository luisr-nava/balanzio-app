import { useQuery } from "@tanstack/react-query";
import { getSuppliersAction } from "../actions";
import { useShopStore } from "@/features/shop/shop.store";

interface UseSupplierQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}
export const useSupplierQuery = (params: UseSupplierQueryParams) => {
  const { activeShopId } = useShopStore();
  const query = useQuery({
    queryKey: [
      "suppliers",
      activeShopId,
      params.page,
      params.limit,
      params.search ?? "",
    ],
    queryFn: () =>
      getSuppliersAction(activeShopId!, {
        ...params,
      }),
    enabled: Boolean(activeShopId),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

  const suppliers = query.data?.suppliers || [];
  const pagination = query.data?.pagination;

  return {
    suppliers,
    pagination,
    supplierLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};
