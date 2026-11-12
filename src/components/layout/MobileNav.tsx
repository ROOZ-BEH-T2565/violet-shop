"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { logoutAction } from "@/actions/auth";
import type { UserRole } from "@/types";
import { NAV_LINKS } from "./nav-links";

type Props = { user: { role: UserRole } | null };

const itemClass =
  "flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium transition-colors hover:bg-muted";

export function MobileNav({ user }: Props) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="باز کردن منو"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle className="text-primary">ویولت‌شاپ</SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col gap-1 px-4" aria-label="منوی موبایل">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className={itemClass}
              >
                {link.label}
              </Link>
            ))}

            <div className="my-2 border-t" />

            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <Link href="/admin" onClick={close} className={itemClass}>
                    <LayoutDashboard className="h-5 w-5" />
                    پنل مدیریت
                  </Link>
                )}
                <Link href="/cart" onClick={close} className={itemClass}>
                  <ShoppingCart className="h-5 w-5" />
                  سبد خرید
                </Link>
                <Link href="/wishlist" onClick={close} className={itemClass}>
                  <Heart className="h-5 w-5" />
                  علاقه‌مندی‌ها
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className={`${itemClass} w-full text-destructive`}
                  >
                    <LogOut className="h-5 w-5" />
                    خروج
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" onClick={close} className={itemClass}>
                  ورود
                </Link>
                <Link
                  href="/register"
                  onClick={close}
                  className="mt-1 rounded-xl bg-primary px-3 py-3 text-center text-base font-medium text-primary-foreground"
                >
                  ثبت‌نام
                </Link>
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
