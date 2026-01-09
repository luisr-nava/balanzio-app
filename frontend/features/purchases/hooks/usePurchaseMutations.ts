import { useShopStore } from "@/features/shop/shop.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreatePurchaseDto, DeletePurchaseResponse } from "../types";
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchases", activeShopId],
      });
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchases", activeShopId],
      });
    },
  });
};

export const usePurchaseDeleteMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deletePurchaseAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchases", activeShopId],
      });
    },
  });
};
