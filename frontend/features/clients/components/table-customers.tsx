import React, { useState } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Customer } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyTable from "@/components/empty-table";
import { useCurrencyFormatter } from "@/src/hooks/useCurrencyFormatter";
import { Pagination } from "@/components/pagination";
interface Props {
  handleEdit: (customer: Customer) => void;
  limit: number;
  page: number;
  customers: Customer[];
  setLimit: (value: number) => void;
  setPage: (value: number) => void;
  isFetching: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  handleDelete: (customer: Customer) => void;
}

export default function TableCustomers({
  handleEdit,
  limit,
  page,
  customers,
  setLimit,
  setPage,
  pagination,
  isFetching,
  handleDelete,
}: Props) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const formatCurrency = useCurrencyFormatter();
  return (
    <Table className="overflow-hidden rounded-md border">
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead className="text-right">Acción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.length === 0 ? (
          <EmptyTable title="No hay clientes cargados." colSpan={5}/>
        ) : (
          customers.map((customer) => {
            const isOpen = expandedRow === customer.id;
            return (
              <React.Fragment key={customer.id}>
                <TableRow
                  onClick={() => setExpandedRow(isOpen ? null : customer.id)}>
                  <TableCell>{customer.fullName}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell align="right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="icon"
                        variant="outline"
                        className="text-primary border-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(customer);
                        }}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="text-red-500 border-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(customer);
                        }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {isOpen && (
                  <TableRow className="bg-muted/40">
                    <TableCell colSpan={7} className="p-0">
                      <div className="grid grid-cols-2 gap-4 p-4 text-sm">
                        <div className="space-y-2">
                          <p className="text-muted-foreground">Direccion:</p>
                          <p className="font-medium text-right sm:text-left">
                            {customer.address || "Sin Direccion"}
                          </p>
                          <div>
                            <p className="text-muted-foreground">
                              Limite de Crédito:
                            </p>
                            <p className="font-medium text-right sm:text-left">
                              {formatCurrency(customer.creditLimit)}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-muted-foreground">
                              Estado actual:
                            </p>
                            <p className="font-medium text-right sm:text-left">
                              {formatCurrency(customer.currentBalance)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Notas:</p>
                            <p className="font-medium text-right sm:text-left">
                              {customer.notes || "Sin notas"}
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

