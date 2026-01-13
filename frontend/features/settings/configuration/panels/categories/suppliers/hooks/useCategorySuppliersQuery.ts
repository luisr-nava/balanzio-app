import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllCategorySupplierAction } from "../actions";

const DEFAULT_LIMIT = 10;

export const useCategorySuppliersQuery = () => {
  const query = useInfiniteQuery({
    queryKey: ["category-suppliers", DEFAULT_LIMIT],
    queryFn: ({ pageParam = 1 }) =>
      getAllCategorySupplierAction({
        page: Number(pageParam) || 1,
        limit: DEFAULT_LIMIT,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.pagination?.page ?? 1;
      const totalPages = lastPage?.pagination?.totalPages ?? 1;

      const nextPage = currentPage + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    retry: 1,
  });

  const categorySuppliers =
    query.data?.pages.flatMap((page) => page.categorySuppliers) || [];
  const pagination = query.data?.pages.at(-1)?.pagination;

  return {
    isLoadingCategory: query.isLoading,
    categorySuppliers,
    pagination,

    fetchNextSupplierCategories: query.fetchNextPage,
    hasMoreSupplierCategories: query.hasNextPage ?? false,
    isFetchingNextSupplierCategories: query.isFetchingNextPage,
  };
};
