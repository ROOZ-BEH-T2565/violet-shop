"use server";

import { revalidatePath } from "next/cache";
import { getAdminId } from "@/lib/admin";
import { isUserRole } from "@/lib/admin-constants";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/types";

const FORBIDDEN: ActionResult = { success: false, message: "دسترسی غیرمجاز." };
const FAILED: ActionResult = {
  success: false,
  message: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
};

function prismaCode(error: unknown): string | undefined {
  return typeof error === "object" && error !== null && "code" in error
    ? String((error as { code: unknown }).code)
    : undefined;
}

export async function updateUserRole(
  userId: string,
  role: string,
): Promise<ActionResult> {
  const adminId = await getAdminId();
  if (!adminId) return FORBIDDEN;
  if (!isUserRole(role)) return { success: false, message: "نقش نامعتبر است." };
  if (userId === adminId) {
    return {
      success: false,
      message: "نقش حساب کاربری خودتان را نمی‌توانید تغییر دهید.",
    };
  }

  try {
    await prisma.user.update({ where: { id: userId }, data: { role } });
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    return { success: true, message: "نقش کاربر به‌روزرسانی شد." };
  } catch (error) {
    if (prismaCode(error) === "P2025")
      return { success: false, message: "کاربر یافت نشد." };
    console.error("updateUserRole error:", error);
    return FAILED;
  }
}

export async function deleteUser(userId: string): Promise<ActionResult> {
  const adminId = await getAdminId();
  if (!adminId) return FORBIDDEN;
  if (userId === adminId) {
    return {
      success: false,
      message: "حساب کاربری خودتان را نمی‌توانید حذف کنید.",
    };
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { success: true, message: "کاربر حذف شد." };
  } catch (error) {
    const code = prismaCode(error);
    if (code === "P2003") {
      return {
        success: false,
        message: "این کاربر سفارش ثبت کرده و قابل حذف نیست.",
      };
    }
    if (code === "P2025") return { success: false, message: "کاربر یافت نشد." };
    console.error("deleteUser error:", error);
    return FAILED;
  }
}
