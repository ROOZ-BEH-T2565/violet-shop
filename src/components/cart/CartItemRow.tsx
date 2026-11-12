"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { removeFromCart, updateQuantity } from "@/actions/cart";
import { formatNumber, formatPrice, getFinalPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CartItemData } from "@/types";
import { ProductImage } from "@/components/product/ProductImage";

type Props = { item: CartItemData; compact?: boolean; onNavigate?: () => void };

export function CartItemRow({ item, compact = false, onNavigate }: Props) {
  const [pending, startTransition] = useTransition();
  const { product, quantity } = item;
  const unit = getFinalPrice(product.price, product.discountPercent);

  const change = (next: number) =>
    startTransition(async () => {
      const result = await updateQuantity(item.productId, next);
      if (!result.success) toast.error(result.message);
    });

  const remove = () =>
    startTransition(async () => {
      const result = await removeFromCart(item.productId);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });

  const stepper =
    "flex h-8 w-8 items-center justify-center rounded-full border transition-colors hover:bg-muted disabled:opacity-40";

  return (
    <li
      className={cn(
        "flex gap-3 rounded-2xl border bg-card p-3",
        pending && "opacity-60",
      )}
    >
      <Link
        href={`/products/${product.slug}`}
        onClick={onNavigate}
        className={cn(
          "group relative shrink-0 overflow-hidden rounded-xl bg-muted",
          compact ? "h-20 w-20" : "h-24 w-24 sm:h-28 sm:w-28",
        )}
      >
        <ProductImage src={product.imageUrl} alt={product.name} sizes="112px" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${product.slug}`}
            onClick={onNavigate}
            className="line-clamp-2 text-sm font-semibold leading-6 hover:text-primary"
          >
            {product.name}
          </Link>
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            aria-label="حذف از سبد"
            className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={stepper}
              onClick={() => change(quantity - 1)}
              disabled={pending}
              aria-label="کم کردن"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-6 text-center text-sm font-bold">
              {formatNumber(quantity)}
            </span>
            <button
              type="button"
              className={stepper}
              onClick={() => change(quantity + 1)}
              disabled={pending || quantity >= product.stock}
              aria-label="زیاد کردن"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-sm font-bold text-primary">
            {formatPrice(unit * quantity)}
          </p>
        </div>
      </div>
    </li>
  );
}
