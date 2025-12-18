import { Controller, useWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { CreateCustomerDto } from "../../interfaces";
import type { UseCustomerFormReturn } from "../../hooks/useCustomerForm";

type Props = Pick<
  UseCustomerFormReturn,
  | "activeShopId"
  | "createMutation"
  | "updateMutation"
  | "register"
  | "onSubmit"
  | "reset"
  | "customerModal"
  | "editCustomerModal"
  | "initialForm"
  | "control"
  | "errors"
>;

export const CustomerForm = ({
  activeShopId,
  createMutation,
  updateMutation,
  register,
  onSubmit,
  reset,
  customerModal,
  editCustomerModal,
  initialForm,
  control,
  errors,
}: Props) => {
  const [watchName, watchShopId] = useWatch<CreateCustomerDto>({
    control,
    name: ["fullName", "shopId"],
  });

  const normalizedName =
    typeof watchName === "string"
      ? watchName.trim()
      : String(watchName ?? "").trim();

  const canSubmit = Boolean(normalizedName && watchShopId);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-3">
        <div className="grid gap-1">
          <Label>Nombre completo *</Label>
          <Input
            {...register("fullName", { required: "El nombre es obligatorio" })}
            placeholder="Juan Pérez"
          />
          {errors.fullName && (
            <p className="text-xs text-destructive">
              {errors.fullName.message?.toString()}
            </p>
          )}
        </div>
        <div className="flex gap-5 w-full">
          <div className="grid gap-1 w-1/2">
            <Label>Email</Label>
            <Input
              type="email"
              {...register("email")}
              placeholder="cliente@email.com"
            />
          </div>
          <div className="grid gap-1 w-1/2">
            <Label>DNI</Label>
            <Input
              type="number"
              {...register("dni")}
              placeholder="00.000.000"
            />
          </div>
        </div>
        <div className="flex gap-5 w-full">
          <div className="grid gap-1 w-1/2">
            <Label>Teléfono</Label>
            <Input
              type="tel"
              {...register("phone")}
              placeholder="+54 9 11 1234-5678"
            />
          </div>
          <div className="grid gap-1 w-1/2">
            <Label>Dirección</Label>
            <Input {...register("address")} placeholder="Calle y número" />
          </div>
        </div>
        <div className="grid gap-1">
          <Label>Notas</Label>
          <Textarea
            {...register("notes")}
            placeholder="Preferencias, historial de contacto u otras referencias"
            rows={3}
          />
        </div>
        <div className="grid gap-1">
          <Label>Limite de Crédito</Label>
          <Input
            type="number"
            {...register("creditLimit")}
            placeholder="1000"
          />
        </div>
      </div>
      <ModalFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            customerModal.close();
            editCustomerModal.close();
            reset({ ...initialForm, shopId: activeShopId || "" });
          }}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={
            !canSubmit || createMutation.isPending || updateMutation.isPending
          }>
          {createMutation.isPending || updateMutation.isPending
            ? "Guardando..."
            : editCustomerModal.isOpen
            ? "Actualizar cliente"
            : "Crear cliente"}
        </Button>
      </ModalFooter>
    </form>
  );
};



