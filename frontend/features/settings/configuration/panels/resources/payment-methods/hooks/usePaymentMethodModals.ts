import { useModal } from "@/features/modal/hooks/useModal";
import { PaymentMethod } from "../types";

export const usePaymentMethodModals = () => {
  const deletePaymentMethodModal = useModal<PaymentMethod>(
    "deletePaymentMethod"
  );

  const deletePaymentMethod = deletePaymentMethodModal.data ?? null;

  const openDelete = (PaymentMethod: PaymentMethod) => {
    deletePaymentMethodModal.open(PaymentMethod);
  };

  const closeAll = () => {
    deletePaymentMethodModal.close();
  };

  return {
    deletePaymentMethodModal,
    deletePaymentMethod,
    openDelete,
    closeAll,
  };
};
