"use client";

import { BaseHeader } from "@/components/header/BaseHeader";
import { Loading } from "@/components/loading";
import { BaseTable } from "@/components/table/BaseTable";
import {
  EmployeeExpanded,
  EmployeeFilters,
  ModalEmployee,
} from "@/features/employees/components";
import { employeeColumns } from "@/features/employees/employee.columns";
import { useEmployeeModals, useEmployees } from "@/features/employees/hooks";
import { Employee, EmployeeFiltersValue } from "@/features/employees/types";
import { usePaginationParams } from "@/src/hooks/usePaginationParams";

export default function EmployeesPage() {
  const employeeModals = useEmployeeModals();
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
  } = usePaginationParams(300);
  const filters: EmployeeFiltersValue = {
    role: typeof params.role === "string" ? params.role : undefined,
    isActive:
      params.isActive === undefined ? undefined : params.isActive === "true",
  };
  const { employees, employeesLoading, pagination, isFetching } = useEmployees({
    search: debouncedSearch,
    page,
    limit,
    ...filters,
  });

  const hasActiveFilters =
    Boolean(debouncedSearch) ||
    Object.values(filters).some((v) => v !== undefined);
  return (
    <div className="space-y-6">
      <BaseHeader
        search={searchInput}
        setSearch={setSearch}
        searchPlaceholder="Nombre o email"
        filters={
          <EmployeeFilters
            value={filters}
            onChange={(next) => {
              updateParams({
                ...params,
                role: next.role,
                isActive:
                  next.isActive === undefined
                    ? undefined
                    : String(next.isActive),
                page: 1,
              });
            }}
          />
        }
        createLabel="Nuevo empleado"
        showClearFilters={hasActiveFilters}
        onClearFilters={() => {
          reset();
          setSearch("");
          setPage(1);
        }}
        onCreate={employeeModals.openCreate}
      />
      {employeesLoading ? (
        <Loading />
      ) : (
        <BaseTable<Employee>
          data={employees}
          getRowId={(e) => e.id}
          columns={employeeColumns}
          actions={(e) => [
            {
              type: "edit",
              onClick: employeeModals.openEdit,
            },
          ]}
          renderExpandedContent={(e) => <EmployeeExpanded employee={e} />}
          pagination={{
            page,
            limit,
            totalPages: pagination!.totalPages,
            totalItems: pagination!.total,
            isFetching,
            onPageChange: setPage,
            onLimitChange: setLimit,
          }}
        />
      )}
      <ModalEmployee modals={employeeModals} />
    </div>
  );
}
