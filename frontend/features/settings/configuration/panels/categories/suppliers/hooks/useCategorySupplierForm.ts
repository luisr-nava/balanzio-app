import React, { useEffect } from "react";
import { CategorySupplier, CreateCategorySupplierDto } from "../types";
import {
  useCategorySupplierCreateMutation,
  useCategorySupplierUpdateMutation,
} from "./useCategorySuppliersMutations";
import { useShopStore } from "@/features/shop/shop.store";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
const initialForm: CreateCategorySupplierDto = {
  name: "",
  shopIds: [],
};
function mapCategorySupplierForm(
  category: CategorySupplier,
  initialForm: CreateCategorySupplierDto
) {
  return {
    ...initialForm,
    name: category.name,
  };
}

export const useCategorySupplierForm = (
  editCategory?: CategorySupplier,
  onEditDone?: () => void
) => {
  const { activeShopId } = useShopStore();

  const createMutation = useCategorySupplierCreateMutation();
  const updateMutation = useCategorySupplierUpdateMutation();

  const form = useForm<CreateCategorySupplierDto>({
    defaultValues: initialForm,
  });
  const onSubmit = async (values: CreateCategorySupplierDto) => {
    if (!activeShopId) {
      toast.error("No hay tienda activa");
      return;
    }
    const basePayload: CreateCategorySupplierDto = {
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
      form.reset(mapCategorySupplierForm(editCategory, initialForm));
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
