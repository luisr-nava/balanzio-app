"use client";
import { useQuery } from "@tanstack/react-query";
import { useProducts } from "../../../../features/products/hooks/useProducts";
import { supplierApi } from "@/lib/api/supplier.api";
import { useMeasurementUnits } from "@/app/(protected)/settings/measurement-unit/hooks";
import { useShopStore } from "@/features/shop/shop.store";
import EmptyTable from "@/components/empty-table";
import { usePaginationParams } from "@/src/hooks/usePaginationParams";
import { Loading } from "@/components/loading";
import {
  ModalProduct,
  ProductHeader,
  TableProducts,
} from "@/features/products/components";
import { useProductModals } from "@/features/products/hooks/useProductModals";

export default function ProductosPage() {
  const { activeShopId } = useShopStore();

  const { openCreate, openEdit } = useProductModals();
  const { search, setSearch, debouncedSearch, page, limit, setPage, setLimit } =
    usePaginationParams(300);
  const { products, productsLoading, pagination, isFetching } = useProducts(
    debouncedSearch,
    page,
    limit,
    Boolean(activeShopId),
  );

  // ? Move to supplier hook
  const { data: suppliers = [], isLoading: suppliersLoading } = useQuery({
    queryKey: ["suppliers", activeShopId, "for-products"],
    queryFn: () => supplierApi.listByShop(activeShopId || ""),
    enabled: Boolean(activeShopId),
    staleTime: 1000 * 30,
  });
  const { measurementUnits, isLoading: measurementUnitsLoading } =
    useMeasurementUnits();

  return (
    <div className="space-y-4">
      <ProductHeader
        handleOpenCreate={openCreate}
        search={search}
        setSearch={setSearch}
      />
      {productsLoading ? (
        <Loading />
      ) : !products || products.length === 0 ? (
        <>
          <EmptyTable title={"No hay productos cargados."} />
        </>
      ) : (
        <div className="p-5 space-y-4">
          <TableProducts
            products={products}
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
      <ModalProduct
        suppliers={suppliers}
        suppliersLoading={suppliersLoading}
        measurementUnits={measurementUnits}
        measurementUnitsLoading={measurementUnitsLoading}
      />
    </div>
  );
}

