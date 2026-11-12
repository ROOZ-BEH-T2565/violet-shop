import { formatNumber } from "@/lib/format";

export function CartBadge({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <span className="absolute -top-1 -start-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
      {formatNumber(count)}
    </span>
  );
}
