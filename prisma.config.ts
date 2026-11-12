import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // دستورهای CLI (migrate، db seed و ...) از اتصال مستقیم استفاده کنند.
    // اگر DIRECT_URL تعریف نشده بود (مثلاً دیتابیس لوکال)، همان DATABASE_URL استفاده می‌شود.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
  },
});
