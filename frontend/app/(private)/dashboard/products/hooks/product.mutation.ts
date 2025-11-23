import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useShopStore } from "@/app/(private)/store/shops.slice";
import { CreateProductDto } from "../interfaces";
import { createProductAction } from "../actions/create.product.action";
import { updateProductAction } from "../actions/update.product.action";

export const usePoductCreateMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();

  return useMutation({
    mutationFn: (payload: CreateProductDto) => createProductAction(payload),
    onSuccess: () => {
      toast.success("Producto creado");
      queryClient.invalidateQueries({ queryKey: ["products", activeShopId] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "No se pudo crear el producto";
      toast.error("Error", { description: message });
    },
  });
};

export const useProductUpdateMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateProductDto }) =>
      updateProductAction(id, payload),
    onSuccess: () => {
      toast.success("Producto actualizado");
      queryClient.invalidateQueries({ queryKey: ["products", activeShopId] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "No se pudo actualizar el producto";
      toast.error("Error", { description: message });
    },
  });
};

