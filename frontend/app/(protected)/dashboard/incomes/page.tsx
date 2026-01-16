"use client";

import { BaseHeader } from "@/components/header/BaseHeader";
import { Loading } from "@/components/loading";
import { BaseTable } from "@/components/table/BaseTable";
import { OpenCashRegisterModal } from "@/features/cash-register/components";
import { useCashRegisterStateQuery } from "@/features/cash-register/hooks";
import {
  ExpenseFilters,
  IncomeModal,
  useIncomeColumns,
} from "@/features/incomes/components";
import { useIncomeModals, useIncomes } from "@/features/incomes/hooks";
import { Income, IncomeFiltersValue } from "@/features/incomes/types";
import { usePaymentMethods } from "@/features/settings/configuration/panels/resources/payment-methods/hooks";
import { useShopStore } from "@/features/shop/shop.store";
import { usePaginationParams } from "@/src/hooks/usePaginationParams";
import { useState } from "react";

export default function IncomesPage() {
  const incomeModals = useIncomeModals();
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
  const filters: IncomeFiltersValue = {
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

  const { incomes, incomesLoading, pagination, isFetching } = useIncomes({
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
    incomeModals.openCreate();
  };

  const columns = useIncomeColumns();
  const hasActiveFilters =
    Boolean(debouncedSearch) ||
    Object.values(filters).some((v) => v !== undefined);

  const { paymentMethods } = usePaymentMethods();
  return (
    <div className="space-y-4">
      <BaseHeader
        search={searchInput}
        setSearch={setSearch}
        showClearFilters={hasActiveFilters}
        onClearFilters={() => {
          reset();
          setSearch("");
          setPage(1);
        }}
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
        createLabel="Nuevo ingreso"
      />
      {incomesLoading ? (
        <Loading />
      ) : (
        <BaseTable<Income>
          data={incomes}
          getRowId={(e) => e.id}
          columns={columns}
          actions={(e) => [
            {
              type: "edit",
              onClick: incomeModals.openEdit,
            },
            {
              type: "delete",
              onClick: incomeModals.openDelete,
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
      <IncomeModal cashRegisterId={cashRegisterId!} modals={incomeModals} />
      <OpenCashRegisterModal
        open={openCashModal}
        onOpenChange={setOpenCashRegisterModal}
      />
    </div>
  );
}
