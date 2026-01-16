import { kioscoApi } from "@/lib/kioscoApi";
import { Pagination } from "@/src/types";
import { GetIncomesResponse, Income } from "../types";

export const getIncomesAction = async (
  shopId: string,
  params: {
    search?: string;
    limit?: number;
    page?: number;
    paymentMethodId?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
  }
): Promise<{ incomes: Income[]; pagination: Pagination }> => {
  const { data } = await kioscoApi.get<GetIncomesResponse>("/income", {
    params: {
      shopId,
      search: params.search,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      paymentMethodId: params.paymentMethodId,
      categoryId: params.categoryId,
      startDate: params.startDate,
      endDate: params.endDate,
    },
  });

  return {
    incomes: data.data,
    pagination: data.meta,
  };
};
