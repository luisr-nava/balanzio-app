import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useSupplierForm, useSupplierModals } from "../hooks";
import SupplierForm from "./supplier-form";

interface SupplierModalProps {
  modals: ReturnType<typeof useSupplierModals>;
}
export default function SupplierModal({ modals }: SupplierModalProps) {
  const {
    createSupplierModal,
    editSupplier,
    editSupplierModal,
    deleteSupplier,
    deleteSupplierModal,
    isEdit,
    closeAll,
  } = modals;
  const openModal =
    createSupplierModal.isOpen ||
    editSupplierModal.isOpen ||
    deleteSupplierModal.isOpen;

  const { form, onSubmit, isLoadingCreate, isLoadingUpdate, isLoadingDelete } =
    useSupplierForm(editSupplier!, deleteSupplier!, isEdit, () => {
      closeAll();
    });

  const handleClose = () => {
    closeAll();
    form.reset();
  };

  const isSubmitting = isLoadingCreate || isLoadingUpdate || isLoadingDelete;

  return (
    <Modal
      isOpen={openModal}
      onClose={handleClose}
      title={
        editSupplierModal.isOpen
          ? "Editar proveedor"
          : deleteSupplierModal.isOpen
            ? "Eliminar proveedor"
            : "Crear proveedor"
      }
      description={
        deleteSupplierModal.isOpen ? "" : "Completa los datos del proveedor"
      }
      size="lg"
    >
      {deleteSupplierModal.isOpen ? (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            ¿Seguro que deseas eliminar este proveedor?
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
                onSubmit(deleteSupplier!);
              }}
              disabled={isLoadingDelete}
            >
              {isLoadingDelete ? "Eliminando..." : "¿Eliminar?"}
            </Button>
          </div>
        </div>
      ) : (
        <SupplierForm
          form={form}
          onSubmit={onSubmit}
          onCancel={handleClose}
          isEdit={isEdit}
          isSubmitting={isSubmitting}
        />
      )}
    </Modal>
  );
}
