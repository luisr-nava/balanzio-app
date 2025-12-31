import { useShallow } from "zustand/react/shallow";
import {
  usePoductCreateMutation,
  useProductUpdateMutation,
} from "./useProductMutation";
import { CreateProductDto, Product } from "../types";
import { useForm } from "react-hook-form";
import { useShopStore } from "@/features/shop/shop.store";
import { useModal } from "@/features/modal/hooks/useModal";

const initialForm: CreateProductDto = {
  name: "",
  description: "",
  barcode: "",
  shopId: "",
  costPrice: 0,
  salePrice: 0,
  stock: 1,
  supplierId: "",
  isActive: true,
  measurementUnitId: "",
};

export const useProductForm = (editProduct?: Product, onClose?: () => void) => {
  const { activeShopId } = useShopStore();

  const createMutation = usePoductCreateMutation();
  const updateMutation = useProductUpdateMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm<CreateProductDto>({
    defaultValues: initialForm,
  });

  const onSubmit = handleSubmit((values) => {
    const { isActive, ...restValues } = values;

    const basePayload: CreateProductDto = {
      ...restValues,
      shopId: activeShopId!,
      supplierId: restValues.supplierId || undefined,
    };

    if (editProduct) {
      updateMutation.mutate({
        id: editProduct.id,
        payload: { ...basePayload, isActive },
      });
    } else {
      createMutation.mutate(basePayload);
    }

    onClose?.();
    updateMutation.reset();
  });

  return {
    activeShopId,
    createMutation,
    updateMutation,
    isLoadingCreate: createMutation.isPending,
    isLoadingUpdate: updateMutation.isPending,
    register,
    reset,
    onSubmit,
    initialForm,
    setValue,
    control,
    getValues,
    errors,
  };
};

