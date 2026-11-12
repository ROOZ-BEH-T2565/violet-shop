"use server";

import { revalidatePath } from "next/cache";
import { getAdminId } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import { contactSchema, type ContactValues } from "@/lib/validators";
import type { ActionResult } from "@/types";

export async function submitContact(
  values: ContactValues,
): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است.",
    };
  }

  try {
    const userId = await getUserId();
    await prisma.contactMessage.create({
      data: { ...parsed.data, email: parsed.data.email.toLowerCase(), userId },
    });
    return {
      success: true,
      message: "پیام شما ارسال شد. به‌زودی پاسخ می‌دهیم.",
    };
  } catch (error) {
    console.error("submitContact error:", error);
    return {
      success: false,
      message: "ارسال پیام ناموفق بود. لطفاً دوباره تلاش کنید.",
    };
  }
}

/** تغییر وضعیت خوانده‌شده/خوانده‌نشده‌ی پیام (فقط ادمین) */
export async function toggleMessageRead(id: string): Promise<ActionResult> {
  if (!(await getAdminId()))
    return { success: false, message: "دسترسی غیرمجاز." };

  try {
    const message = await prisma.contactMessage.findUnique({
      where: { id },
      select: { isRead: true },
    });
    if (!message) return { success: false, message: "پیام یافت نشد." };

    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: !message.isRead },
    });
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return {
      success: true,
      message: message.isRead
        ? "پیام به «خوانده‌نشده» تغییر کرد."
        : "پیام «خوانده‌شده» علامت خورد.",
    };
  } catch (error) {
    console.error("toggleMessageRead error:", error);
    return { success: false, message: "خطایی رخ داد. لطفاً دوباره تلاش کنید." };
  }
}
