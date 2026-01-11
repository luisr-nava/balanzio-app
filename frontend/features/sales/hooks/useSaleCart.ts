import { Product } from "@/features/products/types";
import { useMemo } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { SaleFormValues } from "./useSaleForm";

export const useSaleCart = (form: UseFormReturn<SaleFormValues>) => {
  const { control, watch } = form;
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "items",
  });
  const items = watch("items");
  const resolveShopProductId = (product: Product): string =>
    product.shopProductId || product.id || product.productId || "";

  const incrementProduct = (product: Product) => {
    const shopProductId = resolveShopProductId(product);
    if (!shopProductId) {
      toast.error("Producto inválido");
      return;
    }

    const stock = Number(product.stock ?? 0);
    if (stock <= 0) {
      toast.error("Producto sin stock");
      return;
    }

    const unitPrice =
      product.finalSalePrice || product.salePrice || product.price || 0;

    const index = items.findIndex((i) => i.shopProductId === shopProductId);

    if (index >= 0) {
      const current = items[index];

      if (current.quantity >= stock) {
        toast.error("Stock insuficiente");
        return;
      }

      const quantity = current.quantity + 1;
      update(index, {
        ...current,
        quantity,
      });
      return;
    }

    append({
      shopProductId,
      quantity: 1,
    });
  };

  const decrementProduct = (shopProductId: string) => {
    const index = items.findIndex((i) => i.shopProductId === shopProductId);
    if (index < 0) return;

    const current = items[index];
    const quantity = current.quantity - 1;

    if (quantity <= 0) {
      remove(index);
      return;
    }

    update(index, {
      ...current,
      quantity,
    });
  };

  const totalItems = useMemo(
    () => items.reduce((acc, i) => acc + i.quantity, 0),
    [items]
  );

//   const totalAmount = useMemo(
//     () => items.reduce((acc, i) => acc + Number(i.subtotal ?? 0), 0),
//     [items]
//   );
  const incrementProductById = (productId: string, products: Product[]) => {
    const product = products.find((p) => resolveShopProductId(p) === productId);
    if (product) {
      incrementProduct(product);
    }
  };
  return {
    items: fields,
    incrementProduct,
    decrementProduct,
    totalItems,
    // totalAmount,
    resolveShopProductId,
    incrementProductById,
  };
};
