"use client";

import { useShopStore } from "@/features/shop/shop.store";
import { useCashRegisterStateQuery } from "@/features/cash-register/hooks/useCashRegisterStateQuery";
import {
  useExpenseColumns,
  ExpenseModal,
  ExpenseFilters,
} from "@/features/expenses/components";
import { useExpenseModals, useExpenses } from "@/features/expenses/hooks";
import { usePaginationParams } from "@/src/hooks/usePaginationParams";
import { Loading } from "@/components/loading";
import { useState } from "react";
import { OpenCashRegisterModal } from "@/features/cash-register/components";
import { BaseHeader } from "@/components/header/BaseHeader";
import {
  Expense,
  ExpenseFiltersValue,
} from "../../../../features/expenses/types";
import { BaseTable } from "@/components/table/BaseTable";
import { usePaymentMethods } from "../../../../features/settings/configuration/panels/resources/payment-methods/hooks/usePaymentMethods";

export default function ExpensesPage() {
  const expenseModals = useExpenseModals();
  const {
    searchInput,
    setSearch,
    debouncedSearch,
    page,
    limit,
    setPage,
    setLimit,
    params,
    reset,
    updateParams,
  } = usePaginationParams(500);

  const filters: ExpenseFiltersValue = {
    paymentMethodId:
      typeof params.paymentMethodId === "string"
        ? params.paymentMethodId
        : undefined,

    categoryId:
      typeof params.categoryId === "string" ? params.categoryId : undefined,

    startDate:
      typeof params.startDate === "string" ? params.startDate : undefined,

    endDate: typeof params.endDate === "string" ? params.endDate : undefined,
  };
  const { expenses, expensesLoading, pagination, isFetching } = useExpenses({
    search: debouncedSearch,
    page,
    limit,
    ...filters,
  });

  const { activeShopId } = useShopStore();
  const { data } = useCashRegisterStateQuery(activeShopId!);

  const hasOpenCashRegister = data?.hasOpenCashRegister === true;
  const cashRegisterId = data?.cashRegisterId;
  const [openCashModal, setOpenCashRegisterModal] = useState(false);

  const handleCreateExpense = () => {
    if (!hasOpenCashRegister) {
      setOpenCashRegisterModal(true);
      return;
    }
    expenseModals.openCreate();
  };

  const columns = useExpenseColumns();
  const hasActiveFilters =
    Boolean(debouncedSearch) ||
    Object.values(filters).some((v) => v !== undefined);
    
  const { paymentMethods } = usePaymentMethods();
  return (
    <div className="space-y-4">
      <BaseHeader
        search={searchInput}
        setSearch={setSearch}
        filters={
          <ExpenseFilters
            paymentMethods={paymentMethods}
            value={filters}
            onChange={(next) => {
              updateParams({
                ...params,
                ...next,
                page: 1,
              });
            }}
          />
        }
        onCreate={handleCreateExpense}
        createLabel="Nuevo egreso"
        showClearFilters={hasActiveFilters}
        onClearFilters={() => {
          reset();
          setSearch("");
          setPage(1);
        }}
      />
      {expensesLoading ? (
        <Loading />
      ) : (
        <BaseTable<Expense>
          data={expenses}
          getRowId={(e) => e.id}
          columns={columns}
          actions={(e) => [
            {
              type: "edit",
              onClick: expenseModals.openEdit,
            },
            {
              type: "delete",
              onClick: expenseModals.openDelete,
            },
          ]}
          pagination={{
            page,
            limit,
            totalPages: pagination?.totalPages || 0,
            totalItems: pagination?.total || 0,
            isFetching,
            onPageChange: setPage,
            onLimitChange: setLimit,
          }}
        />
      )}
      <ExpenseModal cashRegisterId={cashRegisterId!} modals={expenseModals} />
      <OpenCashRegisterModal
        open={openCashModal}
        onOpenChange={setOpenCashRegisterModal}
      />
    </div>
  );
}
