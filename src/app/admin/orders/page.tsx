import type { Metadata } from "next";
import type { Prisma } from "@/generated/prisma/client";
import { ExportExcelButton } from "@/components/admin/ExportExcelButton";
import {
  OrdersTable,
  type OrderRow,
} from "@/components/admin/tables/OrdersTable";
import { isOrderStatus } from "@/lib/admin-constants";
import { prisma } from "@/lib/prisma";
import { getOrderBy } from "@/lib/sort-map";

export const metadata: Metadata = { title: "سفارش‌ها" };

const PAGE_SIZE = 10;

type SearchParams = Promise<{
  q?: string;
  sort?: string;
  status?: string;
  page?: string;
}>;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, sort, status, page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const query = q?.trim();

  const where: Prisma.OrderWhereInput = {
    ...(status && isOrderStatus(status) ? { status } : {}),
    ...(query
      ? {
          OR: [
            { id: { contains: query, mode: "insensitive" } },
            { user: { name: { contains: query, mode: "insensitive" } } },
            { user: { email: { contains: query, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: getOrderBy("order", sort),
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.order.count({ where }),
  ]);

  const rows: OrderRow[] = items.map((o) => ({
    id: o.id,
    userName: o.user.name ?? "—",
    userEmail: o.user.email,
    totalAmount: o.totalAmount,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">سفارش‌ها</h1>
        <ExportExcelButton entity="orders" />
      </div>
      <OrdersTable rows={rows} total={total} page={page} pageSize={PAGE_SIZE} />
    </div>
  );
}
