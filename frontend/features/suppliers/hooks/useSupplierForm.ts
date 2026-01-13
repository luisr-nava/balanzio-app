import { useShopStore } from "@/features/shop/shop.store";
import { CreateSupplierDto, Supplier } from "../types";
import {
  useSupplierCreateMutation,
  useSupplierDeleteMutation,
  useSupplierUpdateMutation,
} from "./useSupplierMutations";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect } from "react";

const initialForm: CreateSupplierDto = {
  name: "",
  contactName: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
  categoryId: null,
  shopIds: [],
};

function mapIncomeToForm(
  supplier: Supplier,
  initialForm: CreateSupplierDto
): CreateSupplierDto {
  return {
    ...initialForm,
    name: supplier.name,
    address: supplier.address,
    phone: supplier.phone,
    categoryId: supplier.category?.id ?? null,
    email: supplier.email,
    notes: supplier.notes,
    shopIds: supplier.supplierShop?.map((s) => s.shopId) ?? [],
  };
}
export const useSupplierForm = (
  editSupplier?: Supplier,
  deleteSupplier?: Supplier,
  isEdit?: boolean,
  onClose?: () => void
) => {
  const { activeShopId } = useShopStore();

  const createMutation = useSupplierCreateMutation();
  const updateMutation = useSupplierUpdateMutation();
  const deleteMutation = useSupplierDeleteMutation();
  const form = useForm<CreateSupplierDto>({
    defaultValues: initialForm,
  });

  const onSubmit = async (values: CreateSupplierDto) => {
    const basePayload: CreateSupplierDto = {
      ...values,
      shopIds: [activeShopId!],
    };
    if (editSupplier) {
      updateMutation.mutate(
        {
          id: editSupplier.id,
          payload: basePayload,
        },
        {
          onSuccess: () => {
            toast.success("Proveedor actualizado");
            onClose?.();
            form.reset({ ...initialForm });
          },
          onError: () => {
            toast.error("No se pudo actualizar el proveedor");
          },
        }
      );
    } else if (deleteSupplier) {
      deleteMutation.mutate(
        {
          id: deleteSupplier.id,
        },
        {
          onSuccess: () => {
            toast.success("Proveedor eliminado correctamente");
            onClose?.();
            form.reset({ ...initialForm });
          },
          onError: () => {
            toast.error("No se pudo eliminar el proveedor");
          },
        }
      );
    } else {
      createMutation.mutate(basePayload, {
        onSuccess: () => {
          toast.success("Proveedor creado");
          onClose?.();
          form.reset({ ...initialForm });
        },
        onError: () => {
          toast.error("No se pudo crear el proveedor");
        },
      });
    }
  };

  useEffect(() => {
    if (!isEdit) {
      form.reset(initialForm);
      return;
    }

    if (editSupplier) {
      form.reset(mapIncomeToForm(editSupplier, initialForm));
    }
  }, [isEdit, editSupplier]);

  return {
    form,
    activeShopId,
    createMutation,
    updateMutation,
    deleteMutation,
    isLoadingCreate: createMutation.isPending,
    isLoadingUpdate: updateMutation.isPending,
    isLoadingDelete: deleteMutation.isPending,
    onSubmit,
    initialForm,
  };
};
