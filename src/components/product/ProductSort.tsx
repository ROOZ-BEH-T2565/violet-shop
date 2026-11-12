"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PRODUCT_SORT_OPTIONS } from "@/lib/sort-map";

export function ProductSort({ current = "newest" }: { current?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      aria-label="مرتب‌سازی"
      className="h-10 rounded-full border bg-card px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {PRODUCT_SORT_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
