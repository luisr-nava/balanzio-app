import { TableColumn } from "@/components/table/types";
import { useCurrencyFormatter } from "@/src/hooks/useCurrencyFormatter";
import { formatDate } from "@/utils";
import { Supplier } from "../types";

export function useSupplierColumns(): TableColumn<Supplier>[] {
  const formatCurrency = useCurrencyFormatter(0);

  return [
    {
      header: "Nombre",
      cell: (e) => e.name,
      sortable: true,
      sortKey: (e) => e.name!,
    },
    {
      header: "Telefono",
      cell: (e) => e.phone || "Sin proveedor",
      sortable: true,
      sortKey: (e) => e.phone || "",
    },
    {
      header: "Email",
      cell: (e) => e.email,
      sortable: true,
      sortKey: (e) => e.email!,
    },
    {
      header: "Nombre del contacto",
      cell: (e) => e.contactName || "Sin nombre de contacto",
      sortable: true,
      sortKey: (e) => e.contactName!,
    },
  ];
}
