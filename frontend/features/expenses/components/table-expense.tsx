import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2 } from "lucide-react";
import type { Expense } from "../types";
import type { PaymentMethod } from "@/app/(protected)/settings/payment-method/interfaces";
import { Pagination } from "@/components/pagination";
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

interface Props {
  handleEdit: (expense: Expense) => void;
  handleDelete: (expense: Expense) => void;
  limit: number;
  page: number;
  expenses: Expense[];
  setLimit: (value: number) => void;
  setPage: (value: number) => void;
  isFetching: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  paymentMethods?: PaymentMethod[];
}

export default function TableExpense({
  handleEdit,
  handleDelete,
  limit,
  page,
  expenses,
  setLimit,
  setPage,
  isFetching,
  pagination,
  paymentMethods = [],
}: Props) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  return (
    <Table className="overflow-hidden rounded-md border">
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead>Descripción</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Monto</TableHead>
          <TableHead className="text-right">Acción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.length === 0 ? (
          <EmptyTable title="No hay gastos cargados." colSpan={4} />
        ) : (
          expenses.map((expense, index) => {
            const isOpen = expandedRow === expense.id;
            const isLastRow = index === expenses.length - 1;
            const paymentMethodName =
              expense.paymentMethod?.name ||
              paymentMethods.find((pm) => pm.id === expense.paymentMethodId)
                ?.name ||
              "Método no disponible";

            return (
              <React.Fragment key={expense.id}>
                <TableRow
                  onClick={() => setExpandedRow(isOpen ? null : expense.id)}>
                  <TableCell align="right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="icon"
                        variant="outline"
                        className="text-primary border-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(expense);
                        }}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="text-red-500 border-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(expense);
                        }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
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

