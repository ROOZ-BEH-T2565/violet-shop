import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { NAV_LINKS } from "./nav-links";
import { formatNumber } from "@/lib/format";

export function Footer() {
  const year = new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(
    new Date(),
  );

  return (
    <footer className="mt-16 border-t bg-violet-50 dark:bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-3">
          <p className="text-2xl font-extrabold text-primary">ویولت‌شاپ</p>
          <p className="max-w-sm text-sm leading-7 text-muted-foreground">
            فروشگاه اینترنتی ویولت‌شاپ؛ انتخابی مطمئن برای خرید لباس، لوازم
            خانه، لوازم برقی، محصولات زیبایی و ورزشی با ضمانت اصالت کالا.
          </p>
        </div>

        <div className="space-y-3">
          <p className="font-bold">دسترسی سریع</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <p className="font-bold">ارتباط با ما</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>{formatNumber(2188888888)}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span dir="ltr">support@violet.shop</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>تهران، خیابان ولیعصر</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {year} ویولت‌شاپ. تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
}
