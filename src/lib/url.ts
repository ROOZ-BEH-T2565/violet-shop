type Params = Record<string, string | number | null | undefined>;

export function buildProductsUrl(params: Params): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    sp.set(key, String(value));
  }
  const qs = sp.toString();
  return qs ? `/products?${qs}` : "/products";
}
