"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useUrlParams } from "@/hooks/use-url-params";
import { cn } from "@/lib/utils";

/** سورت سمت سرور: مقدار sort در URL به‌صورت field:asc یا field:desc ذخیره می‌شود (طبق sort-map). */
export function SortableHeader({
  field,
  label,
}: {
  field: string;
  label: string;
}) {
  const { searchParams, setParams } = useUrlParams();
  const [currentField, currentDir] = (searchParams.get("sort") ?? "").split(
    ":",
  );
  const active = currentField === field;

  const next = !active
    ? `${field}:asc`
    : currentDir === "asc"
      ? `${field}:desc`
      : null;
  const Icon = !active
    ? ArrowUpDown
    : currentDir === "asc"
      ? ArrowUp
      : ArrowDown;

  return (
    <button
      type="button"
      onClick={() => setParams({ sort: next })}
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap font-medium transition-colors hover:text-primary",
        active && "text-primary",
      )}
    >
      {label}
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
