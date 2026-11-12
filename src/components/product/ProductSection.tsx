import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ProductCardData } from "@/types";
import { ProductGrid } from "./ProductGrid";

type Props = {
  title: string;
  subtitle?: string;
  href?: string;
  products: ProductCardData[];
  wishlist?: Set<string>;
};

export function ProductSection({
  title,
  subtitle,
  href = "/products",
  products,
  wishlist,
}: Props) {
  if (products.length === 0) return null;

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold sm:text-2xl">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          مشاهده همه
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </div>
      <ProductGrid products={products} wishlist={wishlist} />
    </section>
  );
}
