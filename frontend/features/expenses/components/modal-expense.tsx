import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useExpenseForm, useExpenseModals } from "../hooks";
import ExpenseForm from "./expense-form";
import { usePaymentMethods } from "@/app/(protected)/settings/payment-method/hooks";

export default function ModalExpense() {
  const {
    createExpenseModal,
    editExpense,
    editExpenseModal,
    deleteExpense,
    deleteExpenseModal,
    isEdit,
    closeAll,
  } = useExpenseModals();
  const openModal = createExpenseModal.isOpen || editExpenseModal.isOpen;

  const {
    initialForm,
    reset,
    isLoadingCreate,
    isLoadingUpdate,
    isLoadingDelete,
    register,
    isValid,
    control,
    errors,
    onSubmit,
  } = useExpenseForm(editExpense!, deleteExpense!, () => {
    closeAll();
    reset({ ...initialForm });
  });

  const handleClose = () => {
    closeAll();
    reset({ ...initialForm });
  };

  const isSubmitting = isLoadingCreate || isLoadingUpdate || isLoadingDelete;
  const { paymentMethods } = usePaymentMethods();
  useEffect(() => {
    if (!editExpense) return;
    reset({
      description: editExpense.description || "",
      amount: editExpense.amount || 0,
      paymentMethodId: editExpense.paymentMethodId || "",
      date: editExpense.date || "",
    });
  }, [editExpense, reset]);

  return (
    <Modal
      isOpen={openModal}
      onClose={handleClose}
      title={editExpenseModal.isOpen ? "Editar gasto" : "Crear gasto"}
      description={
        editExpenseModal.isOpen || createExpenseModal.isOpen
          ? "Completa los datos del gasto"
          : ""
      }
      size="lg">
      <ExpenseForm
        register={register}
        onSubmit={onSubmit}
        control={control}
        errors={errors}
        onCancel={handleClose}
        isEdit={isEdit}
        isSubmitting={isSubmitting}
        paymentMethods={paymentMethods}
        isValid={isValid}
      />
    </Modal>
  );
}

