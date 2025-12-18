import { useEffect } from "react";
import { useShopStore } from "@/app/(private)/store/shops.slice";
import { useShallow } from "zustand/react/shallow";
import {
  useCustomerCreateMutation,
  useCustomerUpdateMutation,
} from "./customer.mutation";
import type { CreateCustomerDto, Customer } from "../interfaces";
import { useForm } from "react-hook-form";
import { useModal } from "@/app/(private)/hooks/useModal";

const initialForm: CreateCustomerDto = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
  shopId: "",
};

export const useCustomerForm = () => {
  const { activeShopId, activeShopLoading } = useShopStore(
    useShallow((state) => ({
      activeShopId: state.activeShopId,
      activeShopLoading: state.activeShopLoading,
    })),
  );
  const createMutation = useCustomerCreateMutation();
  const updateMutation = useCustomerUpdateMutation();
  const customerModal = useModal("createCustomer");
  const editCustomerModal = useModal("editCustomer");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateCustomerDto>({
    defaultValues: {
      ...initialForm,
      shopId: activeShopId || "",
    },
  });

  useEffect(() => {
    if (activeShopId) {
      setValue("shopId", activeShopId);
    }
  }, [activeShopId, setValue]);

  const onSubmit = handleSubmit((values) => {
    if (!activeShopId) return;

    const payload: CreateCustomerDto = {
      fullName: values.fullName.trim(),
      email: values.email?.trim() || null,
      phone: values.phone?.trim() || null,
      address: values.address?.trim() || null,
      notes: values.notes?.trim() || null,
      shopId: activeShopId,
    };

    if (editCustomerModal.isOpen && editCustomerModal.data) {
      updateMutation.mutate({
        id: String(editCustomerModal.data),
        payload,
      });
    } else {
      // En creación no enviamos isActive explícitamente
      createMutation.mutate({ ...payload });
    }
  });

  const handleEdit = (customer: Customer) => {
    reset({
      fullName: customer.fullName,
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      notes: customer.notes || "",
      shopId: customer.shopId,
    });
    editCustomerModal.open(customer.id);
  };

  const handleOpenCreate = () => {
    reset({
      ...initialForm,
      shopId: activeShopId || "",
    });
    customerModal.open();
  };

  useEffect(() => {
    if (!createMutation.isSuccess) return;
    reset({
      ...initialForm,
      shopId: activeShopId || "",
    });
    customerModal.close();
    editCustomerModal.close();
    createMutation.reset();
  }, [activeShopId, createMutation, customerModal, editCustomerModal, reset]);

  useEffect(() => {
    if (!updateMutation.isSuccess) return;
    reset({
      ...initialForm,
      shopId: activeShopId || "",
    });
    customerModal.close();
    editCustomerModal.close();
    updateMutation.reset();
  }, [activeShopId, updateMutation, customerModal, editCustomerModal, reset]);

  return {
    activeShopId,
    activeShopLoading,
    createMutation,
    updateMutation,
    register,
    onSubmit,
    reset,
    handleEdit,
    handleOpenCreate,
    customerModal,
    editCustomerModal,
    initialForm,
    setValue,
    control,
    errors,
  };
};

export type UseCustomerFormReturn = ReturnType<typeof useCustomerForm>;

