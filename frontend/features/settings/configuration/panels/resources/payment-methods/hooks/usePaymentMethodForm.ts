import { useForm } from "react-hook-form";
import { CreatePaymentMethodDto, PaymentMethod } from "../types";
import {
  usePaymentMethodCreateMutation,
  usePaymentMethodDeleteMutation,
  usePaymentMethodUpdateMutation,
} from "./usePaymentMethodMutations";

const initialForm: CreatePaymentMethodDto = {
  name: "",
  code: "",
  description: "",
  shopId: "",
};
function mapPaymentMethodForm(
  paymentMethod: PaymentMethod,
  initialForm: CreatePaymentMethodDto
) {
  return {
    ...initialForm,
    name: paymentMethod.name,
    code: paymentMethod.code,
    description: paymentMethod.description,
  };
}

export const usePaymentMethodForm = (
  editPaymentMethod?: PaymentMethod,
  onEditDone?: () => void
) => {
  // const { activeShopId } = useShopStore();

  const createMutation = usePaymentMethodCreateMutation();
  const updateMutation = usePaymentMethodUpdateMutation();
  const deleteMutation = usePaymentMethodDeleteMutation();

  const form = useForm<CreatePaymentMethodDto>({
    defaultValues: initialForm,
  });

  const onSubmit = async (values: CreatePaymentMethodDto) => {};
  //   if (!activeShopId) {
  //     toast.error("No hay tienda activa");
  //     return;
  //   }
  //   const basePayload: CreatePaymentMethodDto = {
  //     ...values,
  //     shopIds: [activeShopId],
  //   };
  //   if (editCategory) {
  //     updateMutation.mutate(
  //       {
  //         id: editCategory.id,
  //         payload: basePayload,
  //       },
  //       {
  //         onSuccess: () => {
  //           toast.success("Categoria actualizada");
  //           form.reset({ ...initialForm });
  //           onEditDone?.();
  //         },
  //         onError: () => {
  //           toast.error("No se pudo actualizar la categoria");
  //         },
  //       }
  //     );
  //     return;
  //   } else {
  //     createMutation.mutate(basePayload, {
  //       onSuccess: () => {
  //         toast.success("Categoria creada");
  //         form.reset({ ...initialForm });
  //       },
  //       onError: () => {
  //         toast.error("No se pudo actualizar la categoria");
  //       },
  //     });
  //   }
  // };
  const isLoading = createMutation.isPending || updateMutation.isPending;

  // useEffect(() => {
  //   if (!editCategory) {
  //     form.reset(initialForm);
  //     return;
  //   }
  //   if (editCategory) {
  //     form.reset(mapPaymentMethodForm(editCategory, initialForm));
  //   }
  // }, [editCategory]);

  return {
    form,
    onSubmit,
    isLoading,
    initialForm,
    isEditing: Boolean(editPaymentMethod),
  };
};
