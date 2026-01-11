import { useForm } from "react-hook-form";
export interface SaleFormValues {
  customerId?: string;
  paymentMethodId?: string;
  notes?: string;
  discountAmount?: number;
  invoiceType?: "TICKET" | "FACTURA_A" | "FACTURA_B";
  invoiceNumber?: string;

  items: {
    shopProductId: string;
    quantity: number;
  }[];
}
export const useSaleForm = () =>
  useForm<SaleFormValues>({
    mode: "onChange",
    defaultValues: {
      notes: "",
      paymentMethodId: undefined,
      items: [],
    },
  });
