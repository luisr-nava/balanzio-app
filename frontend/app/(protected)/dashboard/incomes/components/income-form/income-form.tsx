import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PaymentMethod } from "@/app/(protected)/settings/payment-method/interfaces";
import { cn } from "@/lib/utils";
import type { Income } from "../../interfaces";

export interface IncomeFormValues {
  description: string;
  amount: number | undefined;
  date?: string;
  paymentMethodId: string;
}

interface Props {
  onSubmit: (values: IncomeFormValues) => void;
  isSubmitting: boolean;
  editingIncome?: Income | null;
  onCancelEdit: () => void;
  paymentMethods?: PaymentMethod[];
  paymentMethodsLoading?: boolean;
  paymentMethodsFetching?: boolean;
}

const DEFAULT_VALUES: IncomeFormValues = {
  description: "",
  amount: undefined,
  date: "",
  paymentMethodId: "",
};

export const IncomeForm = ({
  onSubmit,
  isSubmitting,
  editingIncome,
  onCancelEdit,
  paymentMethods = [],
  paymentMethodsLoading = false,
  paymentMethodsFetching = false,
}: Props) => {
  const form = useForm<IncomeFormValues>({
    defaultValues: DEFAULT_VALUES,
  });
  const { errors } = form.formState;

  useEffect(() => {
    if (editingIncome) {
      form.reset({
        description: editingIncome.description || "",
        amount: editingIncome.amount,
        date: editingIncome.date ? editingIncome.date.split("T")[0] : "",
        paymentMethodId: editingIncome.paymentMethodId || "",
      });
    } else {
      form.reset(DEFAULT_VALUES);
    }
  }, [editingIncome, form]);

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit({
      ...values,
      amount: Number(values.amount),
      paymentMethodId: values.paymentMethodId.trim(),
    });
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="description">
            Descripción <span className="text-destructive">*</span>
          </Label>
          <Input
            id="description"
            placeholder="Venta online"
            className={cn(
              errors.description &&
                "border-destructive focus-visible:ring-destructive",
            )}
            aria-invalid={Boolean(errors.description)}
            {...form.register("description", {
              required: "La descripción es obligatoria",
            })}
          />
          {errors.description && (
            <p className="text-xs text-destructive">
              {errors.description.message?.toString()}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">
            Monto <span className="text-destructive">*</span>
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0"
            className={cn(
              errors.amount &&
                "border-destructive focus-visible:ring-destructive",
            )}
            aria-invalid={Boolean(errors.amount)}
            {...form.register("amount", {
              valueAsNumber: true,
              required: "El monto es obligatorio",
              min: {
                value: 0.01,
                message: "El monto debe ser mayor o igual a 0.01",
              },
            })}
          />
          {errors.amount && (
            <p className="text-xs text-destructive">{errors.amount.message}</p>
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
          <Label htmlFor="paymentMethodId">
            Método de pago <span className="text-destructive">*</span>
          </Label>
          <select
            id="paymentMethodId"
            className={cn(
              "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-70",
              errors.paymentMethodId &&
                "border-destructive focus-visible:ring-destructive",
            )}
            aria-invalid={Boolean(errors.paymentMethodId)}
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

      <div className="flex flex-wrap justify-end gap-2">
        {editingIncome && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancelEdit}
            disabled={isSubmitting}>
            Cancelar edición
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? editingIncome
              ? "Guardando..."
              : "Creando..."
            : editingIncome
            ? "Actualizar ingreso"
            : "Crear ingreso"}
        </Button>
      </div>
    </form>
  );
};

