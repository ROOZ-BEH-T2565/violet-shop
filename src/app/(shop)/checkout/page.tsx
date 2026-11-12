import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { formatNumber, formatPrice, getFinalPrice } from "@/lib/format";
import { getCartItems } from "@/lib/cart";
import { getUserId } from "@/lib/session";
import { CartSummary } from "@/components/cart/CartSummary";
import { CheckoutButton } from "@/components/cart/CheckoutButton";

export const metadata: Metadata = { title: "تکمیل خرید" };

export default async function CheckoutPage() {
  const userId = await getUserId();
  if (!userId) redirect("/login?callbackUrl=/checkout");

  const items = await getCartItems(userId);
  if (items.length === 0) redirect("/cart");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">تکمیل خرید</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-3 rounded-2xl border bg-card p-5 lg:col-span-2">
          <h2 className="font-bold">اقلام سفارش</h2>
          <ul className="divide-y">
            {items.map(({ productId, quantity, product }) => (
              <li
                key={productId}
                className="flex items-center justify-between gap-4 py-3 text-sm"
              >
                <span className="line-clamp-1">
                  {product.name}
                  <span className="ms-2 text-muted-foreground">
                    × {formatNumber(quantity)}
                  </span>
                </span>
                <span className="shrink-0 font-medium">
                  {formatPrice(
                    getFinalPrice(product.price, product.discountPercent) *
                      quantity,
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <CartSummary items={items}>
          <CheckoutButton />
          <p className="text-center text-xs leading-6 text-muted-foreground">
            این پرداخت شبیه‌سازی شده است و مبلغی از حساب شما کسر نمی‌شود.
          </p>
        </CartSummary>
      </div>
    </div>
  );
}
