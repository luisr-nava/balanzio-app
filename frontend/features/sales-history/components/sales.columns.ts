import { TableColumn } from "@/components/table/types";

import { useCurrencyFormatter } from "@/src/hooks/useCurrencyFormatter";
import { formatDate } from "@/utils";
import { SaleHistory } from "../types";

export function useSaleColumns(): TableColumn<SaleHistory>[] {
  const formatCurrency = useCurrencyFormatter(0);

  return [
    {
      header: "Fecha",
      cell: (e) => formatDate(e.saleDate),
      sortable: true,
      sortKey: (e) => e.saleDate,
    },
    {
      header: "Total de Items",
      cell: (e) => e.items.length,
      sortable: true,
    },
    {
      header: "Etado",
      cell: (e) => e.paymentStatus,
      sortable: true,
      sortKey: (e) => e.paymentStatus,
    },
    {
      header: "Total",
      cell: (e) => formatCurrency(e.totalAmount!),
      sortable: true,
      sortKey: (e) => e.totalAmount!,
    },
  ];
}
