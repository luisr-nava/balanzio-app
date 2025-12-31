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

export function usePaginationParams(debounceDelay: number = 500) {
  const { params, updateParams, resetParams } = useQueryParams({
    debounceDelay,
    debounceKeys: ["search"],
  });

  // Valores con defaults
  const search = (params.search as string) || "";
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;

  // Aplicar debounce solo para usarlo en queries, no para la URL
  const debouncedSearch = useDebounce(search, debounceDelay);

  /**
   * Actualiza la búsqueda (con debounce) y resetea la página a 1
   */
  const setSearch = useCallback(
    (value: string) => {
      updateParams({ search: value, page: 1 });
    },
    [updateParams],
  );

  /**
   * Actualiza la página
   */
  const setPage = useCallback(
    (value: number) => {
      updateParams({ page: value });
    },
    [updateParams],
  );

  /**
   * Actualiza el límite y resetea a página 1
   */
  const setLimit = useCallback(
    (value: number) => {
      updateParams({ limit: value, page: 1 });
    },
    [updateParams],
  );

  /**
   * Resetea todos los parámetros a sus valores por defecto
   */
  const reset = useCallback(() => {
    resetParams();
  }, [resetParams]);

  return {
    // Valores actuales
    search,
    page,
    limit,
    debouncedSearch, // Para usar en queries

    // Setters
    setSearch,
    setPage,
    setLimit,
    reset,

    // Utilidad para actualizar múltiples a la vez
    updateParams,
  };
}

