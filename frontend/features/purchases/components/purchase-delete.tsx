import { Button } from "@/components/ui/button";
import React from "react";
import { CreatePurchaseDto, PurchaseFormValues } from "../types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { useFormContext } from "react-hook-form";

interface Props {
  handleClose: () => void;
  isLoadingDelete: boolean;
}

export default function PurchaseDelete({
  handleClose,
  isLoadingDelete,
}: Props) {
  const { control } = useFormContext(); // ✅ ACÁ

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        ¿Seguro que deseas eliminar esta compra?
        <span className="block">Esta acción no se puede deshacer.</span>
      </p>

      <FormField
        control={control} // ✅ ahora sí
        name="deletionReason"
        rules={{ required: "Debes indicar el motivo de eliminación" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Motivo de eliminación <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Ej: compra cargada por error" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          disabled={isLoadingDelete}
        >
          Cancelar
        </Button>

        <Button type="submit" variant="destructive" disabled={isLoadingDelete}>
          {isLoadingDelete ? "Eliminando..." : "¿Eliminar?"}
        </Button>
      </div>
    </div>
  );
}
