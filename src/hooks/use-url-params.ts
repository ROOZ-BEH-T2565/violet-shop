"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Updates = Record<string, string | null | undefined>;

export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParams = useCallback(
    (updates: Updates) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "")
          params.delete(key);
        else params.set(key, value);
      }
      // با تغییر جستجو/فیلتر/سورت، به صفحه‌ی اول برمی‌گردیم
      if (!("page" in updates)) params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, searchParams],
  );

  return { searchParams, setParams };
}
