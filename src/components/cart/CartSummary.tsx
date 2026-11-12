import { calcCartTotals } from "@/lib/cart-utils";
import { formatNumber, formatPrice } from "@/lib/format";
import type { CartItemData } from "@/types";

type Props = { items: CartItemData[]; children?: React.ReactNode };

export function CartSummary({ items, children }: Props) {
  const { count, subtotal, total, savings } = calcCartTotals(items);

  return (
    <aside className="space-y-4 rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] lg:sticky lg:top-24">
      <h2 className="text-lg font-extrabold">خلاصه‌ی سفارش</h2>

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">تعداد کالا</dt>
          <dd className="font-medium">{formatNumber(count)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">جمع کل</dt>
          <dd className="font-medium">{formatPrice(subtotal)}</dd>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-green-600">
            <dt>سود شما از تخفیف</dt>
            <dd className="font-medium">{formatPrice(savings)}</dd>
          </div>
        )}
        <div className="flex justify-between border-t pt-3 text-base">
          <dt className="font-bold">مبلغ قابل پرداخت</dt>
          <dd className="font-extrabold text-primary">{formatPrice(total)}</dd>
        </div>
      </dl>

      {children}
    </aside>
  );
}
