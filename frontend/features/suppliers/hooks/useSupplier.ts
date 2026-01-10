import { useSupplierQuery } from "./useSupplierQuery";
interface UseSuppliersParams {
  search?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}
export const useSupplier = ({ ...params }: UseSuppliersParams) => {
  const { suppliers, pagination, supplierLoading, isFetching, refetch } =
    useSupplierQuery(params);

  return {
    suppliers,
    pagination,
    supplierLoading,
    isFetching,
    refetch,
  };
};
