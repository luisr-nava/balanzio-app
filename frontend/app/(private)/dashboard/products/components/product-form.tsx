import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Controller, useWatch } from "react-hook-form";
import type { CreateProductDto } from "../interfaces";
import type { UseProductFormReturn } from "../hooks/useProductForm";
import type { Supplier } from "@/lib/types/supplier";
import { Switch } from "@/components/ui/switch";

type Props = Pick<
  UseProductFormReturn,
  | "activeShopId"
  | "createMutation"
  | "updateMutation"
  | "register"
  | "onSubmit"
  | "reset"
  | "productModal"
  | "editProductModal"
  | "initialForm"
  | "control"
> & {
  suppliers: Supplier[];
  suppliersLoading: boolean;
};

export const ProductForm = ({
  activeShopId,
  createMutation,
  updateMutation,
  register,
  onSubmit,
  reset,
  productModal,
  editProductModal,
  initialForm,
  control,
  suppliers,
  suppliersLoading,
}: Props) => {
  const [watchName, watchSalePrice, watchShopId] = useWatch<CreateProductDto>({
    control,
    name: ["name", "salePrice", "shopId"],
  });

  const salePriceValue =
    typeof watchSalePrice === "number"
      ? watchSalePrice
      : Number(watchSalePrice || 0);
  const canSubmit = Boolean(
    (watchName || "").trim() && watchShopId && salePriceValue > 0,
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-3">
        <div className="grid gap-1">
          <Label>Nombre *</Label>
          <Input
            {...register("name", { required: true })}
            placeholder="Jabón"
          />
        </div>
        <div className="grid gap-1">
          <Label>Descripción</Label>
          <Input {...register("description")} placeholder="Opcional" />
        </div>
        <div className="grid gap-1">
          <Label>Código de barras</Label>
          <Input {...register("barcode")} placeholder="EAN/UPC" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="grid gap-1">
            <Label>Precio costo</Label>
            <Input
              type="number"
              {...register("costPrice", {
                setValueAs: (value) => (value === "" ? 0 : Number(value)),
              })}
            />
          </div>
          <div className="grid gap-1">
            <Label>Precio venta *</Label>
            <Input
              type="number"
              {...register("salePrice", {
                required: true,
                setValueAs: (value) => (value === "" ? 0 : Number(value)),
              })}
            />
          </div>
          <div className="grid gap-1">
            <Label>Stock</Label>
            <Input
              type="number"
              {...register("stock", {
                setValueAs: (value) => (value === "" ? 0 : Number(value)),
              })}
            />
          </div>
        </div>
        <div className="grid gap-1">
          <Label>Proveedor (opcional)</Label>
          <select
            className="h-10 rounded-md border bg-background px-3 text-sm"
            {...register("supplierId")}
            disabled={suppliersLoading}>
            <option value="">Sin proveedor</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
        <Controller
          control={control}
          name="isActive"
          render={({ field }) => (
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Producto activo</p>
                <p className="text-xs text-muted-foreground">
                  Desactívalo para ocultarlo del inventario.
                </p>
              </div>
              <Switch
                checked={field.value ?? true}
                onCheckedChange={(checked) => field.onChange(checked)}
              />
            </div>
          )}
        />
      </div>
      <ModalFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            productModal.close();
            editProductModal.close();
            reset({ ...initialForm, shopId: activeShopId || "" });
          }}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={
            !canSubmit || createMutation.isPending || updateMutation.isPending
          }>
          {createMutation.isPending || updateMutation.isPending
            ? "Guardando..."
            : editProductModal.isOpen
            ? "Actualizar producto"
            : "Crear producto"}
        </Button>
      </ModalFooter>
    </form>
  );
};
