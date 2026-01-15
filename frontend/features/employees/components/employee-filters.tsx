"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EmployeeFiltersValue } from "../types";

interface Props {
  value: EmployeeFiltersValue;
  onChange: (value: EmployeeFiltersValue) => void;
}

export default function EmployeeFilters({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Rol */}
      <div className="flex flex-col gap-1">
        <Label>Rol</Label>
        <Select
          value={value.role ?? "all"}
          onValueChange={(v) =>
            onChange({ ...value, role: v === "all" ? undefined : v })
          }
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="MANAGER">Manager</SelectItem>
            <SelectItem value="EMPLOYEE">Empleado</SelectItem>
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
    </div>
  );
}
