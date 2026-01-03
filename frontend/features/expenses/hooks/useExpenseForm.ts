import { useShopStore } from "@/features/shop/shop.store";
import { CreateExpenseDto, Expense } from "../types";
import {
  useExpenseCreateMutation,
  useExpenseDeleteMutation,
  useExpenseUpdateMutation,
} from "./useExpenseMutations";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const initialForm: CreateExpenseDto = {
  description: "",
  amount: 0,
  paymentMethodId: "",
  cashRegisterId: "",
  date: "",
  shopId: "",
};

export const useExpenseForm = (
  editExpense?: Expense,
  deleteExpense?: Expense,
  onClose?: () => void,
) => {
  const { activeShopId } = useShopStore();

  const createMutation = useExpenseCreateMutation();
  const updateMutation = useExpenseUpdateMutation();
  const deleteMutation = useExpenseDeleteMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    formState: { errors, isValid },
  } = useForm<CreateExpenseDto>({
    defaultValues: initialForm,
    mode: "onChange",
  });

  const onSubmit = handleSubmit((values) => {
    const basePayload: CreateExpenseDto = {
      ...values,
      shopId: activeShopId!,
    };
    if (editExpense) {
      updateMutation.mutate(
        {
          id: editExpense.id,
          payload: basePayload,
        },
        {
          onSuccess: () => {
            toast.success("Gasto actualizado");
          },
          onError: () => {
            toast.error("No se pudo actualizar el cliente");
          },
        },
      );
    } else if (deleteExpense) {
      deleteMutation.mutate(
        {
          id: deleteExpense.id,
        },
        {
          onSuccess: () => {
            toast.success("Gasto eliminado correctamente");
          },
          onError: () => {
            toast.error("No se pudo eliminar el gasto");
          },
        },
      );
    } else {
      createMutation.mutate(basePayload, {
        onSuccess: () => {
          toast.success("Gasto creado");
        },
        onError: () => {
          toast.error("No se pudo crear el gasto");
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
    isValid,
    control,
    getValues,
    errors,
  };
};

