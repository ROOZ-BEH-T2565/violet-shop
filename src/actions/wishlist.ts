"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import type { ActionResult } from "@/types";

export type WishlistResult = ActionResult & { active?: boolean };

export async function toggleWishlist(
  productId: string,
): Promise<WishlistResult> {
  const userId = await getUserId();
  if (!userId) {
    return {
      success: false,
      message: "برای افزودن به علاقه‌مندی‌ها وارد شوید.",
      code: "UNAUTHENTICATED",
    };
  }

  try {
    const key = { userId_productId: { userId, productId } };
    const existing = await prisma.wishlistItem.findUnique({ where: key });

    if (existing) {
      await prisma.wishlistItem.delete({ where: key });
      revalidatePath("/wishlist");
      return {
        success: true,
        active: false,
        message: "از علاقه‌مندی‌ها حذف شد.",
      };
    }

    await prisma.wishlistItem.create({ data: { userId, productId } });
    revalidatePath("/wishlist");
    return {
      success: true,
      active: true,
      message: "به علاقه‌مندی‌ها اضافه شد.",
    };
  } catch (error) {
    console.error("toggleWishlist error:", error);
    return { success: false, message: "خطایی رخ داد. لطفاً دوباره تلاش کنید." };
  }
}
