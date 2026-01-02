import React, { useState } from "react";
import { Product } from "../types";
import { Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCurrencyFormatter } from "@/src/hooks/useCurrencyFormatter";
import { Pagination } from "@/components/pagination";
import EmptyTable from "@/components/empty-table";

interface TableProductsProps {
  handleEdit: (product: Product) => void;
  limit: number;
  page: number;
  products: Product[];
  setLimit: (value: number) => void;
  setPage: (value: number) => void;
  isFetching: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function TableProducts({
  handleEdit,
  limit,
  page,
  products,
  setLimit,
  setPage,
  pagination,
  isFetching,
}: TableProductsProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const formatCurrency = useCurrencyFormatter();

  return (
    <Table className="overflow-hidden rounded-md border">
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Código</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Proveedor</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length === 0 ? (
          <EmptyTable title={"No hay productos cargados."} colSpan={5} />
        ) : (
          products.map((product) => {
            const isOpen = expandedRow === product.id;
            return (
              <React.Fragment key={product.id}>
                <TableRow
                  key={product.id}
                  className="cursor-pointer"
                  onClick={() => setExpandedRow(isOpen ? null : product.id)}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.barcode}</TableCell>
                  <TableCell>{product.stock} unidades</TableCell>
                  <TableCell>{formatCurrency(product.salePrice)}</TableCell>
                  <TableCell>
                    {product.supplierName || "Sin proveedor"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        product.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-100"
                      }>
                      {product.isActive ? "Activo" : "Desactivado"}
                    </Badge>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="icon"
                      variant="outline"
                      className="text-primary border-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(product);
                      }}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                {isOpen && (
                  <TableRow className="bg-muted/40">
                    <TableCell colSpan={7} className="p-0">
                      <div className="grid grid-cols-2 gap-4 p-4 text-sm">
                        <div className="space-y-2">
                          <p className="text-muted-foreground">Descripción:</p>
                          <p className="font-medium text-right sm:text-left">
                            {product.description || "Sin descripción"}
                          </p>
                          <div>
                            <p className="text-muted-foreground">
                              Código de barras:
                            </p>
                            <p className="font-medium text-right sm:text-left">
                              {product.barcode || "No asignado"}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Proveedor:</p>
                            <p className="font-medium text-right sm:text-left">
                              {product.supplierName || "Sin proveedor"}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-muted-foreground">
                              Precio de costo:
                            </p>
                            <p className="font-medium text-right sm:text-left">
                              {formatCurrency(product.costPrice)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Precio de venta:
                            </p>
                            <p className="font-medium text-right sm:text-left">
                              {formatCurrency(product.salePrice)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Stock actual:
                            </p>
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
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell
            colSpan={7}
            className="text-center text-sm text-muted-foreground">
            <Pagination
              page={page}
              totalPages={pagination?.totalPages ?? 1}
              limit={limit}
              onPageChange={(nextPage) => {
                if (nextPage < 1) return;
                setPage(nextPage);
              }}
              onLimitChange={(nextLimit) => setLimit(nextLimit)}
              isLoading={isFetching}
              totalItems={pagination?.total ?? 0}
            />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

