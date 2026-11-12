import { NextResponse } from "next/server";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { getAdminId } from "@/lib/admin";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const ENTITIES = ["products", "orders", "users", "messages"] as const;
type Entity = (typeof ENTITIES)[number];
type Row = Record<string, string | number>;

const SHEET_NAMES: Record<Entity, string> = {
  products: "محصولات",
  orders: "سفارش‌ها",
  users: "کاربران",
  messages: "پیام‌ها",
};

const yesNo = (v: boolean) => (v ? "بله" : "خیر");

async function loadRows(entity: Entity): Promise<Row[]> {
  switch (entity) {
    case "products": {
      const items = await prisma.product.findMany({
        include: { category: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      });
      return items.map((p) => ({
        شناسه: p.id,
        نام: p.name,
        اسلاگ: p.slug,
        دسته: p.category.name,
        "قیمت (تومان)": p.price,
        "تخفیف (٪)": p.discountPercent,
        موجودی: p.stock,
        ویژه: yesNo(p.isFeatured),
        پرفروش: yesNo(p.isBestSeller),
        محبوب: yesNo(p.isPopular),
        "تاریخ ایجاد": formatDateTime(p.createdAt),
      }));
    }
    case "orders": {
      const items = await prisma.order.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      });
      return items.map((o) => ({
        شناسه: o.id,
        کاربر: o.user.name ?? "",
        ایمیل: o.user.email,
        "مبلغ (تومان)": o.totalAmount,
        وضعیت: o.status,
        "کد پیگیری": o.paymentRef ?? "",
        تاریخ: formatDateTime(o.createdAt),
      }));
    }
    case "users": {
      // رمز عبور هرگز export نمی‌شود
      const items = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return items.map((u) => ({
        شناسه: u.id,
        نام: u.name ?? "",
        ایمیل: u.email,
        نقش: u.role,
        "تاریخ عضویت": formatDateTime(u.createdAt),
      }));
    }
    case "messages": {
      const items = await prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
      });
      return items.map((m) => ({
        شناسه: m.id,
        نام: m.name,
        ایمیل: m.email,
        موضوع: m.subject,
        پیام: m.message,
        "خوانده شده": yesNo(m.isRead),
        تاریخ: formatDateTime(m.createdAt),
      }));
    }
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ entity: string }> },
) {
  if (!(await getAdminId())) {
    return NextResponse.json({ error: "دسترسی غیرمجاز." }, { status: 403 });
  }

  const { entity } = await params;
  if (!(ENTITIES as readonly string[]).includes(entity)) {
    return NextResponse.json(
      { error: "موجودیت نامعتبر است." },
      { status: 404 },
    );
  }

  try {
    const rows = await loadRows(entity as Entity);
    const sheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    workbook.Workbook = { Views: [{ RTL: true }] };
    XLSX.utils.book_append_sheet(
      workbook,
      sheet,
      SHEET_NAMES[entity as Entity],
    );

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    }) as Buffer;
    const filename = `${entity}-${format(new Date(), "yyyy-MM-dd")}.xlsx`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("export error:", error);
    return NextResponse.json(
      { error: "ساخت فایل اکسل ناموفق بود." },
      { status: 500 },
    );
  }
}
