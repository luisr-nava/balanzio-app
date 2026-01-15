import { useProductQuery } from "@/features/products/hooks/useProductQuery";
import { ProductQueryParams } from "../types";

export const useProducts = ({ ...params }: ProductQueryParams) => {
  const { products, pagination, productsLoading, isFetching, refetch } =
    useProductQuery(params);

  return {
    products,
    pagination,
    productsLoading,
    isFetching,
    refetch,
  };
};
