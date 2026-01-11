import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { X } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import ProductCardContent from "./product-card-content";
import { CartUI, CheckoutUI } from "../types";
import { useCurrencyFormatter } from "@/src/hooks/useCurrencyFormatter";

interface Props {
  checkout: CheckoutUI;
  children: React.ReactNode;
  cart: CartUI;
}
export default function MobileCheckoutBar({ checkout, children, cart }: Props) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const formatCurrency = useCurrencyFormatter();
  return (
    <Drawer open={isCartOpen} onOpenChange={setIsCartOpen}>
      <div className="lg:hidden">
        <div className="fixed right-4 bottom-4 left-4 z-40">
          <div className="bg-background/95 flex items-center gap-3 rounded-full border px-4 py-3 shadow-lg backdrop-blur">
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">Carrito</p>
              <p className="truncate font-semibold">
                {cart.totalItems} ítems · {formatCurrency(cart.totalAmount)}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <DrawerTrigger asChild>
                <Button size="sm" variant="outline">
                  Ver
                </Button>
              </DrawerTrigger>
              <Button
                size="sm"
                onClick={() => {
                  checkout.onSubmit();
                  setIsCartOpen(false);
                }}
                disabled={!checkout.canSubmit}
              >
                {checkout.isSubmitting ? "Guardando..." : "Cobrar"}
              </Button>
            </div>
          </div>
        </div>

        <DrawerContent className="pb-6">
          <DrawerHeader className="relative flex flex-col items-center gap-1 pb-2">
            <DrawerClose asChild>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Cerrar carrito"
                className="absolute top-2 right-2"
              >
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
            <DrawerTitle>Carrito</DrawerTitle>
            <DrawerDescription>
              Revisa tu carrito antes de cobrar.
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-4 px-4 pb-2">{children}</div>
        </DrawerContent>
      </div>
    </Drawer>
  );
}
