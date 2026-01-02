"use client";
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
    </div>
  );
}

