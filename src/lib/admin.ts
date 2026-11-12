import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * شناسه‌ی ادمین را برمی‌گرداند؛ در غیر این صورت null.
 * نقش از دیتابیس خوانده می‌شود (نه فقط JWT) تا تغییر نقش فوراً اعمال شود.
 */
export async function getAdminId(): Promise<string | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { role: true },
  });
  return user?.role === "ADMIN" ? id : null;
}
