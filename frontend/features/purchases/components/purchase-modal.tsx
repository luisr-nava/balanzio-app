import { Modal } from "@/components/ui/modal";
import { Supplier } from "@/features/suppliers/types";
import { usePurchaseForm, usePurchaseModals } from "../hooks";
import PurchaseForm from "./purchase-form";

interface ModalPurchaseProps {
  cashRegisterId?: string;

  suppliers: Supplier[];
  modals: ReturnType<typeof usePurchaseModals>;
}
export default function PurchaseModal({
  cashRegisterId,
  suppliers,
  modals,
}: ModalPurchaseProps) {
  const {
    createPurchaseModal,
    editPurchase,
    editPurchaseModal,
    deletePurchase,
    deletePurchaseModal,
    isEdit,
    closeAll,
  } = modals;

  const openModal =
    createPurchaseModal.isOpen ||
    editPurchaseModal.isOpen ||
    deletePurchaseModal.isOpen;

  const {
    form,
    isLoadingCreate,
    isLoadingUpdate,
    isLoadingDelete,
    onSubmit,
    reset,
  } = usePurchaseForm(
    cashRegisterId!,
    editPurchase!,
    deletePurchase!,
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

  return (
    <Modal
      isOpen={createPurchaseModal.isOpen || editPurchaseModal.isOpen}
      onClose={handleClose}
      title={isEdit ? "Editar compra" : "Crear compra"}
      description="Completa los datos del producto"
      size="lg"
    >
      <PurchaseForm
        form={form}
        onSubmit={onSubmit}
        onCancel={handleClose}
        isEdit={isEdit}
        isSubmitting={isLoadingCreate || isLoadingUpdate}
        suppliers={suppliers}
      />
    </Modal>
  );
}
