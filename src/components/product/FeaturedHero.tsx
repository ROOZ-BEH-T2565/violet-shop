import Link from "next/link";
import { Sparkles } from "lucide-react";
import { formatPrice, getFinalPrice } from "@/lib/format";
import type { ProductCardData } from "@/types";
import { ProductImage } from "./ProductImage";

export function FeaturedHero({ product }: { product?: ProductCardData }) {
  return (
    <section className="hero-gradient relative overflow-hidden rounded-3xl text-white">
      <div className="grid items-center gap-8 px-6 py-12 sm:px-10 md:grid-cols-2 md:py-16">
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm backdrop-blur">
            <Sparkles className="h-4 w-4" />
            فروشگاه اینترنتی ویولت‌شاپ
          </span>
          <h1 className="text-3xl font-extrabold leading-snug sm:text-5xl">
            خرید با <span className="text-violet-100">حال خوب</span>،
            <br />
            با رنگ یاسی
          </h1>
          <p className="max-w-md text-base leading-8 opacity-90">
            از لباس و لوازم خانه تا لوازم برقی، زیبایی و ورزشی؛ همه‌چیز با ضمانت
            اصالت و ارسال سریع.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full bg-white px-6 py-3 text-sm font-bold text-violet-700 shadow-lg transition hover:bg-violet-50"
            >
              مشاهده محصولات
            </Link>
            <Link
              href="/products?sort=discount"
              className="rounded-full border border-white/60 px-6 py-3 text-sm font-bold transition hover:bg-white/10"
            >
              تخفیف‌ها
            </Link>
          </div>
        </div>

        {product && (
          <Link
            href={`/products/${product.slug}`}
            className="group mx-auto block w-full max-w-sm rounded-3xl bg-white p-3 text-foreground shadow-2xl transition hover:-translate-y-1"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              <ProductImage
                src={product.imageUrl}
                alt={product.name}
                sizes="(min-width: 768px) 24rem, 90vw"
                priority
              />
              <span className="absolute start-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                محصول ویژه
              </span>
            </div>
            <div className="space-y-1 p-3">
              <p className="line-clamp-1 font-bold">{product.name}</p>
              <p className="font-bold text-primary">
                {formatPrice(
                  getFinalPrice(product.price, product.discountPercent),
                )}
              </p>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
