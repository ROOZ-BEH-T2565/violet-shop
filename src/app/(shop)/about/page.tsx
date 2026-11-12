import type { Metadata } from "next";
import { Headphones, ShieldCheck, Sparkles, Truck } from "lucide-react";

export const metadata: Metadata = { title: "درباره ما" };

const VALUES = [
  {
    icon: ShieldCheck,
    title: "اصالت کالا",
    text: "همه‌ی محصولات با ضمانت اصالت و کیفیت عرضه می‌شوند.",
  },
  {
    icon: Truck,
    title: "ارسال سریع",
    text: "سفارش‌ها در کوتاه‌ترین زمان به دست شما می‌رسند.",
  },
  {
    icon: Headphones,
    title: "پشتیبانی دلسوز",
    text: "تیم پشتیبانی ما برای پاسخ‌گویی کنار شماست.",
  },
  {
    icon: Sparkles,
    title: "تجربه‌ی خرید خوب",
    text: "طراحی ساده و روان تا خرید برایتان لذت‌بخش باشد.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-14">
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold">درباره‌ی ویولت‌شاپ</h1>
          <p className="leading-8 text-muted-foreground">
            ویولت‌شاپ با هدف ساختن یک تجربه‌ی خرید اینترنتی ساده، مطمئن و دلنشین
            شکل گرفت. ما باور داریم خرید خوب یعنی انتخاب‌های متنوع، قیمت منصفانه
            و احترام به وقت و اعتماد مشتری.
          </p>
          <p className="leading-8 text-muted-foreground">
            از لباس و لوازم خانه تا لوازم برقی، محصولات زیبایی و ورزشی را با دقت
            انتخاب می‌کنیم تا هر سفارش، یک خاطره‌ی خوب بسازد.
          </p>
        </div>

        {/* تصویر placeholder؛ بعداً با تصویر واقعی برند جایگزین شود */}
        <div className="hero-gradient flex aspect-video items-center justify-center rounded-3xl text-6xl font-extrabold text-white/90">
          ویولت
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-extrabold">ارزش‌های ما</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border bg-card p-5 transition hover:shadow-[var(--shadow-soft)]"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1 font-bold">{title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
