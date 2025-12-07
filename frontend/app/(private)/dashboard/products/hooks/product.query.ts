import { useShopStore } from "@/app/(private)/store/shops.slice";
import { useInfiniteQuery } from "@tanstack/react-query";
import { GetAllProductAction } from "../actions/get-all.product.action";

interface UseProductQueryParams {
  search: string;
  limit?: number;
}

export const useProductQuery = ({ search, limit = 10 }: UseProductQueryParams) => {
  const { activeShopId } = useShopStore();

  const query = useInfiniteQuery({
    queryKey: ["products", activeShopId, search, limit],
    queryFn: ({ pageParam = 1 }) =>
      GetAllProductAction(activeShopId || "", {
        search,
        page: Number(pageParam) || 1,
        limit,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.pagination.page + 1;
      return nextPage <= lastPage.pagination.totalPages ? nextPage : undefined;
    },
    enabled: Boolean(activeShopId),
  });

  const products = query.data?.pages.flatMap((page) => page.products) || [];
  const pagination = query.data?.pages.at(-1)?.pagination;

  return {
    products,
    pagination,
    productsLoading: query.isLoading,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
    refetch: query.refetch,
  };
};
