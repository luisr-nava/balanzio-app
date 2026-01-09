import { useModal } from "@/features/modal/hooks/useModal";
import { Purchase } from "../types";

export const usePurchaseModals = () => {
  const createPurchaseModal = useModal("createPurchase");
  const editPurchaseModal = useModal<Purchase>("editPurchase");
  const deletePurchaseModal = useModal<Purchase>("deletePurchase");

  const editPurchase = editPurchaseModal.data ?? null;
  const deletePurchase = deletePurchaseModal.data ?? null;
  const isEdit = Boolean(editPurchase);

  const openCreate = () => {
    createPurchaseModal.open();
  };

  const openEdit = (purchase: Purchase) => {
    editPurchaseModal.open(purchase);
  };

  const openDelete = (purchase: Purchase) => {
    deletePurchaseModal.open(purchase);
  };

  const closeAll = () => {
    createPurchaseModal.close();
    editPurchaseModal.close();
    deletePurchaseModal.close();
  };

  return {
    createPurchaseModal,
    editPurchaseModal,
    deletePurchaseModal,

    editPurchase,
    deletePurchase,
    isEdit,

    openCreate,
    openEdit,
    openDelete,
    closeAll,
  };
};
