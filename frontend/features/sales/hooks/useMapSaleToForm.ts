import { Sale as SaleHistory } from "@/features/sales-history/types";
import { Sale as SaleEdit } from "../types";
import { SaleFormValues } from "./useSaleForm";

export const mapSaleToForm = (
  sale: SaleEdit | SaleHistory,
): SaleFormValues => {
  return {
    notes: sale.notes ?? "",
    paymentMethodId:
      "paymentMethodId" in sale ? sale.paymentMethodId ?? undefined : undefined,
    items: sale.items.map((item) => ({
      shopProductId:
        "shopProductId" in item ? item.shopProductId : item.shopProduct.id,
      productName:
        "productName" in item && typeof item.productName === "string"
          ? item.productName
          : item.shopProduct?.product?.name ?? "Producto",
      quantity: Number(item.quantity ?? 0),
      unitPrice:
        "unitPrice" in item && typeof item.unitPrice === "number"
          ? item.unitPrice
          : Number(item.shopProduct?.salePrice ?? 0),
      allowPriceOverride:
        "allowPriceOverride" in item &&
        typeof item.allowPriceOverride === "boolean"
          ? item.allowPriceOverride
          : item.shopProduct?.allowPriceOverride ?? false,
    })),
  };
};
