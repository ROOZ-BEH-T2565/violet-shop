import { prisma } from "@/lib/prisma";

export async function getWishlistIds(
  userId?: string | null,
): Promise<Set<string>> {
  if (!userId) return new Set();
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    select: { productId: true },
  });
  return new Set(items.map((i) => i.productId));
}
