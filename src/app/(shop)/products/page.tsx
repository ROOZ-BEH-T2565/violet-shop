import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { formatNumber } from "@/lib/format";
import { getCategories, getProducts } from "@/lib/products";
import { getWishlistIds } from "@/lib/wishlist";
import { CategoryFilter } from "@/components/product/CategoryFilter";
import { Pagination } from "@/components/product/Pagination";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductSearch } from "@/components/product/ProductSearch";
import { ProductSort } from "@/components/product/ProductSort";

export const metadata: Metadata = { title: "محصولات" };

type SearchParams = Promise<{
  q?: string;
  category?: string;
  sort?: string;
  page?: string;
}>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, category, sort, page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const query = q?.trim() || undefined;

  const session = await auth();
  const [{ items, total, totalPages }, categories, wishlist] =
    await Promise.all([
      getProducts({ q: query, category, sort, page }),
      getCategories(),
      getWishlistIds(session?.user?.id),
    ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-extrabold">محصولات</h1>
        <div className="flex w-full items-center gap-2 sm:w-auto sm:min-w-96">
          <ProductSearch q={query} category={category} sort={sort} />
          <ProductSort current={sort} />
        </div>
      </div>

      <CategoryFilter
        categories={categories}
        current={category}
        q={query}
        sort={sort}
      />

      <p className="text-sm text-muted-foreground">
        {formatNumber(total)} محصول
      </p>

      <ProductGrid products={items} wishlist={wishlist} />

      <Pagination
        page={page}
        totalPages={totalPages}
        params={{ q: query, category, sort }}
      />
    </div>
  );
}
