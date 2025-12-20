"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useShopStore } from "@/app/(private)/store/shops.slice";
import type { Supplier } from "@/lib/types/supplier";
import { Modal } from "@/components/ui/modal";
import { useProducts } from "./hooks/useProducts";
import { Loading } from "../../components/loading";
import { ProductHeader } from "./components/product-header";
import { TableProducts } from "./components/table-products";
import { useProductForm } from "./hooks/useProductForm";
import { ProductForm } from "./components/product-form";
import { Empty } from "./components/empty";
import { ShopLoading } from "@/components/shop-loading";
import { usePaginationParams } from "../../hooks/useQueryParams";
import { ShopEmpty } from "@/components/shop-emty";
import { supplierApi } from "@/lib/api/supplier.api";
import { Pagination } from "../../components";

export default function ProductosPage() {
  const { activeShopId, activeShopLoading } = useShopStore();

  const { search, setSearch, debouncedSearch, page, limit, setPage, setLimit } =
    usePaginationParams(300);
  const {
    products,
    productsLoading,
    pagination,
    isFetching,
  } = useProducts(debouncedSearch, page, limit, Boolean(activeShopId));
  const form = useProductForm();
  const { productModal, editProductModal, initialForm, setValue, reset } = form;

  // ? Move to supplier hook
  const { data: suppliers = [], isLoading: suppliersLoading } = useQuery({
    queryKey: ["suppliers", activeShopId, "for-products"],
    queryFn: () => supplierApi.listByShop(activeShopId || ""),
    enabled: Boolean(activeShopId),
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    if (activeShopId) {
      setValue("shopId", activeShopId);
    }
  }, [activeShopId, setValue]);

  if (!activeShopId) return <ShopEmpty />;

  if (activeShopLoading) return <ShopLoading />;

  return (
    <div className="space-y-4">
      <ProductHeader
        handleOpenCreate={form.handleOpenCreate}
        search={search}
        setSearch={setSearch}
      />
      {productsLoading ? (
        <Loading />
      ) : !products || products.length === 0 ? (
        <>
          <Empty />
        </>
      ) : (
        <div className="p-5 space-y-4">
          <TableProducts products={products} handleEdit={form.handleEdit} />
          <Pagination
            page={page}
            totalPages={pagination?.totalPages ?? 1}
            limit={limit}
            onPageChange={(nextPage) => {
              if (nextPage < 1) return;
              setPage(nextPage);
            }}
            onLimitChange={(nextLimit) => setLimit(nextLimit)}
            isLoading={isFetching}
            totalItems={pagination?.total ?? 0}
          />
        </div>
      )}

      <Modal
        isOpen={productModal.isOpen || editProductModal.isOpen}
        onClose={() => {
          productModal.close();
          editProductModal.close();
          reset({ ...initialForm, shopId: activeShopId || "" });
        }}
        title={editProductModal.isOpen ? "Editar producto" : "Crear producto"}
        description="Completa los datos del producto"
        size="lg">
        <ProductForm
          activeShopId={form.activeShopId}
          createMutation={form.createMutation}
          updateMutation={form.updateMutation}
          register={form.register}
          onSubmit={form.onSubmit}
          reset={form.reset}
          productModal={form.productModal}
          editProductModal={form.editProductModal}
          initialForm={form.initialForm}
          control={form.control}
          errors={form.errors}
          suppliers={suppliers}
          suppliersLoading={suppliersLoading}
        />
      </Modal>
    </div>
  );
}
