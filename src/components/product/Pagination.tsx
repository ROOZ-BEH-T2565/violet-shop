import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { buildProductsUrl } from "@/lib/url";

type Props = {
  page: number;
  totalPages: number;
  params: { q?: string; category?: string; sort?: string };
};

export function Pagination({ page, totalPages, params }: Props) {
  if (totalPages <= 1) return null;

  const href = (p: number) =>
    buildProductsUrl({ ...params, page: p > 1 ? p : undefined });
  const count = Math.min(5, totalPages);
  const start = Math.max(1, Math.min(page - 2, totalPages - count + 1));
  const pages = Array.from({ length: count }, (_, i) => start + i);

  const base =
    "flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm transition-colors";

  return (
    <nav
      aria-label="صفحه‌بندی"
      className="flex items-center justify-center gap-2"
    >
      {page > 1 && (
        <Link
          href={href(page - 1)}
          className={cn(base, "hover:border-primary")}
          aria-label="صفحه‌ی قبل"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            base,
            p === page
              ? "border-primary bg-primary text-primary-foreground"
              : "hover:border-primary",
          )}
        >
          {formatNumber(p)}
        </Link>
      ))}
      {page < totalPages && (
        <Link
          href={href(page + 1)}
          className={cn(base, "hover:border-primary")}
          aria-label="صفحه‌ی بعد"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
