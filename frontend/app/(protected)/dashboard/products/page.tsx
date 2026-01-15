"use client";
import { usePaginationParams } from "@/src/hooks/usePaginationParams";
import { Loading } from "@/components/loading";
import {
  ModalProduct,
  ProductExpanded,
  ProductFilters,
  productColumns,
} from "@/features/products/components";
import { Product } from "@/features/products/types";
import { useState } from "react";
import { useProductModals, useProducts } from "@/features/products/hooks";
import { BaseTable } from "@/components/table/BaseTable";
import { BaseHeader } from "@/components/header/BaseHeader";
import { useSupplierQuery } from "@/features/suppliers/hooks";
import { useMeasurementUnits } from "@/features/settings/configuration/panels/resources/measurement-unit/hooks";
import { ProductFiltersValue } from "@/features/products/components/product-filters";

export default function ProductsPage() {
  const productsModals = useProductModals();

  const {
    params,
    updateParams,
    searchInput,
    debouncedSearch,
    page,
    limit,
    setSearch,
    setPage,
    setLimit,
    reset,
  } = usePaginationParams(500);

  const filters: ProductFiltersValue = {
    supplierId:
      typeof params.supplierId === "string" ? params.supplierId : undefined,

    categoryId:
      typeof params.categoryId === "string" ? params.categoryId : undefined,

    isActive:
      params.isActive === undefined ? undefined : params.isActive === "true",

    lowStock:
      params.lowStock === undefined ? undefined : params.lowStock === "true",
  };

  const { products, productsLoading, pagination, isFetching } = useProducts({
    search: debouncedSearch,
    page,
    limit,
    ...filters,
  });

  const { suppliers } = useSupplierQuery({});
  const { measurementUnits, isLoadingMeasurement: measurementUnitsLoading } =
    useMeasurementUnits();

  const hasActiveFilters =
    Boolean(debouncedSearch) ||
    Object.values(filters).some((v) => v !== undefined);

  return (
    <div className="space-y-4">
      <BaseHeader
        search={searchInput}
        setSearch={setSearch}
        filters={
          <ProductFilters
            value={filters}
            onChange={(next) => {
              updateParams({ ...next, page: 1 });
            }}
            suppliers={suppliers}
          />
        }
        createLabel={"Nuevo producto"}
        showClearFilters={hasActiveFilters}
        onClearFilters={() => {
          reset();
          setSearch("");
          setPage(1);
        }}
        onCreate={productsModals.openCreate}
      />

      {productsLoading ? (
        <Loading />
      ) : (
        <BaseTable<Product>
          data={products}
          getRowId={(e) => e.id}
          columns={productColumns}
          actions={(e) => [
            {
              type: "edit",
              onClick: productsModals.openEdit,
            },
            // {
            //   type: "delete",
            //   onClick: productsModals.openEdit,
            // },
          ]}
          renderExpandedContent={(e) => <ProductExpanded product={e} />}
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
      <ModalProduct
        modals={productsModals}
        suppliers={suppliers}
        measurementUnits={measurementUnits}
      />
    </div>
  );
}
