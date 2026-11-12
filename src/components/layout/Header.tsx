import Link from "next/link";
import { Heart } from "lucide-react";
import { auth } from "@/lib/auth";
import { CartSheet } from "@/components/cart/CartSheet";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./Navlinks";
import { UserMenu } from "./UserMenu";

export async function Header() {
  const session = await auth();
  const user = session?.user ?? null;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <MobileNav user={user ? { role: user.role } : null} />

        <Link
          href="/"
          className="text-xl font-extrabold text-primary sm:text-2xl"
        >
          ویولت‌شاپ
        </Link>

        <NavLinks />

        <div className="ms-auto flex items-center gap-1 sm:gap-2">
          <Link
            href="/wishlist"
            aria-label="علاقه‌مندی‌ها"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
          >
            <Heart className="h-5 w-5" />
          </Link>

          <CartSheet />

          {user ? (
            <UserMenu
              user={{ name: user.name, email: user.email, role: user.role }}
            />
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-violet-700"
            >
              ورود
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
