import { useProductQuery } from "./product.query";

export const useProducts = () => {
  const {
    products,
    productsLoading,
    pagination,
    page,
    limit,
    setPage,
    setLimit,
    search,
    setSearch,
  } = useProductQuery();

  return {
    products,
    productsLoading,
    pagination,
    page,
    limit,
    setPage,
    setLimit,
    search,
    setSearch,
  };
};
