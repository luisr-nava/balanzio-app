import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPaymentMethodAction,
  deletePaymentMethodAction,
  updatePaymentMethodAction,
} from "../actions";
import { useShopStore } from "@/features/shop/shop.store";
import { CreatePaymentMethodDto } from "../types";

export const usePaymentMethodCreateMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();
  return useMutation({
    mutationFn: (payload: CreatePaymentMethodDto) =>
      createPaymentMethodAction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payment-methods", activeShopId],
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payment-methods", activeShopId],
      });
    },
  });
};
export const usePaymentMethodDeleteMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();
  return useMutation({
    mutationFn: (id: string) => deletePaymentMethodAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payment-methods", activeShopId],
      });
    },
  });
};
