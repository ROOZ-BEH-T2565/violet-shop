"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/actions/cart";

type Props = {
  productId: string;
  stock: number;
  size?: "sm" | "default" | "lg";
  className?: string;
};

export function AddToCartButton({
  productId,
  stock,
  size = "default",
  className,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const result = await addToCart(productId, 1);
      if (result.code === "UNAUTHENTICATED") {
        toast.info(result.message);
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
        return;
      }
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  };

  if (stock < 1) {
    return (
      <Button
        type="button"
        size={size}
        variant="secondary"
        disabled
        className={className}
      >
        ناموجود
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size={size}
      onClick={onClick}
      disabled={pending}
      className={className}
    >
      <ShoppingCart className="h-4 w-4" />
      {pending ? "در حال افزودن..." : "افزودن به سبد"}
    </Button>
  );
}
