/** ثابت‌های پنل ادمین؛ بدون وابستگی سروری، قابل استفاده در کلاینت. */
export const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "CANCELLED",
  "SHIPPED",
  "DELIVERED",
] as const;
export type OrderStatusValue = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_META: Record<
  OrderStatusValue,
  { label: string; className: string }
> = {
  PENDING: {
    label: "در انتظار پرداخت",
    className: "bg-amber-100 text-amber-800",
  },
  PAID: { label: "پرداخت‌شده", className: "bg-green-100 text-green-800" },
  CANCELLED: { label: "لغوشده", className: "bg-red-100 text-red-800" },
  SHIPPED: { label: "ارسال‌شده", className: "bg-blue-100 text-blue-800" },
  DELIVERED: { label: "تحویل‌شده", className: "bg-violet-100 text-violet-800" },
};

export function isOrderStatus(value: string): value is OrderStatusValue {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export const USER_ROLES = ["USER", "ADMIN"] as const;
export type UserRoleValue = (typeof USER_ROLES)[number];

export const ROLE_LABELS: Record<UserRoleValue, string> = {
  USER: "کاربر",
  ADMIN: "مدیر",
};

export function isUserRole(value: string): value is UserRoleValue {
  return (USER_ROLES as readonly string[]).includes(value);
}
