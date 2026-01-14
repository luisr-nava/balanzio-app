import { Modal } from "@/components/ui/modal";
import { useExpenseForm, useExpenseModals } from "../hooks";
import ExpenseForm from "./expense-form";
import { Button } from "@/components/ui/button";
import { usePaymentMethods } from "@/features/settings/configuration/panels/resources/payment-methods/hooks";

interface ExpenseModalProps {
  cashRegisterId?: string;
  modals: ReturnType<typeof useExpenseModals>;
}
export default function ExpenseModal({
  cashRegisterId,
  modals,
}: ExpenseModalProps) {
  const {
    createExpenseModal,
    editExpense,
    editExpenseModal,
    deleteExpense,
    deleteExpenseModal,
    isEdit,
    closeAll,
  } = modals;
  const openModal =
    createExpenseModal.isOpen ||
    editExpenseModal.isOpen ||
    deleteExpenseModal.isOpen;

  const {
    form,
    onSubmit,
    isLoadingCreate,
    isLoadingUpdate,
    reset,
    isLoadingDelete,
  } = useExpenseForm(
    cashRegisterId!,
    editExpense!,
    deleteExpense!,
    isEdit,
    () => {
      closeAll();
    }
  );

  const handleClose = () => {
    closeAll();
    reset();
  };

  const isSubmitting = isLoadingCreate || isLoadingUpdate || isLoadingDelete;
  const { paymentMethods } = usePaymentMethods();

  return (
    <Modal
      isOpen={openModal}
      onClose={handleClose}
      title={
        editExpenseModal.isOpen
          ? "Editar egreso"
          : deleteExpenseModal
            ? "Eliminar egreso "
            : "Crear egreso"
      }
      description={
        editExpenseModal.isOpen || createExpenseModal.isOpen
          ? "Completa los datos del egreso"
          : ""
      }
      size="lg"
    >
      {deleteExpenseModal.isOpen ? (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            ¿Seguro que deseas eliminar este egreso?
            <span className="block">Esta acción no se puede deshacer.</span>
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoadingDelete}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onSubmit(deleteExpense!);
              }}
              disabled={isLoadingDelete}
            >
              {isLoadingDelete ? "Eliminando..." : "¿Eliminar?"}
            </Button>
          </div>
        </div>
      ) : (
        <ExpenseForm
          form={form}
          onSubmit={onSubmit}
          onCancel={handleClose}
          isEdit={isEdit}
          isSubmitting={isSubmitting}
          paymentMethods={paymentMethods}
        />
      )}
    </Modal>
  );
}
