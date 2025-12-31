import { useProductQuery } from "./useProductQuery";

export const useProducts = (
  search: string,
  page: number,
  limit: number = 10,
  enabled: boolean = true,
) => {
  const { products, productsLoading, pagination, isFetching, refetch } =
    useProductQuery({ search, page, limit, enabled });

  return {
    products,
    productsLoading,
    pagination,
    isFetching,
    refetch,
  };
};

