import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CreateSupplierDto } from "../types";
import { BaseForm } from "@/components/form/BaseForm";
import { FormGrid } from "@/components/form/FormGrid";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export interface SupplierFormValues {
  name: string;
  contactName?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  categoryId?: string | null;
  shopIds: string[];
}

interface Props {
  form: UseFormReturn<CreateSupplierDto>;
  onSubmit: (values: CreateSupplierDto) => void;
  onCancel: () => void;
  isEdit: boolean;
  isSubmitting: boolean;
}

export default function SupplierForm({
  form,
  onSubmit,
  onCancel,
  isEdit,
  isSubmitting,
}: Props) {
  return (
    <BaseForm
      form={form}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitLabel={isEdit ? "Actualizar egreso" : "Crear egreso"}
      isSubmitting={isSubmitting}
    >
      <FormGrid cols={2}>
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "El nombre del proveedor es obligatorio" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nombre del proveedor <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Proveedor S.A." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefono</FormLabel>
              <FormControl>
                <Input
                  placeholder="+54 9 11 1234 5678"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </FormGrid>
      <FormGrid cols={2}>
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Persona de contacto</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Luis"
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="contacto@proveedor.com"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </FormGrid>
      <FormGrid cols={2}>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Calle 123"
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* TODO: Traer las categorias de  */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="contacto@proveedor.com"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </FormGrid>

      <FormGrid cols={1}>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Notas internas"
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </FormGrid>
    </BaseForm>
  );
}
