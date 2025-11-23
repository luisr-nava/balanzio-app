import { useState } from "react";
import { Product } from "../interfaces";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Edit3 } from "lucide-react";
import { expandableRowVariants } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  products: Product[];
  handleEdit: (product: Product) => void;
}

export const TableProducts = ({
  products,
  handleEdit,
}: Props) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  return (
    <div className="overflow-hidden rounded-md border">
      <div className="hidden sm:grid grid-cols-7 bg-muted px-4 py-2 text-sm font-semibold">
        <span>Nombre</span>
        <span className="text-center">Código</span>
        <span className="text-center">Stock</span>
        <span className="text-center">Precio venta</span>
        <span className="text-center">Proveedor</span>
        <span className="text-center">Estado</span>
        <span className="text-right">Acción</span>
      </div>
      <div className="divide-y">
        {products.map((product) => {
          const isOpen = expandedRow === product.id;
          const providerName = product.supplierName || "Sin proveedor";
          const statusLabel = product.isActive ? "Activo" : "Desactivado";
          const statusClass = product.isActive
            ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-100"
            : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-100";
          return (
            <div
              key={product.id}
              className={`last:border-b-0 ${
                product.isActive ? "" : "bg-muted/50 text-muted-foreground"
              }`}>
              <motion.div
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.995 }}
                className={`w-full text-left transition-colors px-4 py-3 grid grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-7 sm:items-center ${
                  isOpen ? "bg-muted/50" : ""
                }`}
                role="button"
                tabIndex={0}
                onClick={() => setExpandedRow(isOpen ? null : product.id)}>
                <div className="sm:col-span-1 flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-medium line-clamp-1 flex items-center gap-2">
                      {product.name}
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}>
                        <ChevronDown className="h-4 w-4 text-primary" />
                      </motion.div>
                    </span>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {product.barcode || "—"}
                    </span>
                  </div>
                </div>
                <span className="hidden sm:block text-sm text-muted-foreground text-center">
                  {product.barcode || "—"}
                </span>
                <span
                  className={`hidden sm:block text-center text-sm sm:text-base ${
                    product.stock <= 10 ? "font-semibold text-destructive" : ""
                  }`}>
                  {product.stock}
                </span>
                <span className="font-semibold sm:text-center text-right text-lg sm:text-base">
                  ${product.salePrice.toLocaleString("es-AR")}
                </span>
                <span className="hidden sm:flex items-center justify-center text-sm text-muted-foreground truncate">
                  <span className="truncate text-center">{providerName}</span>
                </span>
                <div className="hidden sm:flex justify-center">
                  <Badge className={statusClass}>{statusLabel}</Badge>
                </div>
                <div className="hidden sm:flex justify-end">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(product);
                    }}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="sm:hidden col-span-2 flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span
                    className={
                      product.stock <= 10 ? "font-semibold text-destructive" : ""
                    }>
                    Stock: {product.stock}
                  </span>
                  <span>Precio: ${product.salePrice.toLocaleString("es-AR")}</span>
                </div>
                <div className="sm:hidden col-span-2 flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {providerName}
                    </span>
                    <Badge className={`${statusClass} text-[11px]`}>
                      {statusLabel}
                    </Badge>
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(product);
                    }}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    variants={expandableRowVariants}
                    className="overflow-hidden">
                    <div className="space-y-3 bg-muted/40 px-4 py-3 text-sm">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between sm:flex-col sm:items-start sm:gap-1">
                            <span className="text-muted-foreground">
                              Descripción:
                            </span>
                            <p className="font-medium text-right sm:text-left">
                              {product.description || "Sin descripción"}
                            </p>
                          </div>
                          <div className="flex items-start justify-between sm:flex-col sm:items-start sm:gap-1">
                            <span className="text-muted-foreground">
                              Código de barras:
                            </span>
                            <p className="font-medium text-right sm:text-left">
                              {product.barcode || "No asignado"}
                            </p>
                          </div>
                          <div className="flex items-start justify-between sm:flex-col sm:items-start sm:gap-1">
                            <span className="text-muted-foreground">
                              Proveedor:
                            </span>
                            <p className="font-medium text-right sm:text-left">
                              {providerName}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start justify-between sm:flex-col sm:items-start sm:gap-1">
                            <span className="text-muted-foreground">
                              Precio de costo:
                            </span>
                            <p className="font-medium text-right sm:text-left">
                              ${product.costPrice?.toLocaleString("es-AR") || 0}
                            </p>
                          </div>
                          <div className="flex items-start justify-between sm:flex-col sm:items-start sm:gap-1">
                            <span className="text-muted-foreground">
                              Precio de venta:
                            </span>
                            <p className="font-medium text-right sm:text-left">
                              ${product.salePrice.toLocaleString("es-AR")}
                            </p>
                          </div>
                          <div className="flex items-start justify-between sm:flex-col sm:items-start sm:gap-1">
                            <span className="text-muted-foreground">
                              Stock actual:
                            </span>
                            <p
                              className={`font-medium text-right sm:text-left ${
                                product.stock <= 10 ? "text-destructive" : ""
                              }`}>
                              {product.stock} unidades
                              {product.stock <= 10 && " ⚠️"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
