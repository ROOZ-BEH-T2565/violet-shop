import type { ProductCardData } from "@/types";
import { ProductSection } from "./ProductSection";

type Props = { products: ProductCardData[]; wishlist?: Set<string> };

export function BestSellers({ products, wishlist }: Props) {
  return (
    <ProductSection
      title="پرفروش‌ترین‌ها"
      subtitle="محصولاتی که بیشتر از همه خریداری شده‌اند"
      href="/products?sort=popular"
      products={products}
      wishlist={wishlist}
    />
  );
}
