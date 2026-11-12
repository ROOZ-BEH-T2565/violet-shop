import { Search } from "lucide-react";

type Props = { q?: string; category?: string; sort?: string };

export function ProductSearch({ q, category, sort }: Props) {
  return (
    <form
      action="/products"
      method="get"
      role="search"
      className="relative w-full"
    >
      {category && <input type="hidden" name="category" value={category} />}
      {sort && <input type="hidden" name="sort" value={sort} />}
      <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        name="q"
        type="search"
        defaultValue={q}
        placeholder="جستجوی محصول..."
        className="h-10 w-full rounded-full border bg-card ps-10 pe-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </form>
  );
}
