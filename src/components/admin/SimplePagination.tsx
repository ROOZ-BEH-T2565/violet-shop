import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatNumber } from "@/lib/format";

type Props = {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
};

export function SimplePagination({ page, totalPages, hrefFor }: Props) {
  if (totalPages <= 1) return null;

  const base =
    "inline-flex h-9 items-center gap-1 rounded-full border bg-card px-4 text-sm transition-colors hover:bg-muted";

  return (
    <nav
      aria-label="صفحه‌بندی"
      className="flex items-center justify-between gap-3 text-sm text-muted-foreground"
    >
      <span>
        صفحه {formatNumber(page)} از {formatNumber(totalPages)}
      </span>
      <div className="flex gap-2">
        {page > 1 && (
          <Link href={hrefFor(page - 1)} className={base}>
            <ChevronRight className="h-4 w-4" />
            قبلی
          </Link>
        )}
        {page < totalPages && (
          <Link href={hrefFor(page + 1)} className={base}>
            بعدی
            <ChevronLeft className="h-4 w-4" />
          </Link>
        )}
      </div>
    </nav>
  );
}
