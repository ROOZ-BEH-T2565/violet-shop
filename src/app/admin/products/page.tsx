import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Prisma } from "@/generated/prisma/client";
import { ExportExcelButton } from "@/components/admin/ExportExcelButton";
import {
  ProductsTable,
  type ProductRow,
} from "@/components/admin/tables/ProductsTable";
import { prisma } from "@/lib/prisma";
import { getOrderBy } from "@/lib/sort-map";

export const metadata: Metadata = { title: "محصولات" };

const PAGE_SIZE = 10;

type SearchParams = Promise<{ q?: string; sort?: string; page?: string }>;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, sort, page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const query = q?.trim();

  const where: Prisma.ProductWhereInput = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: getOrderBy("product", sort),
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: { select: { name: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  const rows: ProductRow[] = items.map((p) => ({
    id: p.id,
    name: p.name,
    categoryName: p.category.name,
    price: p.price,
    discountPercent: p.discountPercent,
    stock: p.stock,
    isFeatured: p.isFeatured,
    isBestSeller: p.isBestSeller,
    isPopular: p.isPopular,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">محصولات</h1>
        <div className="flex items-center gap-2">
          <ExportExcelButton entity="products" />
          <Link
            href="/admin/products/new"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-violet-700"
          >
            <Plus className="h-4 w-4" />
            افزودن محصول
          </Link>
        </div>
      </div>

      <ProductsTable
        rows={rows}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
