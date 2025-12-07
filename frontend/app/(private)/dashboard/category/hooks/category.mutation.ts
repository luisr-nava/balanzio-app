import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useShopStore } from "@/app/(private)/store/shops.slice";
import {
  createCategoryProductAction,
  createCategorySuppliertAction,
} from "../actions/create.category.action";
import {
  updateCategoryProductAction,
  updateCategorySupplierAction,
} from "../actions/update.category.action";
import {
  CreateCategoryProductDto,
  CreateCategorySupplierDto,
} from "../interfaces";

export const useCategoryProductCreateMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();
  return useMutation({
    mutationFn: (payload: CreateCategoryProductDto) =>
      createCategoryProductAction(payload),
    onSuccess: () => {
      toast.success("Categoria de producto creada");
      queryClient.invalidateQueries({
        queryKey: ["category-products", activeShopId],
      });
      queryClient.invalidateQueries({ queryKey: ["category-products"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "No se pudo crear el producto";
      toast.error("Error", { description: message });
    },
  });
};

export const useCategorySupplierCreateMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();
  return useMutation({
    mutationFn: (payload: CreateCategorySupplierDto) =>
      createCategorySuppliertAction(payload),
    onSuccess: () => {
      toast.success("Categoria de proveedor creada");
      queryClient.invalidateQueries({
        queryKey: ["category-suppliers", activeShopId],
      });
      queryClient.invalidateQueries({ queryKey: ["category-suppliers"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "No se pudo crear el producto";
      toast.error("Error", { description: message });
    },
  });
};

export const useCategoryProductUpdateMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateCategoryProductDto>;
    }) => updateCategoryProductAction(id, payload),
    onSuccess: () => {
      toast.success("Categoria de producto actualizada");
      queryClient.invalidateQueries({
        queryKey: ["category-products", activeShopId],
      });
      queryClient.invalidateQueries({ queryKey: ["category-products"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "No se pudo actualizar la categoría";
      toast.error("Error", { description: message });
    },
  });
};

export const useCategorySupplierUpdateMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateCategorySupplierDto>;
    }) => updateCategorySupplierAction(id, payload),
    onSuccess: () => {
      toast.success("Categoria de proveedor actualizada");
      queryClient.invalidateQueries({
        queryKey: ["category-suppliers", activeShopId],
      });
      queryClient.invalidateQueries({ queryKey: ["category-suppliers"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "No se pudo actualizar la categoría";
      toast.error("Error", { description: message });
    },
  });
};
