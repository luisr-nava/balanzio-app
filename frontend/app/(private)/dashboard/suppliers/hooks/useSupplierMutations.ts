import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useShopStore } from "@/app/(private)/store/shops.slice";
import { createSupplierAction } from "../actions/create.supplier.action";
import { updateSupplierAction } from "../actions/update.supplier.action";
import { deleteSupplierAction } from "../actions/delete.supplier.action";
import type { CreateSupplierDto } from "@/lib/types/supplier";

const getErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message || error?.message || fallback;

export const useSupplierMutations = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["suppliers", activeShopId] });

  const createMutation = useMutation({
    mutationFn: (payload: CreateSupplierDto) => createSupplierAction(payload),
    onSuccess: () => {
      toast.success("Proveedor creado");
      invalidate();
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: getErrorMessage(error, "No se pudo crear el proveedor"),
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateSupplierDto>;
    }) => updateSupplierAction(id, payload),
    onSuccess: () => {
      toast.success("Proveedor actualizado");
      invalidate();
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: getErrorMessage(error, "No se pudo actualizar el proveedor"),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSupplierAction(id),
    onSuccess: () => {
      toast.success("Proveedor eliminado");
      invalidate();
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: getErrorMessage(error, "No se pudo eliminar el proveedor"),
      });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
