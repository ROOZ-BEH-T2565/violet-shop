import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getOrderBy } from "@/lib/sort-map";

export const PAGE_SIZE = 12;

export type ProductQuery = {
  q?: string;
  category?: string;
  sort?: string;
  page?: number;
};

export async function getProducts({
  q,
  category,
  sort,
  page = 1,
}: ProductQuery) {
  const where: Prisma.ProductWhereInput = {
    ...(category ? { category: { slug: category } } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: getOrderBy("product", sort),
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getHomeSections(take = 8) {
  const newest = [{ createdAt: "desc" as const }];
  const [bestSellers, popular, discounted, featured] = await Promise.all([
    prisma.product.findMany({
      where: { isBestSeller: true },
      orderBy: newest,
      take,
    }),
    prisma.product.findMany({
      where: { isPopular: true },
      orderBy: newest,
      take,
    }),
    prisma.product.findMany({
      where: { discountPercent: { gt: 0 } },
      orderBy: [{ discountPercent: "desc" }],
      take,
    }),
    prisma.product.findMany({
      where: { isFeatured: true },
      orderBy: newest,
      take,
    }),
  ]);
  return { bestSellers, popular, discounted, featured };
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  take = 4,
) {
  return prisma.product.findMany({
    where: { categoryId, id: { not: excludeId } },
    orderBy: { createdAt: "desc" },
    take,
  });
}
