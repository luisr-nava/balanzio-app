import { usePurchaseQuery } from "./usePurchaseQuery";

interface UsePurchasesParams {
  search?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export const usePurchases = ({ ...params }: UsePurchasesParams) => {
  const { purchase, pagination, purchaseLoading, isFetching, refetch } =
    usePurchaseQuery(params);

  return {
    purchase,
    pagination,
    purchaseLoading,
    isFetching,
    refetch,
  };
};
