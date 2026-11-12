"use client";

import { useTransition } from "react";
import { Mail, MailOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleMessageRead } from "@/actions/contact";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export type MessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};

export function MessageCard({ message }: { message: MessageRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const toggle = () =>
    startTransition(async () => {
      const result = await toggleMessageRead(message.id);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });

  return (
    <article
      className={cn(
        "space-y-3 rounded-2xl border bg-card p-5 transition-opacity",
        !message.isRead && "border-primary/60 shadow-[var(--shadow-soft)]",
        pending && "opacity-60",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 font-bold">
            {!message.isRead && (
              <span
                className="h-2 w-2 rounded-full bg-primary"
                aria-label="خوانده‌نشده"
              />
            )}
            {message.subject}
          </h2>
          <p className="text-sm text-muted-foreground">
            {message.name} ·{" "}
            <a
              href={`mailto:${message.email}`}
              dir="ltr"
              className="hover:text-primary hover:underline"
            >
              {message.email}
            </a>
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDateTime(message.createdAt)}
        </span>
      </div>

      <p className="whitespace-pre-line text-sm leading-7">{message.message}</p>

      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors hover:bg-muted"
      >
        {message.isRead ? (
          <Mail className="h-4 w-4" />
        ) : (
          <MailOpen className="h-4 w-4" />
        )}
        {message.isRead
          ? "علامت‌گذاری به‌عنوان خوانده‌نشده"
          : "علامت‌گذاری به‌عنوان خوانده‌شده"}
      </button>
    </article>
  );
}
