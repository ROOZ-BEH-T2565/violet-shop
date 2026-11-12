import { prisma } from "@/lib/prisma";
import type { CartItemData } from "@/types";

export async function getCartItems(userId: string): Promise<CartItemData[]> {
  return prisma.cartItem.findMany({
    where: { cart: { userId } },
    orderBy: { id: "asc" },
    select: {
      productId: true,
      quantity: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          discountPercent: true,
          stock: true,
          imageUrl: true,
        },
      },
    },
  });
}

/** مجموع تعداد آیتم‌های سبد خرید کاربر */
export async function getCartCount(userId: string): Promise<number> {
  const result = await prisma.cartItem.aggregate({
    where: { cart: { userId } },
    _sum: { quantity: true },
  });
  return result._sum.quantity ?? 0;
}
