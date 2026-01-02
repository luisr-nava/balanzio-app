"use client";
import { useShopStore } from "@/features/shop/shop.store";
import { usePaginationParams } from "@/src/hooks/usePaginationParams";
import { Loading } from "@/components/loading";
import { useCustomerModals, useCustomers } from "@/features/clients/hooks";
import {
  CustomerHeader,
  ModalClient,
  TableCustomers,
} from "@/features/clients/components";

export default function ClientesPage() {
  const { openCreate, openEdit, openDelete } = useCustomerModals();
  const { search, setSearch, debouncedSearch, page, limit, setPage, setLimit } =
    usePaginationParams(300);
  const { customers, customersLoading, pagination, isFetching } = useCustomers(
    debouncedSearch,
    page,
    limit,
  );

  return (
    <div className="space-y-4">
      <CustomerHeader
        handleOpenCreate={openCreate}
        search={search}
        setSearch={setSearch}
      />
      {customersLoading ? (
        <Loading />
      ) : (
        <div className="p-5 space-y-4">
          <TableCustomers
            customers={customers!}
            handleDelete={openDelete}
            handleEdit={openEdit}
            limit={limit}
            page={page}
            setLimit={setLimit}
            setPage={setPage}
            pagination={pagination!}
            isFetching={isFetching}
          />
        </div>
      )}

      <ModalClient />

      {/* <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar cliente"
        description="Esta acción es permanente y no podrás recuperar el registro.">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            ¿Seguro que deseas eliminar a{" "}
            <span className="font-semibold">{deleteTarget?.fullName}</span>?
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={form.deleteMutation.isPending}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={form.deleteMutation.isPending}>
              {form.deleteMutation.isPending
                ? "Eliminando..."
                : "Eliminar definitivamente"}
            </Button>
          </div>
        </div>
      </Modal> */}
    </div>
  );
}

