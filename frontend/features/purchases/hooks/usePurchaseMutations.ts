import { useShopStore } from "@/features/shop/shop.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreatePurchaseDto,
  DeletePurchaseResponse,
  PurchasesQueryData,
} from "../types";
import {
  createPurchaseAction,
  deletePurchaseAction,
  updatePurchaseAction,
} from "../actions";

export const usePurchaseCreateMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();
  return useMutation({
    mutationFn: (payload: CreatePurchaseDto) => createPurchaseAction(payload),
    onSuccess: (newPurchase) => {
      queryClient.setQueriesData<PurchasesQueryData>(
        {
          queryKey: ["purchases", activeShopId],
          exact: false,
        },
        (old) => {
          if (!old) return old;

          const nextTotal = old.pagination.total + 1;
          const nextTotalPages = Math.ceil(nextTotal / old.pagination.limit);

          return {
            ...old,
            purchases:
              old.pagination.page === 1
                ? [newPurchase, ...old.purchases]
                : old.purchases,
            pagination: {
              ...old.pagination,
              total: nextTotal,
              totalPages: nextTotalPages,
            },
          };
        }
      );
    },
  });
};
export const usePurchaseUpdateMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreatePurchaseDto>;
    }) => updatePurchaseAction(id, payload),
    onSuccess: (updatedPurchase) => {
      queryClient.setQueriesData<PurchasesQueryData>(
        {
          queryKey: ["purchases", activeShopId],
          exact: false,
        },
        (old) => {
          if (!old?.purchases) return old;

          return {
            ...old,
            purchases: old.purchases.map((p) =>
              p.id === updatedPurchase.id ? updatedPurchase : p
            ),
            pagination: old.pagination,
          };
        }
      );
    },
  });
};

export const usePurchaseDeleteMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();

  return useMutation({
    mutationFn: ({
      id,
      deletionReason,
    }: {
      id: string;
      deletionReason: string;
    }) => deletePurchaseAction(id, { deletionReason }),

    onSuccess: (_, variables) => {
      queryClient.setQueriesData<PurchasesQueryData>(
        {
          queryKey: ["purchases", activeShopId],
          exact: false,
        },
        (old) => {
          if (!old) return old;

          const nextTotal = Math.max(0, old.pagination.total - 1);
          const limit = old.pagination.limit;
          const nextTotalPages = Math.max(1, Math.ceil(nextTotal / limit));

          return {
            ...old,
            purchases: old.purchases.filter((p) => p.id !== variables.id),
            pagination: {
              ...old.pagination,
              total: nextTotal,
              totalPages: nextTotalPages,
            },
          };
        }
      );
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["purchases", activeShopId],
    //   });
    //   queryClient.invalidateQueries({
    //     queryKey: ["products", activeShopId],
    //     refetchType: "active",
    //   });
    // },
  });
};
