import { TableColumn } from "@/components/table/types";
import { PaymentMethod } from "../types";

export function usePaymentMethodColumns(): TableColumn<PaymentMethod>[] {
  return [
    {
      header: "Nombre",
      cell: (e) => e.name,
      sortable: true,
      sortKey: (e) => e.name,
    },
    {
      header: "Codigo",
      cell: (e) => e.code,
      sortable: true,
      sortKey: (e) => e.code,
      align: "center",
    },
    {
      header: "Descripción",
      cell: (e) => e.description,
      sortable: true,
      sortKey: (e) => e.description || "Sin descripcion",
      align: "center",
    },
    {
      header: "Estado",
      cell: (e) => (e.isActive ? "Activado" : "Desactivado"),
      sortable: true,
      sortKey: (e) => (e.isActive ? 1 : 0),
      align: "center",
    },
  ];
}
