import { CreateEmployeeDto, Employee } from "../types";
import { useShopStore } from "@/features/shop/shop.store";
import {
  useEmployeeCreateMutation,
  useEmployeeUpdateMutation,
} from "./useEmployeeMutations";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const initialForm: CreateEmployeeDto = {
  id: "",
  fullName: "",
  email: "",
  password: "",
  dni: "",
  phone: "",
  address: "",
  hireDate: undefined,
  role: "EMPLOYEE",
  salary: 0,
  notes: "",
  profileImage: "",
  emergencyContact: "",
  shopIds: [],
};

export const useEmployeeForm = (
  editEmployee?: Employee,
  onClose?: () => void,
) => {
  const { activeShopId } = useShopStore();
  const createMutation = useEmployeeCreateMutation();
  const updateMutation = useEmployeeUpdateMutation();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm<CreateEmployeeDto>({
    defaultValues: initialForm,
  });

  const onSubmit = handleSubmit((values) => {
    const basePayload: CreateEmployeeDto = {
      ...values,
      shopIds: [activeShopId!],
      hireDate: values.hireDate || undefined,
    };
    if (editEmployee) {
      updateMutation.mutate(
        {
          id: editEmployee.id,
          payload: basePayload,
        },
        {
          onSuccess: () => {
            toast.success("Empleado actualizado");
          },
          onError: () => {
            toast.error("No se pudo actualizar el empleado");
          },
        },
      );
    } else {
      createMutation.mutate(basePayload, {
        onSuccess: () => {
          toast.success("Empleado creado");
        },
        onError: () => {
          toast.error("No se pudo crear el empleado");
        },
      });
    }
    onClose?.();
    reset();
  });

  return {
    register,
    reset,
    onSubmit,
    initialForm,
    setValue,
    control,
    getValues,
    errors,
    isLoadingCreate: createMutation.isPending,
    isLoadingUpdate: updateMutation.isPending,
  };
};


