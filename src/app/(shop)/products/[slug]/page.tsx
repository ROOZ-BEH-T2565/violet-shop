import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { formatNumber, formatPrice, getFinalPrice } from "@/lib/format";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { getWishlistIds } from "@/lib/wishlist";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductSection } from "@/components/product/ProductSection";
import { WishlistButton } from "@/components/product/WishlistButton";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(decodeURIComponent(slug));
  return { title: product?.name ?? "محصول" };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(decodeURIComponent(slug));
  if (!product) notFound();

  const session = await auth();
  const [related, wishlist] = await Promise.all([
    getRelatedProducts(product.categoryId, product.id),
    getWishlistIds(session?.user?.id),
  ]);

  const hasDiscount = product.discountPercent > 0;
  const finalPrice = getFinalPrice(product.price, product.discountPercent);

  return (
    <div className="space-y-14">
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="group relative aspect-square overflow-hidden rounded-3xl border bg-muted">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
          {hasDiscount && (
            <span className="absolute start-4 top-4 rounded-full bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground">
              {formatNumber(product.discountPercent)}٪ تخفیف
            </span>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Link
              href={`/products?category=${product.category.slug}`}
              className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
            >
              {product.category.name}
            </Link>
            <h1 className="text-2xl font-extrabold leading-9 sm:text-3xl">
              {product.name}
            </h1>
          </div>

          <div className="space-y-1">
            {hasDiscount && (
              <p className="text-base text-muted-foreground line-through">
                {formatPrice(product.price)}
              </p>
            )}
            <p className="text-3xl font-extrabold text-primary">
              {formatPrice(finalPrice)}
            </p>
          </div>

          <p className="text-sm">
            {product.stock > 0 ? (
              <span className="text-green-600">
                موجود در انبار
                {product.stock <= 5 &&
                  ` (فقط ${formatNumber(product.stock)} عدد باقی مانده)`}
              </span>
            ) : (
              <span className="text-destructive">ناموجود</span>
            )}
          </p>

          <p className="leading-8 text-muted-foreground">
            {product.description}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <AddToCartButton
              productId={product.id}
              stock={product.stock}
              size="lg"
              className="min-w-48"
            />
            <WishlistButton
              productId={product.id}
              initialActive={wishlist.has(product.id)}
              withLabel
            />
          </div>
        </div>
      </div>

      <ProductSection
        title="محصولات مرتبط"
        href={`/products?category=${product.category.slug}`}
        products={related}
        wishlist={wishlist}
      />
    </div>
  );
}
