import type { NextAuthConfig } from "next-auth";

/**
 * بخش edge-safe تنظیمات Auth.js (بدون Prisma و bcrypt).
 * هم در middleware و هم در lib/auth.ts استفاده می‌شود.
 */
export const authConfig = {
  trustHost: true,
  pages: { signIn: "/login" },
  // Credentials Provider فقط با JWT کار می‌کند؛ کاربران و حساب‌ها همچنان در DB (Prisma Adapter) ذخیره می‌شوند.
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "USER";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        // با typeof، به augmentation تایپ JWT وابسته نیستیم (token.* ممکن است unknown باشد)
        session.user.id =
          typeof token.id === "string" ? token.id : (token.sub ?? "");
        session.user.role = token.role === "ADMIN" ? "ADMIN" : "USER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
