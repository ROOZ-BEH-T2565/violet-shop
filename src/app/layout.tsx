import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

const vazir = localFont({
  src: "../fonts/Vazirmatn-Variable.woff2",
  variable: "--font-vazir",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ویولت‌شاپ | فروشگاه اینترنتی",
    template: "%s | ویولت‌شاپ",
  },
  description:
    "ویولت‌شاپ؛ خرید آنلاین لباس، لوازم خانه، لوازم برقی، زیبایی و ورزشی با بهترین قیمت.",
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa-IR" dir="rtl" className={vazir.variable}>
      <body className="min-h-screen">
        {children}
        <Toaster dir="rtl" position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
