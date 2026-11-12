import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // create-next-app 16.4 با Tailwind، لودر @tailwindcss/turbopack را اینجا تنظیم می‌کند.
  // بدون این بخش، Tailwind اجرا نمی‌شود و globals.css پردازش نمی‌شود.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
      },
    },
  },
  serverExternalPackages: ["sharp"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
    localPatterns: [{ pathname: "/uploads/**" }, { pathname: "/sample/**" }],
  },
  experimental: {
    serverActions: { bodySizeLimit: "5mb" },
  },
};

export default nextConfig;
