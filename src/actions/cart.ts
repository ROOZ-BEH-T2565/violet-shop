"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import type { ActionResult } from "@/types";

const UNAUTH: ActionResult = {
  success: false,
  message: "برای ادامه ابتدا وارد حساب کاربری شوید.",
  code: "UNAUTHENTICATED",
};
const FAILED: ActionResult = {
  success: false,
  message: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
};

function refresh() {
  revalidatePath("/cart");
  revalidatePath("/", "layout"); // به‌روزرسانی نشان تعداد سبد در Header
}

export async function addToCart(
  productId: string,
  quantity = 1,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return UNAUTH;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, stock: true },
    });
    if (!product) return { success: false, message: "محصول یافت نشد." };
    if (product.stock < 1)
      return { success: false, message: "این محصول ناموجود است." };

    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
    const key = { cartId_productId: { cartId: cart.id, productId } };
    const existing = await prisma.cartItem.findUnique({ where: key });

    const qty = Math.min(
      (existing?.quantity ?? 0) + Math.max(1, quantity),
      product.stock,
    );
    if (existing && qty === existing.quantity) {
      return {
        success: false,
        message: "تعداد این محصول در سبد شما به حداکثر موجودی رسیده است.",
      };
    }

    await prisma.cartItem.upsert({
      where: key,
      update: { quantity: qty },
      create: { cartId: cart.id, productId, quantity: qty },
    });

    refresh();
    return { success: true, message: "به سبد خرید اضافه شد." };
  } catch (error) {
    console.error("addToCart error:", error);
    return FAILED;
  }
}

export async function updateQuantity(
  productId: string,
  quantity: number,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return UNAUTH;
  if (quantity < 1) return removeFromCart(productId);

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true },
    });
    if (!product) return { success: false, message: "محصول یافت نشد." };

    const qty = Math.min(Math.floor(quantity), product.stock);
    await prisma.cartItem.updateMany({
      where: { productId, cart: { userId } },
      data: { quantity: qty },
    });

    refresh();
    return { success: true, message: "تعداد به‌روزرسانی شد." };
  } catch (error) {
    console.error("updateQuantity error:", error);
    return FAILED;
  }
}

export async function removeFromCart(productId: string): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return UNAUTH;

  try {
    await prisma.cartItem.deleteMany({
      where: { productId, cart: { userId } },
    });
    refresh();
    return { success: true, message: "از سبد خرید حذف شد." };
  } catch (error) {
    console.error("removeFromCart error:", error);
    return FAILED;
  }
}

export async function clearCart(): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return UNAUTH;

  try {
    await prisma.cartItem.deleteMany({ where: { cart: { userId } } });
    refresh();
    return { success: true, message: "سبد خرید خالی شد." };
  } catch (error) {
    console.error("clearCart error:", error);
    return FAILED;
  }
}
