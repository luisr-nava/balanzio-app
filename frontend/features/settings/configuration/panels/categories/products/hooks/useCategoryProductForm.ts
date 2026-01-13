import React, { useEffect } from "react";
import { CategoryProduct, CreateCategoryProductDto } from "../types";
import {
  useCategoryProductCreateMutation,
  useCategoryProductUpdateMutation,
} from "./useCategoryProductsMutations";
import { useShopStore } from "@/features/shop/shop.store";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
const initialForm: CreateCategoryProductDto = {
  name: "",
  shopIds: [],
};
function mapCategoryProductForm(
  category: CategoryProduct,
  initialForm: CreateCategoryProductDto
) {
  return {
    ...initialForm,
    name: category.name,
  };
}

export const useCategoryProductForm = (
  editCategory?: CategoryProduct,
  onEditDone?: () => void
) => {
  const { activeShopId } = useShopStore();

  const createMutation = useCategoryProductCreateMutation();
  const updateMutation = useCategoryProductUpdateMutation();

  const form = useForm<CreateCategoryProductDto>({
    defaultValues: initialForm,
  });
  const onSubmit = async (values: CreateCategoryProductDto) => {
    if (!activeShopId) {
      toast.error("No hay tienda activa");
      return;
    }
    const basePayload: CreateCategoryProductDto = {
      ...values,
      shopIds: [activeShopId],
    };
    if (editCategory) {
      updateMutation.mutate(
        {
          id: editCategory.id,
          payload: basePayload,
        },
        {
          onSuccess: () => {
            toast.success("Categoria actualizada");
            form.reset({ ...initialForm });
            onEditDone?.();
          },
          onError: () => {
            toast.error("No se pudo actualizar la categoria");
          },
        }
      );
      return;
    } else {
      createMutation.mutate(basePayload, {
        onSuccess: () => {
          toast.success("Categoria creada");
          form.reset({ ...initialForm });
        },
        onError: () => {
          toast.error("No se pudo actualizar la categoria");
        },
      });
    }
  };
  const isLoading = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!editCategory) {
      form.reset(initialForm);
      return;
    }
    if (editCategory) {
      form.reset(mapCategoryProductForm(editCategory, initialForm));
    }
  }, [editCategory]);

  return {
    form,
    onSubmit,
    isLoading,
    initialForm,
    isEditing: Boolean(editCategory),
  };
};
