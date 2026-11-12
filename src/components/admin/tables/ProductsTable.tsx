"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, Minus, Pencil } from "lucide-react";
import { deleteProduct } from "@/actions/product";
import { DataTable } from "@/components/admin/DataTable";
import { SortableHeader } from "@/components/admin/SortableHeader";
import { formatDate, formatNumber, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ConfirmDelete } from "../ConfirmDelet";

export type ProductRow = {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  discountPercent: number;
  stock: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isPopular: boolean;
  createdAt: string;
};

function BoolCell({ value }: { value: boolean }) {
  return value ? (
    <Check className="h-4 w-4 text-green-600" />
  ) : (
    <Minus className="h-4 w-4 text-muted-foreground/50" />
  );
}

const columns: ColumnDef<ProductRow, unknown>[] = [
  {
    id: "name",
    header: () => <SortableHeader field="name" label="نام" />,
    cell: ({ row }) => (
      <span className="line-clamp-1 min-w-40 font-medium">
        {row.original.name}
      </span>
    ),
  },
  {
    id: "category",
    header: () => <SortableHeader field="category" label="دسته" />,
    cell: ({ row }) => row.original.categoryName,
  },
  {
    id: "price",
    header: () => <SortableHeader field="price" label="قیمت" />,
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {formatPrice(row.original.price)}
      </span>
    ),
  },
  {
    id: "discountPercent",
    header: () => <SortableHeader field="discountPercent" label="تخفیف" />,
    cell: ({ row }) =>
      row.original.discountPercent > 0 ? (
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-secondary-foreground">
          {formatNumber(row.original.discountPercent)}٪
        </span>
      ) : (
        <Minus className="h-4 w-4 text-muted-foreground/50" />
      ),
  },
  {
    id: "stock",
    header: () => <SortableHeader field="stock" label="موجودی" />,
    cell: ({ row }) => (
      <span
        className={cn(row.original.stock === 0 && "font-bold text-destructive")}
      >
        {formatNumber(row.original.stock)}
      </span>
    ),
  },
  {
    id: "isFeatured",
    header: () => <SortableHeader field="isFeatured" label="ویژه" />,
    cell: ({ row }) => <BoolCell value={row.original.isFeatured} />,
  },
  {
    id: "isBestSeller",
    header: () => <SortableHeader field="isBestSeller" label="پرفروش" />,
    cell: ({ row }) => <BoolCell value={row.original.isBestSeller} />,
  },
  {
    id: "isPopular",
    header: () => <SortableHeader field="isPopular" label="محبوب" />,
    cell: ({ row }) => <BoolCell value={row.original.isPopular} />,
  },
  {
    id: "createdAt",
    header: () => <SortableHeader field="createdAt" label="تاریخ" />,
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">عملیات</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Link
          href={`/admin/products/${row.original.id}/edit`}
          aria-label="ویرایش"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
        >
          <Pencil className="h-4 w-4" />
        </Link>
        <ConfirmDelete
          title="حذف محصول"
          description={`آیا از حذف «${row.original.name}» مطمئن هستید؟ این کار قابل بازگشت نیست.`}
          action={() => deleteProduct(row.original.id)}
        />
      </div>
    ),
  },
];

type Props = {
  rows: ProductRow[];
  total: number;
  page: number;
  pageSize: number;
};

export function ProductsTable({ rows, total, page, pageSize }: Props) {
  return (
    <DataTable
      columns={columns}
      data={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      searchPlaceholder="جستجوی نام یا اسلاگ محصول..."
    />
  );
}
