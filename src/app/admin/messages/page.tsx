import type { Metadata } from "next";
import Link from "next/link";
import { Inbox, Search } from "lucide-react";
import type { Prisma } from "@/generated/prisma/client";
import { ExportExcelButton } from "@/components/admin/ExportExcelButton";
import { MessageCard, type MessageRow } from "@/components/admin/MessageCard";
import { SimplePagination } from "@/components/admin/SimplePagination";
import { formatNumber } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getOrderBy } from "@/lib/sort-map";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "پیام‌ها" };

const PAGE_SIZE = 10;

type SearchParams = Promise<{
  q?: string;
  filter?: string;
  sort?: string;
  page?: string;
}>;

const TABS = [
  { value: "", label: "همه" },
  { value: "unread", label: "خوانده‌نشده" },
  { value: "read", label: "خوانده‌شده" },
] as const;

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, filter, sort, page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const query = q?.trim();
  const activeFilter = filter === "unread" || filter === "read" ? filter : "";
  const oldestFirst = sort === "createdAt:asc";

  const where: Prisma.ContactMessageWhereInput = {
    ...(activeFilter ? { isRead: activeFilter === "read" } : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { subject: { contains: query, mode: "insensitive" } },
            { message: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: getOrderBy(
        "message",
        oldestFirst ? "createdAt:asc" : "createdAt:desc",
      ),
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.contactMessage.count({ where }),
  ]);

  const messages: MessageRow[] = items.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    createdAt: m.createdAt.toISOString(),
    isRead: m.isRead,
  }));

  const href = (params: { filter?: string; sort?: string; page?: number }) => {
    const sp = new URLSearchParams();
    const merged = {
      q: query,
      filter: activeFilter,
      sort: oldestFirst ? "createdAt:asc" : "",
      ...params,
    };
    for (const [key, value] of Object.entries(merged)) {
      if (
        value !== undefined &&
        value !== "" &&
        !(key === "page" && value === 1)
      )
        sp.set(key, String(value));
    }
    const qs = sp.toString();
    return qs ? `/admin/messages?${qs}` : "/admin/messages";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">پیام‌ها</h1>
        <ExportExcelButton entity="messages" />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <nav aria-label="فیلتر پیام‌ها" className="flex gap-2 overflow-x-auto">
          {TABS.map((tab) => (
            <Link
              key={tab.value}
              href={href({ filter: tab.value, page: 1 })}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                activeFilter === tab.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:border-primary hover:text-primary",
              )}
            >
              {tab.label}
            </Link>
          ))}
          <Link
            href={href({ sort: oldestFirst ? "" : "createdAt:asc", page: 1 })}
            className="shrink-0 rounded-full border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {oldestFirst ? "قدیمی‌ترین ابتدا" : "جدیدترین ابتدا"}
          </Link>
        </nav>

        <form
          action="/admin/messages"
          role="search"
          className="relative lg:ms-auto lg:w-80"
        >
          {activeFilter && (
            <input type="hidden" name="filter" value={activeFilter} />
          )}
          {oldestFirst && (
            <input type="hidden" name="sort" value="createdAt:asc" />
          )}
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            name="q"
            defaultValue={query}
            placeholder="جستجو در پیام‌ها..."
            className="h-10 w-full rounded-full border bg-card ps-10 pe-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </form>
      </div>

      <p className="text-sm text-muted-foreground">
        {formatNumber(total)} پیام
      </p>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center text-muted-foreground">
          <Inbox className="h-12 w-12 text-violet-300" />
          <p>پیامی یافت نشد.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <MessageCard key={m.id} message={m} />
          ))}
        </div>
      )}

      <SimplePagination
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        hrefFor={(p) => href({ page: p })}
      />
    </div>
  );
}
