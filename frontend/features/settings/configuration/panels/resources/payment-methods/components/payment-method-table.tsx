import { Button } from "@/components/ui/button";
import { Edit3, Trash2 } from "lucide-react";
import { PaymentMethod } from "../types";
import { BaseTable } from "@/components/table/BaseTable";
import { usePaymentMethodColumns } from "./payment-method.columns";

interface Props {
  paymentMethods: PaymentMethod[];
  loading: boolean;
  onEdit: (pm: PaymentMethod) => void;
  onDelete: (pm: PaymentMethod) => void;
  deletingId?: string | null;
}

export const PaymentMethodTable = ({
  paymentMethods,
  loading,
  onEdit,
  onDelete,
  deletingId,
}: Props) => {
  if (!paymentMethods.length) {
    return (
      <p className="text-muted-foreground text-sm">
        No hay métodos de pago registrados.
      </p>
    );
  }
  const paymentColums = usePaymentMethodColumns();
  return (
    <div className="overflow-hidden rounded-md border">
      <BaseTable<PaymentMethod>
        data={paymentMethods}
        getRowId={(e) => e.id}
        columns={paymentColums}
        actions={(e) => [
          {
            type: "edit",
            onClick: () => {},
          },
          {
            type: "delete",
            onClick: () => {},
          },
        ]}
        // pagination={{
        //   page,
        //   limit,
        //   totalPages: pagination?.totalPages || 0,
        //   totalItems: pagination?.total || 0,
        //   isFetching,
        //   onPageChange: setPage,
        //   onLimitChange: setLimit,
        // }}
      />
      {/* <table className="w-full text-sm">
        <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Nombre</th>
            <th className="px-4 py-3 text-left font-medium">Código</th>
            <th className="px-4 py-3 text-left font-medium">Descripción</th>
            <th className="px-4 py-3 text-left font-medium">Estado</th>
            <th className="px-4 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paymentMethods.map((pm) => (
            <tr key={pm.id} className="border-t">
              <td className="px-4 py-3">{pm.name}</td>
              <td className="px-4 py-3">{pm.code}</td>
              <td className="px-4 py-3">
                {pm.description?.trim() || "Sin descripción"}
              </td>
              <td className="px-4 py-3">
                <span className="text-xs font-medium">
                  {pm.isActive ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="space-x-2 px-4 py-3 text-right whitespace-nowrap">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onEdit(pm)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  disabled={deletingId === pm.id}
                  onClick={() => onDelete(pm)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
      {loading && (
        <div className="text-muted-foreground flex items-center gap-2 border-t px-4 py-3 text-xs">
          <div className="border-primary h-3 w-3 animate-spin rounded-full border-2 border-t-transparent" />
          Actualizando lista...
        </div>
      )}
    </div>
  );
};
