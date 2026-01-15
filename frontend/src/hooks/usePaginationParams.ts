import { useEffect, useRef, useState } from "react";
import { useQueryParams } from "./useQueryParams";
import { useDebounce } from "./useDebounce";
export function usePaginationParams(debounceDelay = 500) {
  const { params, updateParams, resetParams } = useQueryParams();

  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const [searchInput, setSearchInput] = useState(params.search ?? "");
  const debouncedSearch = useDebounce(searchInput, debounceDelay);

  const lastAppliedSearch = useRef<string | null>(null);

  useEffect(() => {
    const next = debouncedSearch.trim();

    if (lastAppliedSearch.current === next) return;

    lastAppliedSearch.current = next;

    updateParams({
      search: next || undefined,
      page: 1,
    });
  }, [debouncedSearch, updateParams]);

  return {
    /** 🔑 CLAVE */
    params,
    updateParams,

    /** Search */
    searchInput,
    debouncedSearch,
    setSearch: setSearchInput,

    /** Pagination */
    page,
    limit,
    setPage: (p: number) => updateParams({ page: p }),
    setLimit: (l: number) => updateParams({ limit: l, page: 1 }),

    /** Reset */
    reset: resetParams,
  };
}
