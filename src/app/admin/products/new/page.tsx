import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "افزودن محصول" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">افزودن محصول</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
