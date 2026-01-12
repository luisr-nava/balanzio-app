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
      quantity: item.quantity,
    })),
  };
};
