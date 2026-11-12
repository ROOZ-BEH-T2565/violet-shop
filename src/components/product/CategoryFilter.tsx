import Link from "next/link";
import { cn } from "@/lib/utils";
import { buildProductsUrl } from "@/lib/url";

type Props = {
  categories: { id: string; name: string; slug: string }[];
  current?: string;
  q?: string;
  sort?: string;
};

export function CategoryFilter({ categories, current, q, sort }: Props) {
  const pill = (active: boolean) =>
    cn(
      "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "bg-card text-muted-foreground hover:border-primary hover:text-primary",
    );

  return (
    <nav
      aria-label="دسته‌بندی‌ها"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
    >
      <Link href={buildProductsUrl({ q, sort })} className={pill(!current)}>
        همه
      </Link>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={buildProductsUrl({ q, sort, category: c.slug })}
          className={pill(current === c.slug)}
        >
          {c.name}
        </Link>
      ))}
    </nav>
  );
}
