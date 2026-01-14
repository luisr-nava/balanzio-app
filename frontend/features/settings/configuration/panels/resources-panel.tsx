import React from "react";
import PaymentMethodPanel from "./resources/payment-methods/components/payment-method-panel";

export default function ResourcesPanel() {
  return (
    <div className="space-y-4">
      <PaymentMethodPanel />
      {/* <Card>
        <CardContent className="space-y-4">
          <div>
            <CardTitle>Métodos de pago</CardTitle>
            <CardDescription>
              Agrega métodos de pago para usarlos en tus operaciones.
            </CardDescription>
          </div>
          <PaymentMethodForm
            onSubmit={(values) => {
              if (!activeShopId) return;

              const payload = {
                name: values.name,
                code: values.code.toUpperCase(),
                description: values.description,
              };

              if (editingPaymentMethod) {
                updatePaymentMethod.mutate(
                  { id: editingPaymentMethod.id, payload },
                  {
                    onSuccess: () => setEditingPaymentMethod(null),
                  }
                );
                return;
              }

              createPaymentMethod.mutate(
                { shopId: activeShopId, ...payload },
                {
                  onSuccess: () => setEditingPaymentMethod(null),
                }
              );
            }}
            isSubmitting={
              editingPaymentMethod
                ? updatePaymentMethod.isPending
                : createPaymentMethod.isPending
            }
            editing={editingPaymentMethod}
            onCancelEdit={() => setEditingPaymentMethod(null)}
          />
        </CardContent>
      </Card>

      <PaymentMethodTable
        paymentMethods={paymentMethods}
        isLoading={paymentMethodsLoading}
        isFetching={paymentMethodsFetching}
        deletingId={deletingPaymentMethodId}
        onEdit={(pm) => setEditingPaymentMethod(pm)}
        onDelete={(pm) => {
          setDeletingPaymentMethodId(pm.id);
          deletePaymentMethod.mutate(pm.id, {
            onSettled: () => setDeletingPaymentMethodId(null),
          });
        }}
      /> */}
    </div>
  );
}
