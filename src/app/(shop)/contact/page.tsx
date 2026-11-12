import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { auth } from "@/lib/auth";
import { formatNumber } from "@/lib/format";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = { title: "تماس با ما" };

export default async function ContactPage() {
  const session = await auth();

  return (
    <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-5">
      <div className="space-y-6 md:col-span-2">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold">تماس با ما</h1>
          <p className="leading-8 text-muted-foreground">
            سؤال، پیشنهاد یا انتقادی دارید؟ پیام بگذارید تا در اسرع وقت پاسخ
            بدهیم.
          </p>
        </div>
        <ul className="space-y-4 text-sm">
          <li className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary" />
            <span>{formatNumber(2188888888)}</span>
          </li>
          <li className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary" />
            <span dir="ltr">support@violet.shop</span>
          </li>
          <li className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <span>تهران، خیابان ولیعصر</span>
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6 md:col-span-3">
        <ContactForm
          defaultName={session?.user?.name ?? ""}
          defaultEmail={session?.user?.email ?? ""}
        />
      </div>
    </div>
  );
}
