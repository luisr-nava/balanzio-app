import { Product } from "@/features/products/types";
import { Purchase } from "../types";
import { useCurrencyFormatter } from "@/src/hooks/useCurrencyFormatter";
import { Supplier } from "@/features/suppliers/types";
import { Separator } from "@/components/ui/separator";
import { PaymentMethod } from "@/app/(protected)/settings/payment-method/interfaces";

interface PurchaseExpandedProps {
  purchase: Purchase;
  products: Product[];
  suppliers: Supplier[];
  paymentMethods: PaymentMethod[];
}

export default function PurchaseExpanded({
  purchase,
  products,
  suppliers,
  paymentMethods,
}: PurchaseExpandedProps) {
  const getProductName = (productId: string) =>
    products.find((p) => p.id === productId)?.name;
  const getPaymenthodName = (paymethodId?: string) =>
    paymentMethods?.find((p) => p.id === paymethodId)?.name ?? "—";
  const formatCurrency = useCurrencyFormatter();
  return (
    <div className="gap-4 p-4 text-sm">
      <div className="col-span-2 pt-2">
        <p className="text-muted-foreground mb-2">Detalle de la compra</p>

        <Separator />
        <div className="space-y-2">
          {purchase.items.map((item, index) => (
            <div
              key={item.shopProductId + item.unitCost}
              className="flex justify-between rounded-md px-3 py-2"
            >
              <div className="flex gap-2">
                <p>#{index + 1}</p>
                <p className="font-medium">
                  Producto: {getProductName(item.shopProductId)}
                </p>
              </div>
              <p>Cantidad: {item.quantity}</p>
              <p className="text-muted-foreground">
                Precio por cantidad: {formatCurrency(item.unitCost!)}
              </p>
              <div className="font-medium">
                SubTotal: {formatCurrency(item.subtotal)}
              </div>
            </div>
          ))}
          <Separator />
          <div className="flex justify-end px-3 pt-2">
            <div className="flex items-center gap-3 text-right">
              <p className="text-muted-foreground">Total</p>
              <p className="text-base font-semibold">
                {formatCurrency(purchase.totalAmount ?? 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 text-sm">
        <div>
          <p className="text-muted-foreground">Medio de pago</p>
          <p className="font-medium">
            {getPaymenthodName(purchase.paymentMethodId!)}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground">Notas</p>
          <p className="font-medium">{purchase.notes || "Sin notas"}</p>
        </div>
      </div>
    </div>
  );
}
