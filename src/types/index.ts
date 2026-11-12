import type { Product } from "@/generated/prisma/client";

export type UserRole = "USER" | "ADMIN";

export type ActionResult = {
  success: boolean;
  message: string;
  /** وقتی کاربر لاگین نیست، کلاینت او را به صفحه‌ی ورود می‌فرستد */
  code?: "UNAUTHENTICATED";
};

export type ProductCardData = Pick<
  Product,
  "id" | "name" | "slug" | "price" | "discountPercent" | "stock" | "imageUrl"
>;

export type CartItemData = {
  productId: string;
  quantity: number;
  product: ProductCardData;
};
