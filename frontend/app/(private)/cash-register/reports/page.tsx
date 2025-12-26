"use client";

import { useMemo, useState } from "react";

import { ReportsHeader } from "./components/ReportsHeader";
import { ReportsFilters } from "./components/ReportsFilters";
import { ReportsTable } from "./components/ReportsTable";
import { useCashRegisterReports } from "./hooks/useCashRegisterReports";
import type { CashRegisterReportsQueryParams } from "./hooks/useCashRegisterReports";
import type { DateRangeValue } from "@/components/ui/date-range-picker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/app/(auth)/hooks";
import { formatIsoDate } from "@/lib/date-utils";
import type { PeriodFilter } from "./types/cash-register-report";

const MIN_REPORT_YEAR = 2020;
const DEFAULT_PERIOD: PeriodFilter = "day";

export default function CashRegisterReportsPage() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const { user } = useAuth();

  const openedByName = user?.fullName ?? "";
  const [period, setPeriod] = useState<PeriodFilter>(DEFAULT_PERIOD);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(() => new Date());
  const [weekRange, setWeekRange] = useState<DateRangeValue>({});
  const [monthSelection, setMonthSelection] = useState({
    month: currentMonth,
    year: currentYear,
  });
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const normalizedRange = useMemo<DateRangeValue>(() => {
    const { from, to } = weekRange;
    if (from && to && from > to) {
      return { from: to, to: from };
    }
    return { from, to };
  }, [weekRange]);

  const queryParams = useMemo<CashRegisterReportsQueryParams>(() => {
    const params: CashRegisterReportsQueryParams = { period };

    if (period === "day" && selectedDay) {
      params.date = formatIsoDate(selectedDay);
    }

    if (period === "week") {
      if (normalizedRange.from) {
        params.dateFrom = formatIsoDate(normalizedRange.from);
      }
      if (normalizedRange.to) {
        params.dateTo = formatIsoDate(normalizedRange.to);
      }
    }

    if (period === "month") {
      params.month = String(monthSelection.month).padStart(2, "0");
      params.year = String(monthSelection.year);
    }

    if (period === "year") {
      params.year = String(selectedYear);
    }

    return params;
  }, [period, selectedDay, normalizedRange, monthSelection, selectedYear]);

  const { reports, message, isFetching, isLoading, isError, error } =
    useCashRegisterReports(queryParams);

  return (
    <div className="space-y-6">
      <ReportsHeader />

      <ReportsFilters
        period={period}
        onPeriodChange={setPeriod}
        dayValue={selectedDay}
        onDayChange={setSelectedDay}
        weekRangeValue={normalizedRange}
        onWeekRangeChange={setWeekRange}
        monthValue={monthSelection.month}
        onMonthChange={(month) =>
          setMonthSelection((prev) => ({
            ...prev,
            month,
          }))
        }
        monthYearValue={monthSelection.year}
        onMonthYearChange={(year) =>
          setMonthSelection((prev) => ({
            month:
              year === currentYear
                ? Math.min(prev.month, currentMonth)
                : prev.month,
            year,
          }))
        }
        yearValue={selectedYear}
        onYearChange={setSelectedYear}
        currentYear={currentYear}
        currentMonth={currentMonth}
        minYear={MIN_REPORT_YEAR}
        isLoading={isLoading}
      />

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
          emptyMessage={message}
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
