"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateOrderStatus } from "@/actions/order";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ORDER_STATUSES,
  ORDER_STATUS_META,
  type OrderStatusValue,
} from "@/lib/admin-constants";

type Props = { orderId: string; current: OrderStatusValue };

export function OrderStatusForm({ orderId, current }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatusValue>(current);
  const [pending, startTransition] = useTransition();
  const locked = current === "CANCELLED";

  const onSave = () =>
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, status);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });

  return (
    <div className="space-y-3 rounded-2xl border bg-card p-5">
      <Label htmlFor="status">تغییر وضعیت سفارش</Label>
      <select
        id="status"
        value={status}
        onChange={(e) => setStatus(e.target.value as OrderStatusValue)}
        disabled={locked || pending}
        className="h-10 w-full rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {ORDER_STATUS_META[s].label}
          </option>
        ))}
      </select>

      {locked && (
        <p className="text-xs text-muted-foreground">
          سفارش لغوشده قابل تغییر نیست.
        </p>
      )}
      {!locked && status === "CANCELLED" && (
        <p className="text-xs leading-6 text-destructive">
          با لغو سفارش، موجودی کالاها به انبار برمی‌گردد و این کار قابل بازگشت
          نیست.
        </p>
      )}

      <Button
        type="button"
        className="w-full"
        onClick={onSave}
        disabled={locked || pending || status === current}
      >
        {pending ? "در حال ذخیره..." : "ذخیره وضعیت"}
      </Button>
    </div>
  );
}
