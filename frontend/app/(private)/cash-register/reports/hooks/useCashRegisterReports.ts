"use client";

import { useQuery } from "@tanstack/react-query";

import { cashRegisterApi } from "@/lib/api/cash-register.api";
import type {
  CashRegisterReport,
  PeriodFilter,
} from "@/lib/types/cash-register-report";

interface UseCashRegisterReportsParams {
  period: PeriodFilter;
}

interface UseCashRegisterReportsResult {
  reports: CashRegisterReport[];
  isFetching: boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export function useCashRegisterReports({
  period,
}: UseCashRegisterReportsParams): UseCashRegisterReportsResult {
  const query = useQuery({
    queryKey: ["cash-register-reports", period],
    queryFn: () => cashRegisterApi.getReports(period),
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });

  return {
    reports: query.data ?? [],
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
