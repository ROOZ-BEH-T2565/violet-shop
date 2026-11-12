import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { auth } from "@/lib/auth";
import { getCartItems } from "@/lib/cart";
import { CartSheetClient } from "./CartSheetClient";

export async function CartSheet() {
  const session = await auth();

  if (!session?.user) {
    return (
      <Link
        href="/cart"
        aria-label="سبد خرید"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
      >
        <ShoppingCart className="h-5 w-5" />
      </Link>
    );
  }

  const items = await getCartItems(session.user.id);
  return <CartSheetClient items={items} />;
}
