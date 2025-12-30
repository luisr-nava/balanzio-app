import { useModalsStore, type ModalType } from "../store/modals.slice";
export const useModal = (type: ModalType) => {
  const openModal = useModalsStore((state) => state.openModal);
  const closeModal = useModalsStore((state) => state.closeModal);
  const isOpen = useModalsStore((state) => state.isModalOpen(type));
  const data = useModalsStore((state) => state.getModalData(type));

  return {
    isOpen,
    data,
    open: (payload?: unknown) => openModal(type, payload),
    close: () => closeModal(type),
  };
};

export const useCloseAllModals = () => {
  return useModalsStore((state) => state.closeAllModals);
};

