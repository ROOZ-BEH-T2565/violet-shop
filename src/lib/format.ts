const numberFormatter = new Intl.NumberFormat("fa-IR");

/** عدد با ارقام فارسی و جداکننده هزارگان */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** قیمت به تومان، مثل «۱٬۲۵۰٬۰۰۰ تومان» */
export function formatPrice(value: number): string {
  return `${numberFormatter.format(value)} تومان`;
}

/** قیمت نهایی بعد از اعمال درصد تخفیف */
export function getFinalPrice(price: number, discountPercent: number): number {
  if (discountPercent <= 0) return price;
  return Math.round((price * (100 - discountPercent)) / 100);
}

/** تاریخ شمسی، مثل «۱۹ آبان ۱۴۰۵» */
export function formatDate(date: Date | string | number): string {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string | number): string {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
