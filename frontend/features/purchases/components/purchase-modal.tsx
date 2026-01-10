import { Modal } from "@/components/ui/modal";
import { Supplier } from "@/features/suppliers/types";
import { usePurchaseForm, usePurchaseModals } from "../hooks";
import PurchaseForm from "./purchase-form";
import { Product } from "../../products/types";
import { useEffect } from "react";
import { usePaymentMethods } from "@/app/(protected)/settings/payment-method/hooks";
import { Button } from "@/components/ui/button";
import PurchaseDelete from "./purchase-delete";
import { Form } from "@/components/ui/form";
import { PaymentMethod } from "@/app/(protected)/settings/payment-method/interfaces";

interface ModalPurchaseProps {
  cashRegisterId?: string;
  products: Product[];
  suppliers: Supplier[];
  paymentMethods: PaymentMethod[];

  modals: ReturnType<typeof usePurchaseModals>;
}
export default function PurchaseModal({
  cashRegisterId,
  suppliers,
  products,
  paymentMethods,

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
    items,
    addItem,
    removeItem,
    updateItem,
    isLastItemComplete,
    resetForm,
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
    resetForm();
  };

  const isSubmitting = isLoadingCreate || isLoadingUpdate || isLoadingDelete;
  useEffect(() => {
    if (createPurchaseModal.isOpen && !isEdit) {
      resetForm();
      addItem();
    }
  }, [createPurchaseModal.isOpen]);

  return (
    <Modal
      isOpen={openModal}
      onClose={handleClose}
      title={
        editPurchaseModal.isOpen
          ? "Editar compra"
          : deletePurchaseModal
            ? "Eliminar compra"
            : "Crear compra"
      }
      description={deletePurchaseModal ? "" : "Completa los datos de la compra"}
      size="lg"
    >
      {deletePurchaseModal.isOpen ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <PurchaseDelete
              handleClose={handleClose}
              isLoadingDelete={isLoadingDelete}
            />
          </form>
        </Form>
      ) : (
        <PurchaseForm
          form={form}
          onSubmit={onSubmit}
          onCancel={handleClose}
          isEdit={isEdit}
          isSubmitting={isSubmitting}
          suppliers={suppliers}
          items={items}
          addItem={addItem}
          removeItem={removeItem}
          updateItem={updateItem}
          isLastItemComplete={isLastItemComplete}
          products={products}
          paymentMethods={paymentMethods}
        />
      )}
    </Modal>
  );
}
