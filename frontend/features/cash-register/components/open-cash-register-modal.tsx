"use client";

import { useState } from "react";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks";

interface OpenCashRegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shopId: string;
}

export default function OpenCashRegisterModal({
  onOpenChange,
  open,
  shopId,
}: OpenCashRegisterModalProps) {
  const { user } = useAuth();
  const openedByName = user?.fullName?.trim() ?? "";
  const hasResponsibleName = Boolean(openedByName.length);

  const [openingAmount, setOpeningAmount] = useState<string>("");

  return (
    <Modal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Abrir caja"
      description="No encontramos una caja abierta para esta tienda. Ingresa el monto inicial para continuar."
      size="lg"
      showCloseButton={false}
      closeOnOverlayClick={false}>
      <div className="space-y-4">
        <Label htmlFor="opening-amount">
          Monto inicial <span className="text-destructive">*</span>
        </Label>
        <Input
          id="opening-amount"
          type="number"
          min={0}
          step={0.01}
          value={openingAmount}
          placeholder="Ingresa el monto inicial"
          onChange={(e) => setOpeningAmount(e.target.value)}
          autoFocus
        />
        <p className="text-xs text-muted-foreground">
          Este será el efectivo de inicio para la caja de la tienda.
        </p>
        {!hasResponsibleName ? (
          <p className="text-xs text-destructive">
            No se detecta el responsable en el store. Actualiza tu perfil para
            poder abrir la caja.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Responsable: <span className="font-medium">{openedByName}</span>
          </p>
        )}
      </div>

      <ModalFooter className="justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="default"
          // onClick={handleOpenClick}
          // disabled={!canSubmit || openMutation.isPending}
        >
          Abrir caja
        </Button>
      </ModalFooter>
    </Modal>
  );
}

