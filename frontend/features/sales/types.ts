import { PaymentMethod } from "@/app/(protected)/settings/payment-method/interfaces";
import { Product } from "../products/types";

export interface SaleItem {
  id?: string;
  shopProductId: string;
  productName?: string;
  quantity: number;
}

export interface Sale {
  id: string;
  shopId: string;
  notes?: string | null;
  total: number;
  items: SaleItem[];
  createdAt?: string;
  updatedAt?: string;
}
export interface CreateSaleItemDto {
  shopProductId: string;
  quantity: number;
}
export interface CreateSaleDto {
  shopId: string;
  customerId?: string;
  paymentMethodId?: string;
  discountAmount?: number;
  notes?: string;
  invoiceType?: "TICKET" | "FACTURA_A" | "FACTURA_B";
  invoiceNumber?: string;
  items: CreateSaleItemDto[];
}

export interface CreateSaleResponse {
  message: string;
  data: Sale;
}



export type CartUI = {
  items: SaleItem[];
  products: Product[];
  totalItems: number;
  totalAmount: number;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clear: () => void;
};

export type CheckoutUI = {
  canSubmit: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  paymentMethods: PaymentMethod[];
};
