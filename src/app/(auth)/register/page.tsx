import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "ثبت‌نام" };

export default function RegisterPage() {
  return (
    <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">ایجاد حساب کاربری</CardTitle>
        <CardDescription>در چند ثانیه عضو ویولت‌شاپ شوید.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            ورود
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
