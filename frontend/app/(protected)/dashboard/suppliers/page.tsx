"use client";

import { BaseHeader } from "@/components/header/BaseHeader";
import { Loading } from "@/components/loading";
import {
  SupplierExpanded,
  SupplierModal,
  useSupplierColumns,
} from "@/features/suppliers/components";
import { useSupplier, useSupplierModals } from "@/features/suppliers/hooks";
import { usePaginationParams } from "@/src/hooks/usePaginationParams";
import { Supplier } from "../../../../features/suppliers/types";
import { BaseTable } from "@/components/table/BaseTable";
import { useEffect, useState } from "react";

export default function SupplierPage() {
  const supplierModals = useSupplierModals();
  const {
    searchInput,
    setSearch,
    debouncedSearch,
    page,
    limit,
    setPage,
    setLimit,
  } = usePaginationParams(300);

  const [filters, setFilters] = useState<{
    categoryId?: string;
    supplierId?: string;
  }>({});
  const { suppliers, supplierLoading, pagination, isFetching } = useSupplier({
    ...filters,
    search: debouncedSearch,
    page,
    limit,
  });
  const supplierColums = useSupplierColumns();

  useEffect(() => {
    if (!pagination) return;

    if (page > pagination.totalPages && pagination.totalPages > 0) {
      setPage(pagination.totalPages);
    }
  }, [pagination?.totalPages, page]);

  console.log(suppliers);

  return (
    <div className="space-y-4">
      <BaseHeader
        search={searchInput}
        setSearch={setSearch}
        // filters={
        //   <ProductFilters
        //     value={filters}
        //     onChange={(next) => {
        //       setFilters((prev) => ({ ...prev, ...next }));
        //       setPage(1);
        //     }}
        //     suppliers={suppliers}
        //   />
        // }
        createLabel={"Nuevo proveedor"}
        // showClearFilters={hasActiveFilters}
        onClearFilters={() => {
          // reset();
          // setFilters({});
          setSearch("");
        }}
        onCreate={supplierModals.openCreate}
      />
      {supplierLoading ? (
        <Loading />
      ) : (
        <BaseTable<Supplier>
          data={suppliers}
          getRowId={(e) => e.id}
          columns={supplierColums}
          actions={(e) => [
            {
              type: "edit",
              onClick: supplierModals.openEdit,
            },
            {
              type: "delete",
              onClick: supplierModals.openDelete,
            },
          ]}
          renderExpandedContent={(e) => <SupplierExpanded suppliers={e} />}
          pagination={{
            page,
            limit,
            totalPages: pagination?.totalPages || 0,
            totalItems: pagination?.total || 0,
            isFetching,
            onPageChange: setPage,
            onLimitChange: setLimit,
          }}
        />
      )}
      <SupplierModal modals={supplierModals} />
    </div>
  );
}
