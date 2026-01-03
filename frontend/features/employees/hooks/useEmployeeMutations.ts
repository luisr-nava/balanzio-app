import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useShopStore } from "@/features/shop/shop.store";
import { CreateEmployeeDto } from "../types";
import {
  createAuthUserAction,
  createEmployeeAction,
  deleteEmployeeAction,
  updateEmployeeAction,
} from "../actions";

// toast.success("Empleado creado");
// toast.error("No se pudo crear el empleado");
export const useEmployeeCreateMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();

  return useMutation({
    mutationFn: async (payload: CreateEmployeeDto) => {
      console.log({ payload });
      const { shopIds, id, ...rest } = payload;
      // Primero creamos el usuario en el servicio de Auth.
      const authResponse = await createAuthUserAction(rest);
      console.log({ authResponse });

      // Obtenemos el ID generado por Auth.
      const userId = authResponse.userId;

      // Creamos un nuevo payload para el empleado, reutilizando el mismo ID.
      const { password, ...employeeData } = payload;

      // Añadimos el userId recibido del Auth al empleado.
      employeeData.id = userId;

      // Ahora creamos el empleado con ese ID.
      return createEmployeeAction(employeeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees", activeShopId] });
    },
  });
};

export const useEmployeeUpdateMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();
  // toast.success("Empleado actualizado");
  // toast.error("No se pudo actualizar el empleado");
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateEmployeeDto>;
    }) => updateEmployeeAction(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees", activeShopId] });
    },
  });
};

// export const useEmployeeDeleteMutation=()=>{
//     const queryClient = useQueryClient();
//     const { activeShopId } = useShopStore();

// }

