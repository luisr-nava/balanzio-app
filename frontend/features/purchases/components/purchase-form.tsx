import { Input } from "@/components/ui/input";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Supplier } from "@/features/suppliers/types";
import { BaseForm } from "@/components/form/BaseForm";
import { FormGrid } from "@/components/form/FormGrid";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CreatePurchaseDto, Purchase } from "../types";

type Props = {
  form: UseFormReturn<CreatePurchaseDto>;
  onSubmit: (values: CreatePurchaseDto) => void;
  onCancel: () => void;
  isEdit: boolean;
  isSubmitting: boolean;
  suppliers: Supplier[];
};

export default function PurchaseForm({
  form,
  onSubmit,
  onCancel,
  isEdit,
  isSubmitting,
  suppliers,
}: Props) {
  return (
    <BaseForm
      form={form}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitLabel={isEdit ? "Actualizar producto" : "Crear producto"}
      isSubmitting={isSubmitting}
    >
      <FormGrid cols={1}>
        <></>
        {/* <FormField
          control={form.control}
          name=""
          rules={{ required: "El nombre es obligatorio" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nombre completo <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Jabón" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
      </FormGrid>
    </BaseForm>
  );
}
