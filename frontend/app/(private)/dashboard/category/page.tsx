"use client";

import { useShopStore } from "@/app/(private)/store/shops.slice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FolderTree, Package, Truck } from "lucide-react";
import { useCategory } from "./hooks/useCategory";
import { ShopLoading } from "@/components/shop-loading";
import { useShallow } from "zustand/react/shallow";
import { useCategoryForm } from "./hooks/useCategoryForm";
import { CategoryForm } from "./components/category-form";
import { CategoryList } from "./components/category-list";

export default function CategoriasPage() {
  const {
    categoryProducts,
    categoryProductsLoading,
    categorySuppliers,
    categorySuppliersLoading,
    fetchNextProductCategories,
    hasMoreProductCategories,
    isFetchingNextProductCategories,
    fetchNextSupplierCategories,
    hasMoreSupplierCategories,
    isFetchingNextSupplierCategories,
  } = useCategory();

  const {
    isOwner,
    shops,
    registerProduct,
    registerSupplier,
    onSubmitProduct,
    onSubmitSupplier,
    toggleShopSelection,
    handleEditProduct,
    handleEditSupplier,
    cancelProductEdit,
    cancelSupplierEdit,
    productShopIds,
    supplierShopIds,
    canCreateProduct,
    canCreateSupplier,
    editingProductId,
    editingSupplierId,
    productPending,
    supplierPending,
  } = useCategoryForm();

  const { activeShopLoading } = useShopStore(
    useShallow((state) => ({
      activeShopLoading: state.activeShopLoading,
    })),
  );

  if (activeShopLoading) {
    return <ShopLoading />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
          <CardDescription>
            Categorías para organizar tu catálogo.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <CategoryForm
            type="product"
            titlePlaceholder="Lácteos"
            shops={shops}
            isOwner={isOwner}
            registerName={registerProduct}
            selectedShopIds={productShopIds}
            onToggleShop={(id) => toggleShopSelection("product", id)}
            onSubmit={onSubmitProduct}
            canSubmit={canCreateProduct}
            isEditing={Boolean(editingProductId)}
            onCancelEdit={cancelProductEdit}
            pending={productPending}
          />

          <CategoryList
            title="Listado de categorías"
            icon={<Package className="h-5 w-5 text-primary" />}
            items={categoryProducts}
            loading={categoryProductsLoading}
            emptyText="Aún no tienes categorías para productos."
            isOwner={isOwner}
            onEdit={(category) => handleEditProduct(category as any)}
            hasNextPage={hasMoreProductCategories}
            fetchNextPage={fetchNextProductCategories}
            isFetchingNextPage={isFetchingNextProductCategories}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proveedores</CardTitle>
          <CardDescription>
            Clasifica tus proveedores por rubro o tipo de servicio.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <CategoryForm
            type="supplier"
            titlePlaceholder="Distribuidores"
            shops={shops}
            isOwner={isOwner}
            registerName={registerSupplier}
            selectedShopIds={supplierShopIds}
            onToggleShop={(id) => toggleShopSelection("supplier", id)}
            onSubmit={onSubmitSupplier}
            canSubmit={canCreateSupplier}
            isEditing={Boolean(editingSupplierId)}
            onCancelEdit={cancelSupplierEdit}
            pending={supplierPending}
          />

          <CategoryList
            title="Listado de categorías"
            icon={<Truck className="h-5 w-5 text-primary" />}
            items={categorySuppliers as any}
            loading={categorySuppliersLoading}
            emptyText="Aún no tienes categorías para proveedores."
            isOwner={isOwner}
            onEdit={(category) => handleEditSupplier(category as any)}
            hasNextPage={hasMoreSupplierCategories}
            fetchNextPage={fetchNextSupplierCategories}
            isFetchingNextPage={isFetchingNextSupplierCategories}
          />
        </CardContent>
      </Card>
    </div>
  );
}
