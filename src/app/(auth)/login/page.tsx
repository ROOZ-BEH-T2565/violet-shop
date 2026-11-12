import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "ورود" };

function safeCallbackUrl(url?: string): string {
  if (!url || !url.startsWith("/") || url.startsWith("//")) return "/";
  return url;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">ورود به حساب</CardTitle>
        <CardDescription>برای ادامه خرید وارد شوید.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm callbackUrl={safeCallbackUrl(callbackUrl)} />
        <p className="text-center text-sm text-muted-foreground">
          حساب کاربری ندارید؟{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            ثبت‌نام
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
