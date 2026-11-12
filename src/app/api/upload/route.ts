import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { getAdminId } from "@/lib/admin";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(req: Request) {
  if (!(await getAdminId())) {
    return NextResponse.json({ error: "دسترسی غیرمجاز." }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "فایلی ارسال نشده است." },
      { status: 400 },
    );
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "فقط تصاویر JPG، PNG، WebP و GIF مجاز است." },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "حجم تصویر نباید بیشتر از ۵ مگابایت باشد." },
      { status: 400 },
    );
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());
    const output = await sharp(input)
      .rotate()
      .resize({
        width: 1200,
        height: 1200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer();

    const dir = path.resolve(
      /*turbopackIgnore: true*/ process.cwd(),
      process.env.UPLOAD_DIR ?? "public/uploads",
    );
    await mkdir(dir, { recursive: true });

    const name = `${Date.now()}-${randomBytes(4).toString("hex")}.webp`;
    await writeFile(path.join(dir, name), output);

    return NextResponse.json({ url: `/uploads/${name}` });
  } catch (error) {
    console.error("upload error:", error);
    return NextResponse.json(
      { error: "پردازش تصویر ناموفق بود." },
      { status: 400 },
    );
  }
}
