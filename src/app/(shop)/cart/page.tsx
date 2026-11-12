import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { getCartItems } from "@/lib/cart";
import { getUserId } from "@/lib/session";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";

export const metadata: Metadata = { title: "سبد خرید" };

export default async function CartPage() {
  const userId = await getUserId();
  if (!userId) redirect("/login?callbackUrl=/cart");

  const items = await getCartItems(userId);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-violet-300" />
        <h1 className="text-xl font-extrabold">سبد خرید شما خالی است</h1>
        <p className="text-muted-foreground">
          از میان محصولات ما چیزی انتخاب کنید.
        </p>
        <Link
          href="/products"
          className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-violet-700"
        >
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">سبد خرید</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <ul className="space-y-3 lg:col-span-2">
          {items.map((item) => (
            <CartItemRow key={item.productId} item={item} />
          ))}
        </ul>

        <CartSummary items={items}>
          <Link
            href="/checkout"
            className="flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition hover:bg-violet-700"
          >
            ادامه و پرداخت
          </Link>
        </CartSummary>
      </div>
    </div>
  );
}
