/** برای نام‌های فارسی خروجی خالی است؛ در این حالت ادمین اسلاگ را دستی می‌نویسد یا خودکار ساخته می‌شود. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
