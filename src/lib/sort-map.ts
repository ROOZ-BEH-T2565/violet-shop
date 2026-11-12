import type { Prisma } from "@/generated/prisma/client";

/**
 * فقط کلیدهای مجاز (whitelist) به orderBy تبدیل می‌شوند؛ ورودی کاربر هرگز مستقیم به Prisma نمی‌رسد.
 * فرمت‌ها:
 *  - preset فروشگاه (فقط product): newest | price-asc | price-desc | discount | popular
 *  - ستون‌های پنل ادمین: "field:asc" یا "field:desc"
 */
export type SortEntity = "product" | "order" | "user" | "message";
type Dir = "asc" | "desc";

export const PRODUCT_SORT_OPTIONS = [
  { value: "newest", label: "جدیدترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "discount", label: "بیشترین تخفیف" },
  { value: "popular", label: "محبوب‌ترین" },
] as const;

const PRODUCT_PRESETS = new Map<
  string,
  Prisma.ProductOrderByWithRelationInput[]
>([
  ["newest", [{ createdAt: "desc" }]],
  ["price-asc", [{ price: "asc" }]],
  ["price-desc", [{ price: "desc" }]],
  ["discount", [{ discountPercent: "desc" }, { createdAt: "desc" }]],
  ["popular", [{ isPopular: "desc" }, { createdAt: "desc" }]],
]);

const ALLOWED_FIELDS: Record<SortEntity, Set<string>> = {
  product: new Set([
    "name",
    "price",
    "discountPercent",
    "stock",
    "isFeatured",
    "isBestSeller",
    "isPopular",
    "createdAt",
  ]),
  order: new Set(["id", "totalAmount", "status", "createdAt"]),
  user: new Set(["name", "email", "role", "createdAt"]),
  message: new Set(["name", "email", "subject", "isRead", "createdAt"]),
};

const RELATION_FIELDS: Record<SortEntity, Map<string, (dir: Dir) => object>> = {
  product: new Map([["category", (dir) => ({ category: { name: dir } })]]),
  order: new Map([["user", (dir) => ({ user: { name: dir } })]]),
  user: new Map(),
  message: new Map(),
};

const FALLBACK = [{ createdAt: "desc" }];

export function getOrderBy(
  entity: "product",
  sort?: string | null,
): Prisma.ProductOrderByWithRelationInput[];
export function getOrderBy(
  entity: "order",
  sort?: string | null,
): Prisma.OrderOrderByWithRelationInput[];
export function getOrderBy(
  entity: "user",
  sort?: string | null,
): Prisma.UserOrderByWithRelationInput[];
export function getOrderBy(
  entity: "message",
  sort?: string | null,
): Prisma.ContactMessageOrderByWithRelationInput[];
export function getOrderBy(entity: SortEntity, sort?: string | null): object[] {
  if (!sort) return FALLBACK;

  if (entity === "product") {
    const preset = PRODUCT_PRESETS.get(sort);
    if (preset) return preset;
  }

  const [field, dir] = sort.split(":");
  if (dir !== "asc" && dir !== "desc") return FALLBACK;

  const relation = RELATION_FIELDS[entity].get(field);
  if (relation) return [relation(dir)];

  if (ALLOWED_FIELDS[entity].has(field)) return [{ [field]: dir }];

  return FALLBACK;
}
