"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getAdminId } from "@/lib/admin";
import { isOrderStatus } from "@/lib/admin-constants";
import { getFinalPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import type { ActionResult } from "@/types";

export type OrderResult = ActionResult & { orderId?: string };

type Line = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

class OutOfStockError extends Error {
  productName: string;
  constructor(productName: string) {
    super("OUT_OF_STOCK");
    this.productName = productName;
  }
}

const FAILED: OrderResult = {
  success: false,
  message: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
};

/**
 * درگاه پرداخت شبیه‌سازی‌شده.
 * TODO: اینجا را با درگاه واقعی (زرین‌پال، IDPay و ...) جایگزین کنید:
 * ساخت تراکنش، ریدایرکت کاربر به درگاه و verify در صفحه‌ی callback.
 */
async function simulatePayment(
  _orderId: string,
  _amount: number,
): Promise<{ success: boolean; ref: string }> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    success: true,
    ref: `SIM-${randomBytes(5).toString("hex").toUpperCase()}`,
  };
}

async function releaseOrder(orderId: string, lines: Line[]) {
  await prisma.$transaction([
    ...lines.map((l) =>
      prisma.product.update({
        where: { id: l.productId },
        data: { stock: { increment: l.quantity } },
      }),
    ),
    prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    }),
  ]);
}

export async function placeOrder(): Promise<OrderResult> {
  const userId = await getUserId();
  if (!userId) {
    return {
      success: false,
      message: "برای ادامه ابتدا وارد شوید.",
      code: "UNAUTHENTICATED",
    };
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart || cart.items.length === 0) {
      return { success: false, message: "سبد خرید شما خالی است." };
    }

    const lines: Line[] = cart.items.map((i) => ({
      productId: i.productId,
      name: i.product.name,
      quantity: i.quantity,
      unitPrice: getFinalPrice(i.product.price, i.product.discountPercent),
    }));
    const total = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

    // ۱) رزرو موجودی + ساخت سفارش با وضعیت PENDING (اتمیک)
    let orderId: string;
    try {
      const order = await prisma.$transaction(async (tx) => {
        for (const l of lines) {
          const res = await tx.product.updateMany({
            where: { id: l.productId, stock: { gte: l.quantity } },
            data: { stock: { decrement: l.quantity } },
          });
          if (res.count === 0) throw new OutOfStockError(l.name);
        }
        return tx.order.create({
          data: {
            userId,
            totalAmount: total,
            status: "PENDING",
            items: {
              create: lines.map(({ productId, quantity, unitPrice }) => ({
                productId,
                quantity,
                unitPrice,
              })),
            },
          },
        });
      });
      orderId = order.id;
    } catch (error) {
      if (error instanceof OutOfStockError) {
        return {
          success: false,
          message: `موجودی «${error.productName}» کافی نیست. تعداد را در سبد خرید اصلاح کنید.`,
        };
      }
      throw error;
    }

    // ۲) پرداخت (شبیه‌سازی)
    const payment = await simulatePayment(orderId, total);
    if (!payment.success) {
      await releaseOrder(orderId, lines);
      return {
        success: false,
        message: "پرداخت ناموفق بود. مبلغی از حساب شما کسر نشد.",
      };
    }

    // ۳) تأیید پرداخت + خالی کردن سبد
    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID", paymentRef: payment.ref },
      }),
      prisma.cartItem.deleteMany({ where: { cartId: cart.id } }),
    ]);

    revalidatePath("/cart");
    revalidatePath("/", "layout");
    return { success: true, message: "سفارش شما با موفقیت ثبت شد.", orderId };
  } catch (error) {
    console.error("placeOrder error:", error);
    return FAILED;
  }
}

const FORBIDDEN: ActionResult = { success: false, message: "دسترسی غیرمجاز." };

/** تغییر وضعیت سفارش توسط ادمین. لغو سفارش، موجودی کالاها را به انبار برمی‌گرداند و برگشت‌پذیر نیست. */
export async function updateOrderStatus(
  orderId: string,
  status: string,
): Promise<ActionResult> {
  if (!(await getAdminId())) return FORBIDDEN;
  if (!isOrderStatus(status))
    return { success: false, message: "وضعیت نامعتبر است." };

  try {
    const outcome = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!order) return "NOT_FOUND" as const;
      if (order.status === "CANCELLED") return "LOCKED" as const;
      if (order.status === status) return "SAME" as const;

      if (status === "CANCELLED") {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
      await tx.order.update({ where: { id: orderId }, data: { status } });
      return "OK" as const;
    });

    if (outcome === "NOT_FOUND")
      return { success: false, message: "سفارش یافت نشد." };
    if (outcome === "LOCKED")
      return { success: false, message: "سفارش لغوشده قابل تغییر نیست." };
    if (outcome === "SAME")
      return { success: false, message: "وضعیت سفارش همین است." };

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin");
    if (status === "CANCELLED") revalidatePath("/products");
    return { success: true, message: "وضعیت سفارش به‌روزرسانی شد." };
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return FAILED;
  }
}
