"use client";

import { useAuth } from "@/features/auth/hooks";
import { useCashRegisterReports } from "@/features/cash-register/hooks/useReportsQuery";
import {
  ReportsFilters,
  ReportsResults,
} from "@/features/cash-register/components";
import { useCashRegisterReportFilters } from "@/features/cash-register/hooks/useCashRegisterReportFilters";

const MIN_REPORT_YEAR = 2020;

export default function CashRegisterReportsPage() {
  const { user } = useAuth();

  const openedByName = user?.fullName ?? "";

  const filters = useCashRegisterReportFilters();

  const { reports, message, isFetching, isLoading, isError, error } =
    useCashRegisterReports(filters.queryParams);

  return (
    <div className="space-y-4">
      <ReportsFilters
        {...filters.ui}
        minYear={MIN_REPORT_YEAR}
        isLoading={isLoading}
      />

      <ReportsResults
        reports={reports}
        openedByName={openedByName}
        message={message}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        error={error}
      />
    </div>
  );
}

