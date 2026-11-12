import type { ProductCardData } from "@/types";
import { ProductSection } from "./ProductSection";

type Props = { products: ProductCardData[]; wishlist?: Set<string> };

export function DiscountedProducts({ products, wishlist }: Props) {
  return (
    <ProductSection
      title="تخفیف‌دارها"
      subtitle="فرصت خرید با قیمت ویژه"
      href="/products?sort=discount"
      products={products}
      wishlist={wishlist}
    />
  );
}
