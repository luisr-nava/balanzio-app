import { useShallow } from "zustand/react/shallow";
import {
  useCustomerCreateMutation,
  useCustomerDeleteMutation,
  useCustomerUpdateMutation,
} from "./useCustomerMutation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-handler";
import { useShopStore } from "@/features/shop/shop.store";
import { CreateCustomerDto, Customer } from "../types";
import { useModal } from "@/features/modal/hooks/useModal";

const initialForm: CreateCustomerDto = {
  fullName: "",
  email: "",
  phone: "",
  dni: "",
  address: "",
  creditLimit: 0,
  notes: "",
  shopId: "",
};

export const useCustomerForm = (
  editCustomer?: Customer,
  deleteCustomer?: Customer,

  onClose?: () => void,
) => {
  const { activeShopId } = useShopStore();

  const createMutation = useCustomerCreateMutation();
  const updateMutation = useCustomerUpdateMutation();
  const deleteMutation = useCustomerDeleteMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<CreateCustomerDto>({
    defaultValues: initialForm,
  });

  const onSubmit = handleSubmit((values) => {
    const basePayload: CreateCustomerDto = {
      ...values,
      shopId: activeShopId!,
    };
    if (editCustomer) {
      updateMutation.mutate(
        {
          id: editCustomer.id,
          payload: basePayload,
        },
        {
          onSuccess: () => {
            toast.success("Cliente actualizado");
          },
          onError: () => {
            toast.error("No se pudo actualizar el cliente");
          },
        },
      );
    } else if (deleteCustomer) {
      deleteMutation.mutate(
        {
          id: deleteCustomer.id,
        },
        {
          onSuccess: () => {
            toast.success("Cliente eliminado correctamente");
          },
          onError: () => {
            toast.error("No se pudo eliminar el cliente");
          },
        },
      );
    } else {
      createMutation.mutate(basePayload, {
        onSuccess: () => {
          toast.success("Cliente creado");
        },
        onError: () => {
          toast.error("No se pudo crear el cliente");
        },
      });
    }
    onClose?.();
    reset();
  });

  return {
    activeShopId,
    createMutation,
    updateMutation,
    deleteMutation,
    isLoadingCreate: createMutation.isPending,
    isLoadingUpdate: updateMutation.isPending,
    isLoadingDelete: deleteMutation.isPending,
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

export type UseCustomerFormReturn = ReturnType<typeof useCustomerForm>;

