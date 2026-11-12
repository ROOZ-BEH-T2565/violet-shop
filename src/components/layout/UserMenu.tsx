"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart, LayoutDashboard, LogOut, ShoppingCart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/actions/auth";
import type { UserRole } from "@/types";

type Props = {
  user: { name?: string | null; email?: string | null; role: UserRole };
};

export function UserMenu({ user }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const initial = (user.name ?? user.email ?? "؟")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-9 items-center gap-2 rounded-full border bg-card ps-1 pe-3 text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="منوی کاربر"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {initial}
        </span>
        <span className="hidden max-w-24 truncate sm:inline">
          {user.name ?? "حساب من"}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-52">
        <div className="px-2 py-2 text-sm">
          <p className="truncate font-medium">{user.name ?? "کاربر"}</p>
          <p
            dir="ltr"
            className="truncate text-start text-xs text-muted-foreground"
          >
            {user.email}
          </p>
        </div>
        <DropdownMenuSeparator />

        {user.role === "ADMIN" && (
          <DropdownMenuItem
            onClick={() => router.push("/admin")}
            className="cursor-pointer gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            پنل مدیریت
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => router.push("/cart")}
          className="cursor-pointer gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          سبد خرید
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/wishlist")}
          className="cursor-pointer gap-2"
        >
          <Heart className="h-4 w-4" />
          علاقه‌مندی‌ها
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => startTransition(() => logoutAction())}
          disabled={pending}
          className="cursor-pointer gap-2 text-destructive"
        >
          <LogOut className="h-4 w-4" />
          {pending ? "در حال خروج..." : "خروج"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
