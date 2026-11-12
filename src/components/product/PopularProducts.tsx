import type { ProductCardData } from "@/types";
import { ProductSection } from "./ProductSection";

type Props = { products: ProductCardData[]; wishlist?: Set<string> };

export function PopularProducts({ products, wishlist }: Props) {
  return (
    <ProductSection
      title="محبوب‌ترین‌ها"
      subtitle="انتخاب‌های موردعلاقه‌ی مشتریان ویولت‌شاپ"
      href="/products?sort=popular"
      products={products}
      wishlist={wishlist}
    />
  );
}
