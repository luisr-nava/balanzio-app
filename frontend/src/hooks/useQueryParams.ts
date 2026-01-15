import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "./useDebounce";

export interface QueryParams {
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}

interface UseQueryParamsOptions {
  debounceDelay?: number;
  debounceKeys?: string[];
}

export function useQueryParams<T extends QueryParams = QueryParams>(
  options: UseQueryParamsOptions = {}
) {
  const { debounceDelay = 500, debounceKeys = ["search"] } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * Parsea los query params actuales a un objeto tipado
   */
  const params = useMemo(() => {
    const result: Record<string, string | number> = {};

    searchParams.forEach((value, key) => {
      // Intentar convertir a número si es posible
      const numValue = Number(value);
      result[key] = isNaN(numValue) ? value : numValue;
    });

    return result as T;
  }, [searchParams]);

  // const updateParams = useCallback(
  //   (
  //     updates: Partial<T>,
  //     options?: { scroll?: boolean; replace?: boolean }
  //   ) => {
  //     const { scroll = false, replace = false } = options || {};

  //     const newParams = new URLSearchParams(searchParams.toString());

  //     // Actualizar o eliminar parámetros
  //     Object.entries(updates).forEach(([key, value]) => {
  //       if (value === undefined || value === null || value === "") {
  //         newParams.delete(key);
  //       } else {
  //         newParams.set(key, String(value));
  //       }
  //     });

  //     const newUrl = `${pathname}?${newParams.toString()}`;

  //     if (replace) {
  //       router.replace(newUrl, { scroll });
  //     } else {
  //       router.push(newUrl, { scroll });
  //     }
  //   },
  //   [pathname, router, searchParams]
  // );
  const updateParams = useCallback(
    (
      updates: Partial<T>,
      options?: { scroll?: boolean; replace?: boolean }
    ) => {
      const { scroll = false, replace = false } = options || {};

      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      const newUrl = `${pathname}?${newParams.toString()}`;
      const currentUrl = `${pathname}?${searchParams.toString()}`;

      if (newUrl === currentUrl) return;

      replace
        ? router.replace(newUrl, { scroll })
        : router.push(newUrl, { scroll });
    },
    [pathname, router, searchParams]
  );

  /**
   * Obtiene un valor específico de los params
   */
  const getParam = useCallback(
    <K extends keyof T>(key: K, defaultValue?: T[K]): T[K] | undefined => {
      return (params[key] as T[K]) ?? defaultValue;
    },
    [params]
  );

  /**
   * Resetea todos los parámetros
   */
  const resetParams = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  /**
   * Elimina parámetros específicos
   */
  const removeParams = useCallback(
    (...keys: (keyof T)[]) => {
      const newParams = new URLSearchParams(searchParams.toString());
      keys.forEach((key) => newParams.delete(String(key)));
      router.push(`${pathname}?${newParams.toString()}`);
    },
    [pathname, router, searchParams]
  );

  return {
    params,
    updateParams,
    getParam,
    resetParams,
    removeParams,
  };
}
