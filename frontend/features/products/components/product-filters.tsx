import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Supplier } from "@/features/suppliers/types";

export interface ProductFiltersValue {
  categoryId?: string;
  supplierId?: string;
  isActive?: boolean;
  lowStock?: boolean;
}

interface Props {
  value: ProductFiltersValue;
  onChange: (value: ProductFiltersValue) => void;
  suppliers: Supplier[];
}

export default function ProductFilters({ value, onChange, suppliers }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Proveedor */}
      <div className="flex flex-col gap-1">
        <Label>Proveedor</Label>
        <Select
          value={value.supplierId ?? "all"}
          onValueChange={(v) =>
            onChange({ ...value, supplierId: v === "all" ? undefined : v })
          }
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {suppliers.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Estado */}
      <div className="flex flex-col gap-1">
        <Label>Estado</Label>
        <Select
          value={
            value.isActive === undefined
              ? "all"
              : value.isActive
                ? "active"
                : "inactive"
          }
          onValueChange={(v) =>
            onChange({
              ...value,
              isActive: v === "all" ? undefined : v === "active" ? true : false,
            })
          }
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stock bajo */}
      <div className="flex h-10 items-center gap-2">
        <Checkbox
          checked={value.lowStock ?? false}
          onCheckedChange={(checked) =>
            onChange({
              ...value,
              lowStock: checked ? true : undefined,
            })
          }
        />
        <Label className="cursor-pointer">Stock bajo</Label>
      </div>
    </div>
  );
}
