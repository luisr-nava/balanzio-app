import { useCurrencyFormatter } from "@/src/hooks/useCurrencyFormatter";
import { Supplier } from "@/features/suppliers/types";

interface SupplierExpandedProps {
  suppliers: Supplier;
}

export default function SupplierExpanded({ suppliers }: SupplierExpandedProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 text-sm">
      <div className="space-y-2">
        <div>
          <p className="text-muted-foreground">Direccion:</p>
          <p className="text-right font-medium sm:text-left">
            {suppliers.address || "Si dirección"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-muted-foreground">Notas:</p>
          <p className="text-right font-medium sm:text-left">
            {suppliers.notes || "Sin Notas"}
          </p>
        </div>
      </div>
    </div>
  );
}
