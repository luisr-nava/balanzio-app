import { useCallback } from "react";
import { useDebounce } from "./useDebounce";
import { useQueryParams } from "./useQueryParams";

interface PaginationParams {
  search?: string;
  page?: string;
  limit?: string;
}

interface UsePaginationOptions {
  debounceDelay?: number;
  defaultPage?: number;
  defaultLimit?: number;
}

export function usePaginationParams(options: UsePaginationOptions = {}) {
  const { debounceDelay = 500, defaultPage = 1, defaultLimit = 10 } = options;

  const { params, setParams, resetParams } = useQueryParams<PaginationParams>();

  const search = params.search ?? "";
  const page = Number(params.page) || defaultPage;
  const limit = Number(params.limit) || defaultLimit;

  // Solo para queries / efectos
  const debouncedSearch = useDebounce(search, debounceDelay);

  /**
   * Actualiza búsqueda y resetea página
   */
  const setSearch = useCallback(
    (value: string) => {
      setParams({ search: value, page: "1" });
    },
    [setParams],
  );

  /**
   * Cambia página
   */
  const setPage = useCallback(
    (value: number) => {
      setParams({ page: String(value) });
    },
    [setParams],
  );

  /**
   * Cambia límite y vuelve a página 1
   */
  const setLimit = useCallback(
    (value: number) => {
      setParams({
        limit: String(value),
        page: "1",
      });
    },
    [setParams],
  );

  return {
    // Estado
    search,
    page,
    limit,

    // Para queries
    debouncedSearch,

    // Acciones
    setSearch,
    setPage,
    setLimit,
    reset: resetParams,
  };
}

