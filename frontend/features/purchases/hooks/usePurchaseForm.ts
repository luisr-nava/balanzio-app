import { useShopStore } from "@/features/shop/shop.store";
import { CreatePurchaseDto, Purchase } from "../types";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  usePurchaseCreateMutation,
  usePurchaseDeleteMutation,
  usePurchaseUpdateMutation,
} from "./usePurchaseMutations";

const initialForm: CreatePurchaseDto = {
  shopId: "",
  supplierId: null,
  notes: null,
  items: [],
};

function mapPurchaseToForm(
  purchase: Purchase,
  initialForm: CreatePurchaseDto
): CreatePurchaseDto {
  return {
    ...initialForm,
    shopId: purchase.shopId,
    supplierId: purchase.supplierId ?? initialForm.supplierId,
    notes: purchase.notes ?? initialForm.notes,
    items: purchase.items.map((item) => ({
      shopProductId: item.shopProductId,
      quantity: item.quantity,
      unitCost: item.unitCost,
      subtotal: item.subtotal,
      includesTax: item.includesTax,
    })),
  };
}

export const usePurchaseForm = (
  cashRegisterId: string,
  editPurchase?: Purchase,
  deletePurchase?: Purchase,
  isEdit?: boolean,
  onClose?: () => void
) => {
  const { activeShopId } = useShopStore();

  const createMutation = usePurchaseCreateMutation();
  const updateMutation = usePurchaseUpdateMutation();
  const deleteMutation = usePurchaseDeleteMutation();

  const form = useForm<CreatePurchaseDto>({
    defaultValues: initialForm,
  });

  const {
    fields: items,
    append,
    remove,
    update,
  } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const buildItem = () => ({
    shopProductId: "",
    quantity: 1,
    unitCost: 0,
    subtotal: 0,
    includesTax: true,
  });
  const addItem = () => {
    append(buildItem());
  };
  const updateItem = (
    index: number,
    next: Partial<CreatePurchaseDto["items"][number]>
  ) => {
    const current = form.getValues(`items.${index}`);

    const merged = { ...current, ...next };

    update(index, {
      ...merged,
      subtotal: Number(merged.quantity) * Number(merged.unitCost),
    });
  };
  const onSubmit = async (values: CreatePurchaseDto) => {
    const payload: CreatePurchaseDto = {
      ...values,
      shopId: activeShopId!,
      items: values.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        unitCost: Number(item.unitCost),
        subtotal: Number(item.subtotal),
      })),
    };

    if (isEdit && editPurchase) {
      updateMutation.mutate(
        { id: editPurchase.id, payload },
        {
          onSuccess: () => {
            onClose?.();
            form.reset(initialForm);
          },
        }
      );
      return;
    }

    if (deletePurchase) {
      deleteMutation.mutate(
        { id: deletePurchase.id },
        {
          onSuccess: () => {
            onClose?.();
            form.reset(initialForm);
          },
        }
      );
      return;
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        onClose?.();
        form.reset(initialForm);
      },
    });
  };

  useEffect(() => {
    if (!isEdit) {
      form.reset(initialForm);
      return;
    }

    if (editPurchase) {
      form.reset(mapPurchaseToForm(editPurchase, initialForm));
    }
  }, [isEdit, editPurchase]);
  const removeItem = (index: number) => {
    remove(index);
  };

  return {
    form,
    items,
    addItem,
    removeItem,
    updateItem,
    onSubmit,
    reset: form.reset,
    isLoadingCreate: createMutation.isPending,
    isLoadingUpdate: updateMutation.isPending,
    isLoadingDelete: deleteMutation.isPending,
  };
};
