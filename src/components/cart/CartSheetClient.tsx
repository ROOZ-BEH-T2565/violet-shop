"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { calcCartTotals } from "@/lib/cart-utils";
import { formatPrice } from "@/lib/format";
import type { CartItemData } from "@/types";
import { CartBadge } from "./CartBadge";
import { CartItemRow } from "./CartItemRow";

export function CartSheetClient({ items }: { items: CartItemData[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const { count, total } = calcCartTotals(items);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="سبد خرید"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
      >
        <ShoppingCart className="h-5 w-5" />
        <CartBadge count={count} />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>سبد خرید</SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
              <ShoppingBag className="h-12 w-12 text-violet-300" />
              <p>سبد خرید شما خالی است.</p>
              <Link
                href="/products"
                onClick={close}
                className="text-sm font-medium text-primary hover:underline"
              >
                مشاهده محصولات
              </Link>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              <ul className="flex-1 space-y-3 overflow-y-auto px-4">
                {items.map((item) => (
                  <CartItemRow
                    key={item.productId}
                    item={item}
                    compact
                    onNavigate={close}
                  />
                ))}
              </ul>

              <div className="space-y-3 border-t p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    مبلغ قابل پرداخت
                  </span>
                  <span className="text-base font-extrabold text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition hover:bg-violet-700"
                >
                  ادامه و پرداخت
                </Link>
                <Link
                  href="/cart"
                  onClick={close}
                  className="flex h-11 items-center justify-center rounded-full border px-6 text-sm font-medium transition hover:bg-muted"
                >
                  مشاهده سبد خرید
                </Link>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
