"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { toggleWishlist } from "@/actions/wishlist";
import { cn } from "@/lib/utils";

type Props = {
  productId: string;
  initialActive?: boolean;
  withLabel?: boolean;
  className?: string;
};

export function WishlistButton({
  productId,
  initialActive = false,
  withLabel = false,
  className,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(initialActive);
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const result = await toggleWishlist(productId);
      if (result.code === "UNAUTHENTICATED") {
        toast.info(result.message);
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
        return;
      }
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setActive(Boolean(result.active));
      toast.success(result.message);
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={active}
      aria-label={active ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur transition hover:bg-white disabled:opacity-60",
        withLabel ? "h-12 border px-5 text-sm font-medium" : "h-9 w-9",
        className,
      )}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition",
          active && "fill-primary text-primary",
        )}
      />
      {withLabel && (
        <span>{active ? "در علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}</span>
      )}
    </button>
  );
}
