import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { formatDateTime, formatNumber, formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";

export const metadata: Metadata = { title: "سفارش ثبت شد" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  const userId = await getUserId();
  if (!userId || !orderId) redirect("/");

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: { include: { product: { select: { name: true } } } } },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-xl space-y-6 text-center">
      <CheckCircle2 className="mx-auto h-20 w-20 text-green-500" />
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold">سفارش شما با موفقیت ثبت شد</h1>
        <p className="text-muted-foreground">از خرید شما سپاسگزاریم.</p>
      </div>

      <div className="space-y-3 rounded-2xl border bg-card p-5 text-start text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">کد سفارش</span>
          <span dir="ltr" className="font-mono">
            {order.id.slice(-8).toUpperCase()}
          </span>
        </div>
        {order.paymentRef && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">کد پیگیری پرداخت</span>
            <span dir="ltr" className="font-mono">
              {order.paymentRef}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">تاریخ</span>
          <span>{formatDateTime(order.createdAt)}</span>
        </div>
        <ul className="divide-y border-y">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3 py-2">
              <span className="line-clamp-1">
                {item.product.name}
                <span className="ms-2 text-muted-foreground">
                  × {formatNumber(item.quantity)}
                </span>
              </span>
              <span className="shrink-0">
                {formatPrice(item.unitPrice * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between text-base font-extrabold">
          <span>مبلغ پرداخت‌شده</span>
          <span className="text-primary">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      <Link
        href="/products"
        className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-violet-700"
      >
        ادامه‌ی خرید
      </Link>
    </div>
  );
}
