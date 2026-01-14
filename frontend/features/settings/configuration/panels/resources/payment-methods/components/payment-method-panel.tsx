import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import { PaymentMethodForm } from "./payment-method-form";
import { usePaymentMethodForm } from "../hooks/usePaymentMethodForm";
import { PaymentMethod } from "../types";
import { PaymentMethodTable } from "./payment-method-table";
import { usePaymentMethods } from "../hooks";

export default function PaymentMethodPanel() {
  const { isFetching, paymentMethods } = usePaymentMethods();
  const [editingCategory, setEditingCategory] = useState<
    PaymentMethod | undefined
  >();
  const handleCancelEdit = () => {
    setEditingCategory(undefined);
  };
  const { form, onSubmit, isLoading, isEditing } = usePaymentMethodForm(
    editingCategory,
    handleCancelEdit
  );
  return (
    <Card className="max-h-90 min-h-90">
      <CardContent className="grid gap-6">
        <PaymentMethodForm
          form={form}
          onSubmit={onSubmit}
          isEditing={isEditing}
          pending={isLoading}
          handleCancelEdit={handleCancelEdit}
        />
        <PaymentMethodTable
          onDelete={() => {}}
          paymentMethods={paymentMethods}
          deletingId={""}
          loading={isLoading}
          onEdit={(category) => setEditingCategory(category)}
        />
      </CardContent>
    </Card>
  );
}
