"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { placeOrder } from "@/actions/order";

export function CheckoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = () =>
    startTransition(async () => {
      const result = await placeOrder();
      if (result.code === "UNAUTHENTICATED") {
        router.push("/login?callbackUrl=/checkout");
        return;
      }
      if (!result.success || !result.orderId) {
        toast.error(result.message);
        router.refresh();
        return;
      }
      toast.success(result.message);
      router.push(`/checkout/success?order=${result.orderId}`);
      router.refresh();
    });

  return (
    <Button
      type="button"
      size="lg"
      className="w-full"
      onClick={onClick}
      disabled={pending}
    >
      <CreditCard className="h-4 w-4" />
      {pending ? "در حال پرداخت..." : "پرداخت شبیه‌سازی‌شده"}
    </Button>
  );
}
