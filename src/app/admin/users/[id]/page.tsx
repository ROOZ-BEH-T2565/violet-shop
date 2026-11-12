import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { UserRoleForm } from "@/components/admin/UserRoleForm";
import { getAdminId } from "@/lib/admin";
import { ROLE_LABELS, isUserRole } from "@/lib/admin-constants";
import {
  formatDate,
  formatDateTime,
  formatNumber,
  formatPrice,
} from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { DeleteUserButton } from "@/components/admin/DeletUserButton";

export const metadata: Metadata = { title: "جزئیات کاربر" };

export default async function AdminUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [user, adminId] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
        orders: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    }),
    getAdminId(),
  ]);
  if (!user || !isUserRole(user.role)) notFound();

  const isSelf = user.id === adminId;
  const displayName = user.name ?? user.email;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به کاربران
      </Link>

      <h1 className="text-2xl font-extrabold">{displayName}</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="space-y-3 rounded-2xl border bg-card p-5 text-sm">
            <h2 className="font-bold">اطلاعات کاربر</h2>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">ایمیل</span>
              <span dir="ltr">{user.email}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">نقش</span>
              <span>{ROLE_LABELS[user.role]}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">تاریخ عضویت</span>
              <span>{formatDate(user.createdAt)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">تعداد سفارش‌ها</span>
              <span>{formatNumber(user._count.orders)}</span>
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border bg-card p-5">
            <h2 className="font-bold">آخرین سفارش‌ها</h2>
            {user.orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                این کاربر هنوز سفارشی ثبت نکرده است.
              </p>
            ) : (
              <ul className="divide-y text-sm">
                {user.orders.map((o) => (
                  <li key={o.id}>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="flex flex-wrap items-center justify-between gap-2 py-3 transition-colors hover:text-primary"
                    >
                      <span className="text-muted-foreground">
                        {formatDateTime(o.createdAt)}
                      </span>
                      <StatusBadge status={o.status} />
                      <span className="font-bold">
                        {formatPrice(o.totalAmount)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <UserRoleForm userId={user.id} current={user.role} isSelf={isSelf} />
          {!isSelf && (
            <div className="rounded-2xl border border-destructive/30 bg-card p-5">
              <DeleteUserButton userId={user.id} userName={displayName} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
