import { useShopStore } from "@/app/(private)/store/shops.slice";
import { usePaginationParams } from "@/app/(private)/hooks/useQueryParams";
import { useQuery } from "@tanstack/react-query";
import { GetAllProductAction } from "../actions/get-all.product.action";

export const useProductQuery = () => {
  const { activeShopId, activeShopLoading } = useShopStore();
  const {
    page,
    limit,
    search,
    debouncedSearch,
    setSearch,
    setPage,
    setLimit,
  } = usePaginationParams(300);
  const { data, isLoading: productsLoading } = useQuery({
    queryKey: ["products", activeShopId, debouncedSearch, page, limit],
    queryFn: () =>
      GetAllProductAction(activeShopId || "", {
        search: debouncedSearch,
        page,
        limit,
      }),
    enabled: Boolean(activeShopId),
  });

  return {
    products: data?.products || [],
    pagination: data?.pagination,
    productsLoading,
    page,
    limit,
    setPage,
    setLimit,
    search,
    setSearch,
    debouncedSearch,
  };
};
