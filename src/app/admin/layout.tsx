import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, Store } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { getAdminId } from "@/lib/admin";

export const metadata: Metadata = {
  title: { default: "پنل مدیریت", template: "%s | مدیریت ویولت‌شاپ" },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // لایه‌ی دوم محافظت (علاوه بر middleware): نقش از دیتابیس بررسی می‌شود
  const adminId = await getAdminId();
  if (!adminId) redirect("/");

  return (
    <div className="min-h-screen bg-muted/40 md:flex">
      <aside className="border-b bg-card md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-e">
        <div className="flex items-center justify-between px-4 py-4 md:py-6">
          <div>
            <p className="text-xl font-extrabold text-primary">ویولت‌شاپ</p>
            <p className="text-xs text-muted-foreground">پنل مدیریت</p>
          </div>
        </div>

        <AdminNav />

        <div className="hidden space-y-1 border-t p-3 md:absolute md:inset-x-0 md:bottom-0 md:block">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Store className="h-4 w-4" />
            بازگشت به فروشگاه
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              خروج
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}
