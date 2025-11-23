"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useShopStore } from "@/app/(private)/store/shops.slice";
import { supplierApi } from "@/lib/api/supplier.api";
import type { Supplier } from "@/lib/types/supplier";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useProducts } from "./hooks/useProducts";
import { Loading } from "../../components";
import { ProductHeader } from "./components/product-header";
import { TableProducts } from "./components/table-products";
import { useProductForm } from "./hooks/useProductForm";
import { ProductForm } from "./components/product-form";
import { Empty } from "./components/empty";
import { ShopLoading } from "@/components/shop-loading";

export default function ProductosPage() {
  const { activeShopId, activeShopLoading } = useShopStore();

  const {
    products,
    productsLoading,
    pagination,
    page,
    limit,
    setPage,
    setLimit,
    search,
    setSearch,
  } = useProducts();
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const currentLimit = pagination?.limit ?? limit;
  const form = useProductForm();
  const { productModal, editProductModal, initialForm, setValue, reset } = form;

  // ? Move to supplier hook
  const { data: suppliersResponse, isLoading: suppliersLoading } = useQuery({
    queryKey: ["suppliers", activeShopId, "for-products"],
    queryFn: () => supplierApi.listByShop(activeShopId || ""),
    enabled: Boolean(activeShopId),
    staleTime: 1000 * 30,
  });

  // ? Move to supplier hook
  const suppliers = useMemo<Supplier[]>(() => {
    const value = suppliersResponse as any;
    if (!value) return [];
    if (Array.isArray(value)) return value as Supplier[];
    return (value.data as Supplier[]) ?? [];
  }, [suppliersResponse]);

  useEffect(() => {
    if (activeShopId) {
      setValue("shopId", activeShopId);
    }
  }, [activeShopId, setValue]);

  if (!activeShopId) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Productos</h1>
        <p className="text-muted-foreground">
          Selecciona una tienda para ver y crear productos.
        </p>
      </div>
    );
  }

  if (activeShopLoading) {
    return (
      <ShopLoading />
    );
  }

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
          <div className="flex flex-col gap-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex-1" />
              <div className="flex flex-1 justify-center gap-2 text-sm">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}>
                  ←
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(
                    1,
                    Math.min(currentPage - 2, totalPages - 4),
                  );
                  const pageNum = start + i;
                  if (pageNum > totalPages) return null;
                  const isCurrent = pageNum === currentPage;
                  return (
                    <Button
                      key={pageNum}
                      variant={isCurrent ? "default" : "outline"}
                      size="sm"
                      disabled={isCurrent}
                      onClick={() => {
                        if (isCurrent) return;
                        setPage(pageNum);
                      }}>
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}>
                  →
                </Button>
              </div>
              <div className="flex flex-1 justify-end items-center gap-2">
                <Label className="text-sm text-muted-foreground">Límite</Label>
                <select
                  className="w-24 rounded-md border border-input bg-background px-2 py-1 text-sm"
                  value={currentLimit}
                  onChange={(e) => setLimit(Number(e.target.value))}>
                  {[10, 50, 100].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
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
          suppliers={suppliers}
          suppliersLoading={suppliersLoading}
        />
      </Modal>
    </div>
  );
}
