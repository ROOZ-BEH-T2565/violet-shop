import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "ویرایش محصول" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">ویرایش «{product.name}»</h1>
      <ProductForm
        categories={categories}
        productId={product.id}
        initialValues={{
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          discountPercent: product.discountPercent,
          stock: product.stock,
          imageUrl: product.imageUrl,
          isFeatured: product.isFeatured,
          isBestSeller: product.isBestSeller,
          isPopular: product.isPopular,
          categoryId: product.categoryId,
        }}
      />
    </div>
  );
}
