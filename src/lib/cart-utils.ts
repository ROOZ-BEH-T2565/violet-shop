import { getFinalPrice } from "@/lib/format";
import type { CartItemData } from "@/types";

/** تابع خالص (بدون Prisma)؛ هم در سرور و هم در کلاینت قابل استفاده است. */
export function calcCartTotals(items: CartItemData[]) {
  let count = 0;
  let subtotal = 0;
  let total = 0;

  for (const { quantity, product } of items) {
    count += quantity;
    subtotal += product.price * quantity;
    total += getFinalPrice(product.price, product.discountPercent) * quantity;
  }

  return { count, subtotal, total, savings: subtotal - total };
}
