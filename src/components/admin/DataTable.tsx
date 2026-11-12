"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUrlParams } from "@/hooks/use-url-params";
import { formatNumber } from "@/lib/format";

export type TableFilter = {
  key: string;
  label: string;
  options: { value: string; label: string }[];
};

type Props<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  total: number;
  page: number;
  pageSize: number;
  searchPlaceholder?: string;
  filters?: TableFilter[];
  rowHref?: (row: TData) => string;
};

/**
 * جدول TanStack با سورت، جستجو، فیلتر و صفحه‌بندی سمت سرور (manual).
 * وضعیت‌ها در URL ذخیره می‌شوند و صفحه‌ی سروری با sort-map امن آن‌ها را می‌خواند.
 */
export function DataTable<TData>({
  columns,
  data,
  total,
  page,
  pageSize,
  searchPlaceholder = "جستجو...",
  filters = [],
  rowHref,
}: Props<TData>) {
  const router = useRouter();
  const { searchParams, setParams } = useUrlParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount,
  });

  const onRowClick = (event: React.MouseEvent, row: TData) => {
    if (!rowHref) return;
    if (
      (event.target as HTMLElement).closest(
        "a,button,input,select,[role=dialog]",
      )
    )
      return;
    router.push(rowHref(row));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            setParams({ q: search.trim() });
          }}
          className="relative flex-1"
        >
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 w-full rounded-full border bg-card ps-10 pe-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </form>

        {filters.map((filter) => (
          <select
            key={filter.key}
            value={searchParams.get(filter.key) ?? ""}
            onChange={(e) => setParams({ [filter.key]: e.target.value })}
            aria-label={filter.label}
            className="h-10 rounded-full border bg-card px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">{filter.label}: همه</option>
            {filter.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ))}
      </div>

      <div className="rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id} className="text-start">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  موردی یافت نشد.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={(e) => onRowClick(e, row.original)}
                  className={rowHref ? "cursor-pointer" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-start">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>
          {formatNumber(total)} مورد · صفحه {formatNumber(page)} از{" "}
          {formatNumber(pageCount)}
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setParams({ page: String(page - 1) })}
          >
            <ChevronRight className="h-4 w-4" />
            قبلی
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= pageCount}
            onClick={() => setParams({ page: String(page + 1) })}
          >
            بعدی
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
