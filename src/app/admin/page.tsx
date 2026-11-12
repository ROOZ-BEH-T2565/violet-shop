import Link from "next/link";
import { Mail, Package, Receipt, Users, Wallet } from "lucide-react";
import { formatDateTime, formatNumber, formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [products, orders, users, unread, revenue, recent] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
      _sum: { totalAmount: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const stats = [
    {
      label: "محصولات",
      value: formatNumber(products),
      icon: Package,
      href: "/admin/products",
    },
    {
      label: "سفارش‌ها",
      value: formatNumber(orders),
      icon: Receipt,
      href: "/admin/orders",
    },
    {
      label: "کاربران",
      value: formatNumber(users),
      icon: Users,
      href: "/admin/users",
    },
    {
      label: "پیام‌های خوانده‌نشده",
      value: formatNumber(unread),
      icon: Mail,
      href: "/admin/messages",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">داشبورد</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-4 rounded-2xl border bg-card p-5 transition hover:shadow-[var(--shadow-soft)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-extrabold">{value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4 rounded-2xl border bg-card p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
          <Wallet className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            مجموع فروش (سفارش‌های پرداخت‌شده)
          </p>
          <p className="text-2xl font-extrabold text-primary">
            {formatPrice(revenue._sum.totalAmount ?? 0)}
          </p>
        </div>
      </div>

      <section className="space-y-3 rounded-2xl border bg-card p-5">
        <h2 className="font-bold">آخرین سفارش‌ها</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            هنوز سفارشی ثبت نشده است.
          </p>
        ) : (
          <ul className="divide-y text-sm">
            {recent.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 transition-colors hover:text-primary"
                >
                  <span>{o.user.name ?? o.user.email}</span>
                  <span className="text-muted-foreground">
                    {formatDateTime(o.createdAt)}
                  </span>
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
  );
}
