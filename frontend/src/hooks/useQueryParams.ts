import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useQueryParams<T = Record<string, string>>() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    const result: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      result[key] = value;
    });
    return result as T;
  }, [searchParams]);

  const setParams = useCallback(
    (
      updates: Partial<Record<keyof T, string | undefined>>,
      options?: { replace?: boolean; scroll?: boolean },
    ) => {
      const { replace = false, scroll = false } = options || {};
      const next = new URLSearchParams(searchParams.toString());

      (Object.entries(updates) as [string, string | undefined][]).forEach(
        ([key, value]) => {
          if (value === undefined || value === "") {
            next.delete(key);
          } else {
            next.set(key, value); // ✅ ahora SIEMPRE string
          }
        },
      );

      const url = `${pathname}?${next.toString()}`;
      replace ? router.replace(url, { scroll }) : router.push(url, { scroll });
    },
    [pathname, router, searchParams],
  );

  const resetParams = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  return {
    params,
    setParams,
    resetParams,
  };
}

