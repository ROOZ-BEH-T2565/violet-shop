import { PackageSearch } from "lucide-react";
import type { ProductCardData } from "@/types";
import { ProductCard } from "./ProductCard";

type Props = {
  products: ProductCardData[];
  wishlist?: Set<string>;
};

export function ProductGrid({ products, wishlist }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center text-muted-foreground">
        <PackageSearch className="h-12 w-12 text-violet-300" />
        <p>محصولی پیدا نشد.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          wishlisted={wishlist?.has(product.id) ?? false}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
