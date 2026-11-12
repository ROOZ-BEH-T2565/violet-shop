import { Download } from "lucide-react";

type Props = {
  entity: "products" | "orders" | "users" | "messages";
  label?: string;
};

export function ExportExcelButton({ entity, label = "خروجی اکسل" }: Props) {
  return (
    <a
      href={`/api/export/${entity}`}
      download
      className="inline-flex h-9 items-center gap-2 rounded-full border bg-card px-4 text-sm font-medium transition hover:bg-muted"
    >
      <Download className="h-4 w-4" />
      {label}
    </a>
  );
}
