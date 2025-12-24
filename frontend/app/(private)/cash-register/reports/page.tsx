"use client";

import { useState } from "react";

import { ReportsHeader } from "./components/ReportsHeader";
import { ReportsTable } from "./components/ReportsTable";
import { useCashRegisterReports } from "./hooks/useCashRegisterReports";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/app/(auth)/hooks";
import type { PeriodFilter } from "@/lib/types/cash-register-report";

const periodOptions: Array<{ value: PeriodFilter; label: string }> = [
  { value: "day", label: "Día" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mes" },
  { value: "year", label: "Año" },
];

const DEFAULT_PERIOD: PeriodFilter = "day";

export default function CashRegisterReportsPage() {
  const [period, setPeriod] = useState<PeriodFilter>(DEFAULT_PERIOD);
  const { reports, isFetching, isLoading, isError, error } =
    useCashRegisterReports({ period });
  const { user } = useAuth();
  const openedByName = user?.fullName ?? "";

  return (
    <div className="space-y-6">
      <ReportsHeader />

      <Card className="rounded-3xl border border-border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold">
            Filtrar período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-[240px_1fr]">
            <div className="space-y-2">
              <Label>Período</Label>
              <Select
                value={period}
                onValueChange={(value) => setPeriod(value as PeriodFilter)}
                aria-label="Seleccionar período"
                disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un período" />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isError && (
        <Alert variant="destructive">
          <AlertTitle>Error al cargar reportes</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "No pudimos obtener los reportes de caja."}
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <ReportsTableSkeleton />
      ) : (
        <ReportsTable
          reports={reports}
          openedByName={openedByName}
          isFetching={isFetching}
        />
      )}
    </div>
  );
}

function ReportsTableSkeleton() {
  return (
    <div className="space-y-3 rounded-3xl border border-border bg-card p-6 shadow-sm">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-12 rounded-xl bg-muted/70 animate-pulse" />
      ))}
    </div>
  );
}
