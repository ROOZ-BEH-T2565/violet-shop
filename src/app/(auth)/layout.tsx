import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-violet-100 via-background to-background px-4 py-10">
      <Link href="/" className="mb-6 text-3xl font-extrabold text-primary">
        ویولت‌شاپ
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
