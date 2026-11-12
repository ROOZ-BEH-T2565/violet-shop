import Link from "next/link";
import { auth } from "@/lib/auth";
import { getHomeSections } from "@/lib/products";
import { getWishlistIds } from "@/lib/wishlist";
import { BestSellers } from "@/components/product/BestSellers";
import { DiscountedProducts } from "@/components/product/DiscountedProducts";
import { FeaturedHero } from "@/components/product/FeaturedHero";
import { PopularProducts } from "@/components/product/PopularProducts";
import { ProductSection } from "@/components/product/ProductSection";

export default async function HomePage() {
  const session = await auth();
  const [sections, wishlist] = await Promise.all([
    getHomeSections(),
    getWishlistIds(session?.user?.id),
  ]);

  return (
    <div className="space-y-14">
      <FeaturedHero product={sections.featured[0]} />

      <BestSellers products={sections.bestSellers} wishlist={wishlist} />
      <PopularProducts products={sections.popular} wishlist={wishlist} />

      <section className="flex flex-col items-center justify-between gap-4 rounded-3xl bg-violet-100 px-6 py-10 text-center dark:bg-secondary sm:flex-row sm:px-10 sm:text-start">
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-violet-900 dark:text-violet-100 sm:text-2xl">
            ارسال سریع به سراسر کشور
          </h2>
          <p className="text-sm text-violet-800/80 dark:text-violet-200/80">
            ضمانت اصالت کالا و بازگشت وجه تا ۷ روز.
          </p>
        </div>
        <Link
          href="/products"
          className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-violet-700"
        >
          شروع خرید
        </Link>
      </section>

      <DiscountedProducts products={sections.discounted} wishlist={wishlist} />
      <ProductSection
        title="محصولات ویژه"
        subtitle="منتخب تیم ویولت‌شاپ"
        products={sections.featured}
        wishlist={wishlist}
      />
    </div>
  );
}
