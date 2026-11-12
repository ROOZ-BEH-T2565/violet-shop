import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HeartOff } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import { ProductGrid } from "@/components/product/ProductGrid";

export const metadata: Metadata = { title: "علاقه‌مندی‌ها" };

export default async function WishlistPage() {
  const userId = await getUserId();
  if (!userId) redirect("/login?callbackUrl=/wishlist");

  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <HeartOff className="h-16 w-16 text-violet-300" />
        <h1 className="text-xl font-extrabold">
          لیست علاقه‌مندی‌های شما خالی است
        </h1>
        <p className="text-muted-foreground">
          روی قلب هر محصول بزنید تا اینجا ذخیره شود.
        </p>
        <Link
          href="/products"
          className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-violet-700"
        >
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  const products = items.map((i) => i.product);
  const wishlist = new Set(products.map((p) => p.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">علاقه‌مندی‌ها</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          برای حذف یک محصول، روی قلب آن بزنید.
        </p>
      </div>
      <ProductGrid products={products} wishlist={wishlist} />
    </div>
  );
}
