import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Expense } from "../../interfaces";
import type { PaymentMethod } from "@/app/(private)/settings/payment-method/interfaces";

export interface ExpenseFormValues {
  description: string;
  amount: number;
  date?: string;
  paymentMethodId: string;
  category?: string | null;
}

interface Props {
  onSubmit: (values: ExpenseFormValues) => void;
  isSubmitting: boolean;
  editingExpense?: Expense | null;
  onCancelEdit: () => void;
  paymentMethods?: PaymentMethod[];
  paymentMethodsLoading?: boolean;
  paymentMethodsFetching?: boolean;
}

const DEFAULT_VALUES: ExpenseFormValues = {
  description: "",
  amount: 0,
  date: "",
  paymentMethodId: "",
  category: "",
};

export const ExpenseForm = ({
  onSubmit,
  isSubmitting,
  editingExpense,
  onCancelEdit,
  paymentMethods = [],
  paymentMethodsLoading = false,
  paymentMethodsFetching = false,
}: Props) => {
  const form = useForm<ExpenseFormValues>({
    defaultValues: DEFAULT_VALUES,
  });
  const { errors } = form.formState;

  useEffect(() => {
    if (editingExpense) {
      form.reset({
        description: editingExpense.description || "",
        amount: editingExpense.amount,
        date: editingExpense.date
          ? editingExpense.date.split("T")[0]
          : "",
        paymentMethodId: editingExpense.paymentMethodId || "",
        category: editingExpense.category || "",
      });
    } else {
      form.reset(DEFAULT_VALUES);
    }
  }, [editingExpense, form]);

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit({
      ...values,
      amount: Number(values.amount),
      paymentMethodId: values.paymentMethodId.trim(),
      category: values.category?.trim() || null,
    });
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Input
            id="description"
            placeholder="Pago de alquiler"
            {...form.register("description", { required: true })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Monto</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0"
            {...form.register("amount", {
              valueAsNumber: true,
              required: "El monto es obligatorio",
              min: { value: 0.01, message: "Debe ser mayor a 0" },
            })}
          />
          {errors.amount && (
            <p className="text-xs text-destructive">
              {errors.amount.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">Fecha (opcional)</Label>
          <Input id="date" type="date" {...form.register("date")} />
          <p className="text-xs text-muted-foreground">
            Si dejas vacío se usará la fecha de hoy.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentMethodId">Método de pago</Label>
          <select
            id="paymentMethodId"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-70"
            disabled={paymentMethodsLoading}
            {...form.register("paymentMethodId", {
              required: "Selecciona un método de pago",
            })}>
            <option value="">
              {paymentMethodsLoading
                ? "Cargando métodos..."
                : "Selecciona un método"}
            </option>
            {paymentMethods.map((pm) => (
              <option key={pm.id} value={pm.id}>
                {pm.name} ({pm.code})
              </option>
            ))}
          </select>
          {errors.paymentMethodId && (
            <p className="text-xs text-destructive">
              {errors.paymentMethodId.message}
            </p>
          )}
          {paymentMethodsFetching && (
            <p className="text-xs text-muted-foreground">
              Actualizando métodos de pago...
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoría</Label>
        <Input
          id="category"
          placeholder="Categoría opcional"
          {...form.register("category")}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? editingExpense
              ? "Guardando..."
              : "Creando..."
            : editingExpense
            ? "Actualizar gasto"
            : "Crear gasto"}
        </Button>
        {editingExpense && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancelEdit}
            disabled={isSubmitting}>
            Cancelar edición
          </Button>
        )}
      </div>
    </form>
  );
};
