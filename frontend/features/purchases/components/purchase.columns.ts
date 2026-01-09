import { TableColumn } from "@/components/table/types";
import { Purchase } from "@/features/purchases/types";

import { useCurrencyFormatter } from "@/src/hooks/useCurrencyFormatter";
import { formatDate } from "@/utils";

export function usePurchaseColumns(): TableColumn<Purchase>[] {
  // const formatCurrency = useCurrencyFormatter(0);

  return [
    {
      header: "#",
      cell: (e, index) => index! + 1,
      sortable: false,
    },
    {
      header: "Proveedor",
      cell: (e) => e.supplierId,
      sortable: true,
      sortKey: (e) => e.supplierId || "Sin proveedor",
    },
    {
      header: "Fecha",
      cell: (e) => formatDate(e.purchaseDate!),
      sortable: true,
      sortKey: (e) => e.purchaseDate!,
    },
    {
      header: "Total de Items",
      cell: (e) => e.itemsCount,
      sortable: true,
      sortKey: (e) => e.itemsCount!,
    },
  ];
}
