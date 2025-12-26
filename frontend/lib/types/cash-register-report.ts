export type PeriodFilter = "day" | "week" | "month" | "year";
export type CashRegisterReportPeriod = PeriodFilter;

export interface CashRegisterReport {
  id: string;
  cashRegisterId: string;
  shopName: string;
  openedAt: string;
  closedAt: string;
  openingAmount: number;
  actualAmount: number;
  difference: number;
}

export interface CashRegisterReportsApiResponse {
  data: CashRegisterReport[];
  message?: string;
}
