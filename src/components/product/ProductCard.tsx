import Link from "next/link";
import { formatNumber, formatPrice, getFinalPrice } from "@/lib/format";
import type { ProductCardData } from "@/types";
import { AddToCartButton } from "./AddToCartButton";
import { ProductImage } from "./ProductImage";
import { WishlistButton } from "./WishlistButton";

type Props = {
  product: ProductCardData;
  wishlisted?: boolean;
  priority?: boolean;
};

export function ProductCard({
  product,
  wishlisted = false,
  priority = false,
}: Props) {
  const hasDiscount = product.discountPercent > 0;
  const finalPrice = getFinalPrice(product.price, product.discountPercent);

  return (
    <article className="product-card group relative flex flex-col overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link
          href={`/products/${product.slug}`}
          aria-label={product.name}
          className="absolute inset-0 block"
        >
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            priority={priority}
          />
        </Link>

        {hasDiscount && (
          <span className="absolute start-2 top-2 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
            {formatNumber(product.discountPercent)}٪ تخفیف
          </span>
        )}
        <div className="absolute end-2 top-2">
          <WishlistButton productId={product.id} initialActive={wishlisted} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 min-h-12 text-sm font-semibold leading-6 hover:text-primary sm:text-base"
        >
          {product.name}
        </Link>

        <div className="mt-auto space-y-0.5">
          {hasDiscount && (
            <p className="text-xs text-muted-foreground line-through">
              {formatPrice(product.price)}
            </p>
          )}
          <p className="text-base font-bold text-primary">
            {formatPrice(finalPrice)}
          </p>
        </div>

        <AddToCartButton
          productId={product.id}
          stock={product.stock}
          size="sm"
          className="w-full"
        />
      </div>
    </article>
  );
}
