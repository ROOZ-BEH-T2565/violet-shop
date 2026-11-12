"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, type TableFilter } from "@/components/admin/DataTable";
import { SortableHeader } from "@/components/admin/SortableHeader";
import { ROLE_LABELS, USER_ROLES, isUserRole } from "@/lib/admin-constants";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

const columns: ColumnDef<UserRow, unknown>[] = [
  {
    id: "name",
    header: () => <SortableHeader field="name" label="نام" />,
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    id: "email",
    header: () => <SortableHeader field="email" label="ایمیل" />,
    cell: ({ row }) => (
      <span dir="ltr" className="block text-start">
        {row.original.email}
      </span>
    ),
  },
  {
    id: "role",
    header: () => <SortableHeader field="role" label="نقش" />,
    cell: ({ row }) => (
      <span
        className={cn(
          "inline-block rounded-full px-2.5 py-1 text-xs font-bold",
          row.original.role === "ADMIN"
            ? "bg-violet-100 text-violet-800"
            : "bg-muted text-muted-foreground",
        )}
      >
        {isUserRole(row.original.role)
          ? ROLE_LABELS[row.original.role]
          : row.original.role}
      </span>
    ),
  },
  {
    id: "createdAt",
    header: () => <SortableHeader field="createdAt" label="تاریخ عضویت" />,
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
];

const filters: TableFilter[] = [
  {
    key: "role",
    label: "نقش",
    options: USER_ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] })),
  },
];

type Props = { rows: UserRow[]; total: number; page: number; pageSize: number };

export function UsersTable({ rows, total, page, pageSize }: Props) {
  return (
    <DataTable
      columns={columns}
      data={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      filters={filters}
      searchPlaceholder="جستجوی نام یا ایمیل..."
      rowHref={(row) => `/admin/users/${row.id}`}
    />
  );
}
