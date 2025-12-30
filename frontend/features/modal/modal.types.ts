export type ModalType =
  | "createProduct"
  | "editProduct"
  | "createCategory"
  | "editCategory"
  | "createSupplier"
  | "editSupplier"
  | "createPurchase"
  | "editPurchase"
  | "createSale"
  | "editSale"
  | "createCustomer"
  | "editCustomer"
  | "createEmployee"
  | "editEmployee"
  | null;

export interface ModalStoreState {
  type: ModalType;
  data: unknown | null;
}

export interface ModalStoreActions {
  openModal: (type: Exclude<ModalType, null>, data?: unknown) => void;
  closeModal: () => void;
}

export type ModalStore = ModalStoreState & ModalStoreActions;

