import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { isOrderStatus } from "@/lib/admin-constants";
import { formatDateTime, formatNumber, formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "جزئیات سفارش" };

export default async function AdminOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: { include: { product: { select: { id: true, name: true } } } },
    },
  });
  if (!order || !isOrderStatus(order.status)) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به سفارش‌ها
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold">
          سفارش{" "}
          <span dir="ltr" className="font-mono">
            #{order.id.slice(-8).toUpperCase()}
          </span>
        </h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-3 rounded-2xl border bg-card p-5 lg:col-span-2">
          <h2 className="font-bold">اقلام سفارش</h2>
          <ul className="divide-y text-sm">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3"
              >
                <span className="font-medium">
                  {item.product.name}
                  <span className="ms-2 text-muted-foreground">
                    × {formatNumber(item.quantity)}
                  </span>
                </span>
                <span className="text-muted-foreground">
                  {formatPrice(item.unitPrice)}
                </span>
                <span className="font-bold">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t pt-3 text-base font-extrabold">
            <span>جمع کل</span>
            <span className="text-primary">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </section>

        <div className="space-y-6">
          <section className="space-y-3 rounded-2xl border bg-card p-5 text-sm">
            <h2 className="font-bold">اطلاعات سفارش</h2>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">مشتری</span>
              <Link
                href={`/admin/users/${order.user.id}`}
                className="font-medium hover:text-primary"
              >
                {order.user.name ?? order.user.email}
              </Link>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">ایمیل</span>
              <span dir="ltr">{order.user.email}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">تاریخ ثبت</span>
              <span>{formatDateTime(order.createdAt)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">کد پیگیری</span>
              <span dir="ltr" className="font-mono text-xs">
                {order.paymentRef ?? "—"}
              </span>
            </div>
          </section>

          <OrderStatusForm orderId={order.id} current={order.status} />
        </div>
      </div>
    </div>
  );
}
