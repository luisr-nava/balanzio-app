"use client";

import { Loading } from "@/components/loading";
import {
  EmployeeHeader,
  EmployeeTable,
  ModalEmployee,
} from "@/features/employees/components";
import { useEmployeeModals, useEmployees } from "@/features/employees/hooks/";
import { usePaginationParams } from "@/src/hooks/usePaginationParams";

export default function EmployeesPage() {
  const { openCreate, openEdit } = useEmployeeModals();
  const { search, setSearch, debouncedSearch, page, limit, setPage, setLimit } =
    usePaginationParams(300);
  const { employees, employeesLoading, pagination, isFetching } = useEmployees(
    debouncedSearch,
    page,
    limit,
  );

  return (
    <div className="space-y-6">
      <EmployeeHeader
        handleOpenCreate={openCreate}
        search={search}
        setSearch={setSearch}
      />
      {employeesLoading ? (
        <Loading />
      ) : (
        <EmployeeTable
          employees={employees}
          handleEdit={openEdit}
          limit={limit}
          page={page}
          setLimit={setLimit}
          setPage={setPage}
          pagination={pagination!}
          isFetching={isFetching}
        />
      )}

      <ModalEmployee />
    </div>
  );
}

