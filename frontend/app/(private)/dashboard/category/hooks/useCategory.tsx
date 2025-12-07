import {
  useCategoryProductsQuery,
  useCategorySuppliersQuery,
} from "./category.query";

export const useCategory = () => {
  const {
    categoryProducts,
    pagination,
    categoryProductsLoading,
    fetchNextProductCategories,
    hasMoreProductCategories,
    isFetchingNextProductCategories,
  } = useCategoryProductsQuery();

  const {
    categorySuppliers,
    categorySuppliersLoading,
    pagination: suppliersPagination,
    fetchNextSupplierCategories,
    hasMoreSupplierCategories,
    isFetchingNextSupplierCategories,
  } = useCategorySuppliersQuery();
  return {
    categoryProducts,
    pagination,
    categoryProductsLoading,
    categorySuppliers,
    categorySuppliersLoading,
    suppliersPagination,
    fetchNextProductCategories,
    hasMoreProductCategories,
    isFetchingNextProductCategories,
    fetchNextSupplierCategories,
    hasMoreSupplierCategories,
    isFetchingNextSupplierCategories,
  };
};
