import type { Metadata } from "next";
import type { Prisma } from "@/generated/prisma/client";
import { ExportExcelButton } from "@/components/admin/ExportExcelButton";
import { UsersTable, type UserRow } from "@/components/admin/tables/UsersTable";
import { isUserRole } from "@/lib/admin-constants";
import { prisma } from "@/lib/prisma";
import { getOrderBy } from "@/lib/sort-map";

export const metadata: Metadata = { title: "کاربران" };

const PAGE_SIZE = 10;

type SearchParams = Promise<{
  q?: string;
  sort?: string;
  role?: string;
  page?: string;
}>;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, sort, role, page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const query = q?.trim();

  const where: Prisma.UserWhereInput = {
    ...(role && isUserRole(role) ? { role } : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: getOrderBy("user", sort),
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  const rows: UserRow[] = items.map((u) => ({
    id: u.id,
    name: u.name ?? "—",
    email: u.email,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">کاربران</h1>
        <ExportExcelButton entity="users" />
      </div>
      <UsersTable rows={rows} total={total} page={page} pageSize={PAGE_SIZE} />
    </div>
  );
}
