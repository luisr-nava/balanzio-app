import type { InfiniteData } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPaymentMethodAction,
  deletePaymentMethodAction,
  updatePaymentMethodAction,
} from "../actions";
import { useShopStore } from "@/features/shop/shop.store";
import { CreatePaymentMethodDto, PaymentMethod } from "../types";

type PaymentMethodsPage = {
  paymentMethods: PaymentMethod[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

const updatePaymentMethodsCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  activeShopId: string | null,
  updater: (page: PaymentMethodsPage, pageIndex: number) => PaymentMethodsPage
) => {
  if (!activeShopId) return;

  queryClient.setQueriesData<InfiniteData<PaymentMethodsPage>>(
    { queryKey: ["payment-methods", activeShopId] },
    (old) => {
      if (!old) return old;

      const pages = old.pages.map((page, index) => updater(page, index));
      return { ...old, pages };
    }
  );
};

export const usePaymentMethodCreateMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();
  return useMutation({
    mutationFn: (payload: CreatePaymentMethodDto) =>
      createPaymentMethodAction(payload),
    onSuccess: (created) => {
      updatePaymentMethodsCache(queryClient, activeShopId, (page, pageIndex) => {
        if (pageIndex !== 0) return page;
        if (page.paymentMethods.some((item) => item.id === created.id)) {
          return page;
        }

        const total = page.pagination?.total
          ? page.pagination.total + 1
          : page.paymentMethods.length + 1;
        const limit = page.pagination?.limit ?? page.paymentMethods.length + 1;
        const totalPages = Math.max(1, Math.ceil(total / limit));

        return {
          ...page,
          paymentMethods: [created, ...page.paymentMethods],
          pagination: {
            ...page.pagination,
            total,
            totalPages,
          },
        };
      });
    },
  });
};
export const usePaymentMethodUpdateMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreatePaymentMethodDto>;
    }) => updatePaymentMethodAction(id, payload),
    onSuccess: (updated) => {
      updatePaymentMethodsCache(queryClient, activeShopId, (page) => ({
        ...page,
        paymentMethods: page.paymentMethods.map((item) =>
          item.id === updated.id ? updated : item
        ),
      }));
    },
  });
};
export const usePaymentMethodDeleteMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();
  return useMutation({
    mutationFn: (id: string) => deletePaymentMethodAction(id),
    onSuccess: (_, deletedId) => {
      updatePaymentMethodsCache(queryClient, activeShopId, (page) => {
        const remaining = page.paymentMethods.filter(
          (item) => item.id !== deletedId
        );
        const total = Math.max(
          0,
          (page.pagination?.total ?? page.paymentMethods.length) - 1
        );
        const limit = (page.pagination?.limit ?? remaining.length) || 1;
        const totalPages = Math.max(1, Math.ceil(total / limit));

        return {
          ...page,
          paymentMethods: remaining,
          pagination: {
            ...page.pagination,
            total,
            totalPages,
          },
        };
      });
    },
  });
};
