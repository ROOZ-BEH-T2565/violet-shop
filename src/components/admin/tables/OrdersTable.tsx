"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, type TableFilter } from "@/components/admin/DataTable";
import { SortableHeader } from "@/components/admin/SortableHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ORDER_STATUSES, ORDER_STATUS_META } from "@/lib/admin-constants";
import { formatDateTime, formatPrice } from "@/lib/format";

export type OrderRow = {
  id: string;
  userName: string;
  userEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
};

const columns: ColumnDef<OrderRow, unknown>[] = [
  {
    id: "id",
    header: () => <SortableHeader field="id" label="کد سفارش" />,
    cell: ({ row }) => (
      <span dir="ltr" className="font-mono text-xs">
        #{row.original.id.slice(-8).toUpperCase()}
      </span>
    ),
  },
  {
    id: "user",
    header: () => <SortableHeader field="user" label="کاربر" />,
    cell: ({ row }) => (
      <div className="min-w-32">
        <p className="font-medium">{row.original.userName}</p>
        <p dir="ltr" className="text-start text-xs text-muted-foreground">
          {row.original.userEmail}
        </p>
      </div>
    ),
  },
  {
    id: "totalAmount",
    header: () => <SortableHeader field="totalAmount" label="مبلغ" />,
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {formatPrice(row.original.totalAmount)}
      </span>
    ),
  },
  {
    id: "status",
    header: () => <SortableHeader field="status" label="وضعیت" />,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "createdAt",
    header: () => <SortableHeader field="createdAt" label="تاریخ" />,
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {formatDateTime(row.original.createdAt)}
      </span>
    ),
  },
];

const filters: TableFilter[] = [
  {
    key: "status",
    label: "وضعیت",
    options: ORDER_STATUSES.map((s) => ({
      value: s,
      label: ORDER_STATUS_META[s].label,
    })),
  },
];

type Props = {
  rows: OrderRow[];
  total: number;
  page: number;
  pageSize: number;
};

export function OrdersTable({ rows, total, page, pageSize }: Props) {
  return (
    <DataTable
      columns={columns}
      data={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      filters={filters}
      searchPlaceholder="جستجوی کد سفارش، نام یا ایمیل کاربر..."
      rowHref={(row) => `/admin/orders/${row.id}`}
    />
  );
}
