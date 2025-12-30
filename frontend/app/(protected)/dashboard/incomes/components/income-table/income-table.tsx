import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { expandableRowVariants } from "@/lib/animations";
import { Calendar, CreditCard, FileText } from "lucide-react";
import type { Income } from "../../interfaces";
import type { PaymentMethod } from "@/app/(protected)/settings/payment-method/interfaces";

interface Props {
  incomes: Income[];
  isLoading: boolean;
  isFetching: boolean;
  onEdit: (income: Income) => void;
  onDelete: (income: Income) => void;
  deletingId?: string | null;
  paymentMethods?: PaymentMethod[];
}

export const IncomeTable = ({
  incomes,
  isLoading,
  isFetching,
  onEdit,
  onDelete,
  deletingId,
  paymentMethods = [],
}: Props) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(value || 0);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        Cargando ingresos...
      </div>
    );
  }

  if (!incomes.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay ingresos registrados en esta tienda.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="hidden sm:grid grid-cols-4 bg-muted px-4 py-2 text-sm font-semibold">
        <span>Descripción</span>
        <span className="text-center">Fecha</span>
        <span className="text-center">Monto</span>
        <span className="text-right">Acción</span>
      </div>
      <div className="divide-y">
        {incomes.map((income, index) => {
          const isOpen = expandedRow === income.id;
          const isLastRow = index === incomes.length - 1;
          const paymentMethodName =
            income.paymentMethod?.name ||
            paymentMethods.find((pm) => pm.id === income.paymentMethodId)
              ?.name ||
            "Método no disponible";

          return (
            <div key={income.id} className="last:border-b-0">
              <motion.div
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.995 }}
                className={`w-full text-left transition-colors px-4 py-3 grid grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-4 sm:items-center ${
                  isOpen ? "bg-muted/50" : ""
                }`}
                role="button"
                tabIndex={0}
                onClick={() => setExpandedRow(isOpen ? null : income.id)}>
                <div className="sm:col-span-1 flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-medium line-clamp-1 flex items-center gap-2">
                      {income.description}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center justify-center text-sm text-muted-foreground">
                  <span className="truncate">
                    {income.date
                      ? new Date(income.date).toLocaleDateString()
                      : "Sin fecha"}
                  </span>
                </div>
                <div className="hidden sm:flex items-center justify-center text-sm font-semibold">
                  {formatCurrency(income.amount || 0)}
                </div>
                <div className="hidden sm:flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(income);
                    }}>
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="ml-2"
                    disabled={deletingId === income.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(income);
                    }}>
                    {deletingId === income.id ? "Eliminando..." : "Eliminar"}
                  </Button>
                </div>
                <div className="sm:hidden col-span-2 flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span>
                    {income.date
                      ? new Date(income.date).toLocaleDateString()
                      : "Sin fecha"}
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(income.amount || 0)}
                  </span>
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
                            <span className="text-muted-foreground flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Descripción:
                            </span>
                            <p className="font-medium text-right sm:text-left">
                              {income.description}
                            </p>
                          </div>
                          <div className="flex items-start justify-between sm:flex-col sm:items-start sm:gap-1">
                            <span className="text-muted-foreground flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Fecha:
                            </span>
                            <p className="font-medium text-right sm:text-left">
                              {income.date
                                ? new Date(income.date).toLocaleDateString()
                                : "Sin fecha"}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start justify-between sm:flex-col sm:items-start sm:gap-1">
                            <span className="text-muted-foreground flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Método de pago:
                            </span>
                            <p className="font-medium text-right sm:text-left">
                              {paymentMethodName}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 sm:hidden">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(income);
                          }}>
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={deletingId === income.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(income);
                          }}>
                          {deletingId === income.id
                            ? "Eliminando..."
                            : "Eliminar"}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {!isLastRow && <div className="border-b sm:hidden" />}
            </div>
          );
        })}
      </div>
      {isFetching && (
        <div className="flex items-center gap-2 border-t px-4 py-3 text-xs text-muted-foreground">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Actualizando lista...
        </div>
      )}
    </div>
  );
};

