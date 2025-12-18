import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useShopStore } from "@/app/(private)/store/shops.slice";
import { CreateCustomerDto } from "../interfaces";
import { createCustomerAction } from "../actions/create.customer.action";
import { updateCustomerAction } from "../actions/update.customer.action";
import { getErrorMessage } from "@/lib/error-handler";

export const useCustomerCreateMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();

  return useMutation({
    mutationFn: (payload: CreateCustomerDto) => createCustomerAction(payload),
    onSuccess: () => {
      toast.success("Cliente creado");
      queryClient.invalidateQueries({ queryKey: ["customers", activeShopId] });
    },
    onError: (error: unknown) => {
      const { message } = getErrorMessage(
        error,
        "No se pudo crear el cliente",
      );
      toast.error("Error", { description: message });
    },
  });
};

export const useCustomerUpdateMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateCustomerDto>;
    }) => updateCustomerAction(id, payload),
    onSuccess: () => {
      toast.success("Cliente actualizado");
      queryClient.invalidateQueries({ queryKey: ["customers", activeShopId] });
    },
    onError: (error: unknown) => {
      const { message } = getErrorMessage(
        error,
        "No se pudo actualizar el cliente",
      );
      toast.error("Error", { description: message });
    },
  });
};
