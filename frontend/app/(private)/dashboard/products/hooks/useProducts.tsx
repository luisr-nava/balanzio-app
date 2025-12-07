import { useProductQuery } from "./product.query";

export const useProducts = (search: string, limit: number = 10) => {
  const {
    products,
    productsLoading,
    pagination,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useProductQuery({ search, limit });

  return {
    products,
    productsLoading,
    pagination,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
};
