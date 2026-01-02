import { CreateEmployeeDto, Employee } from "../types";
import { useShopStore } from "@/features/shop/shop.store";
import {
  useEmployeeCreateMutation,
  useEmployeeUpdateMutation,
} from "./useEmployeeMutations";
import { useForm } from "react-hook-form";

const initialForm: CreateEmployeeDto = {
  fullName: "",
  email: "",
  password: "",
  dni: "",
  phone: "",
  address: "",
  hireDate: "",
  salary: 0,
  notes: "",
  profileImage: "",
  emergencyContact: "",
  shopIds: [""],
};

export const useEmployeeForm = (
  editEmployee?: Employee,
  onClose?: () => void,
) => {
  
  const { activeShopId } = useShopStore();
  const createMutation = useEmployeeCreateMutation();
  const updateMutaion = useEmployeeUpdateMutation();
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

  return {};
};

