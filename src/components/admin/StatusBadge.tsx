import { ORDER_STATUS_META, isOrderStatus } from "@/lib/admin-constants";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const meta = isOrderStatus(status) ? ORDER_STATUS_META[status] : null;
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold",
        meta?.className ?? "bg-muted text-muted-foreground",
      )}
    >
      {meta?.label ?? status}
    </span>
  );
}
