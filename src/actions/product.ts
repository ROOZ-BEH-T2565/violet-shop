"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getAdminId } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { productSchema, type ProductValues } from "@/lib/validators";
import type { ActionResult } from "@/types";

export type ProductResult = ActionResult & { id?: string };

const FORBIDDEN: ProductResult = { success: false, message: "دسترسی غیرمجاز." };
const FAILED: ProductResult = {
  success: false,
  message: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
};

function prismaCode(error: unknown): string | undefined {
  return typeof error === "object" && error !== null && "code" in error
    ? String((error as { code: unknown }).code)
    : undefined;
}

function refresh() {
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/", "layout");
}

export async function createProduct(
  values: ProductValues,
): Promise<ProductResult> {
  if (!(await getAdminId())) return FORBIDDEN;

  const parsed = productSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است.",
    };
  }

  try {
    const { slug, ...data } = parsed.data;
    const product = await prisma.product.create({
      data: {
        ...data,
        slug: slug || `product-${randomBytes(4).toString("hex")}`,
      },
    });
    refresh();
    return {
      success: true,
      message: "محصول با موفقیت ایجاد شد.",
      id: product.id,
    };
  } catch (error) {
    if (prismaCode(error) === "P2002") {
      return { success: false, message: "این اسلاگ قبلاً استفاده شده است." };
    }
    console.error("createProduct error:", error);
    return FAILED;
  }
}

export async function updateProduct(
  id: string,
  values: ProductValues,
): Promise<ProductResult> {
  if (!(await getAdminId())) return FORBIDDEN;

  const parsed = productSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است.",
    };
  }

  try {
    const { slug, ...data } = parsed.data;
    await prisma.product.update({
      where: { id },
      // اگر اسلاگ خالی بماند، اسلاگ فعلی حفظ می‌شود
      data: slug ? { ...data, slug } : data,
    });
    refresh();
    return { success: true, message: "تغییرات ذخیره شد.", id };
  } catch (error) {
    const code = prismaCode(error);
    if (code === "P2002")
      return { success: false, message: "این اسلاگ قبلاً استفاده شده است." };
    if (code === "P2025") return { success: false, message: "محصول یافت نشد." };
    console.error("updateProduct error:", error);
    return FAILED;
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  if (!(await getAdminId())) return FORBIDDEN;

  try {
    await prisma.product.delete({ where: { id } });
    refresh();
    return { success: true, message: "محصول حذف شد." };
  } catch (error) {
    const code = prismaCode(error);
    if (code === "P2003") {
      return {
        success: false,
        message:
          "این محصول در سفارش‌ها استفاده شده و قابل حذف نیست. موجودی آن را صفر کنید.",
      };
    }
    if (code === "P2025") return { success: false, message: "محصول یافت نشد." };
    console.error("deleteProduct error:", error);
    return FAILED;
  }
}
