import { EmployeeQueryParams } from "../types";
import { useEmployeeQuery } from "./useEmployeeQuery";

export const useEmployees = ({ ...params }: EmployeeQueryParams) => {
  const { employees, pagination, employeesLoading, isFetching, refetch } =
    useEmployeeQuery(params);

  return {
    employees,
    pagination,
    employeesLoading,
    isFetching,
    refetch,
  };
};
