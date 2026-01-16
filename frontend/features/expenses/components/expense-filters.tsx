import { Button } from "@/components/ui/button";
import { ExpenseFiltersValue } from "../types";
import { PaymentMethod } from "@/features/settings/configuration/panels/resources/payment-methods/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  value: ExpenseFiltersValue;
  onChange: (value: ExpenseFiltersValue) => void;
  paymentMethods: PaymentMethod[];
}

export default function ExpenseFilters({
  value,
  onChange,
  paymentMethods,
}: Props) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <Select
        value={value.paymentMethodId ?? "all"}
        onValueChange={(val) =>
          onChange({
            ...value,
            paymentMethodId: val === "all" ? undefined : val,
          })
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Medio de pago" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {paymentMethods.map((pm) => (
            <SelectItem key={pm.id} value={pm.id}>
              {pm.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Desde */}
      <div className="flex flex-col gap-1">
        <Label>Desde</Label>
        <Input
          type="date"
          value={value.startDate ?? ""}
          onChange={(e) =>
            onChange({
              ...value,
              startDate: e.target.value || undefined,
            })
          }
        />
      </div>

      {/* Hasta */}
      <div className="flex flex-col gap-1">
        <Label>Hasta</Label>
        <Input
          type="date"
          value={value.endDate ?? ""}
          onChange={(e) =>
            onChange({
              ...value,
              endDate: e.target.value || undefined,
            })
          }
        />
      </div>
    </div>
  );
}
