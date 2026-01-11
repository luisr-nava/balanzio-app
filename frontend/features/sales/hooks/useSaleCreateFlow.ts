import { toast } from "sonner";
import type { UseFormReturn } from "react-hook-form";
import { useSaleCreateMutation } from "./useSaleCreateMutation";
import { useShopStore } from "@/features/shop/shop.store";
import { CreateSaleDto } from "../types";
import { SaleFormValues } from "./useSaleForm";

export const useSaleCreateFlow = (form: UseFormReturn<SaleFormValues>) => {
  const values = form.getValues();
  const { activeShopId } = useShopStore();
  const createSale = useSaleCreateMutation();

  const submitSale = () => {
    if (!activeShopId) return;

    const values = form.getValues();

    if (!values.items || values.items.length === 0) {
      toast.error("Agregá al menos un producto");
      return;
    }
    if (!values.paymentMethodId) {
      toast.error("Seleccioná un método de pago");
      return;
    }

    const payload: CreateSaleDto = {
      shopId: activeShopId,
      paymentMethodId: values.paymentMethodId,
      notes: values.notes || undefined,
      items: values.items.map((item) => ({
        shopProductId: item.shopProductId,
        quantity: item.quantity,
      })),
    };

    createSale.mutate(payload, {
      onSuccess: () => {
        toast.success("Venta registrada");
        form.reset();
      },
      onError: () => {
        toast.error("No se pudo registrar la venta");
      },
    });
  };

  return {
    submitSale,
    isSubmitting: createSale.isPending,
  };
};
