import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const categories = [
  { name: "لباس", slug: "clothing" },
  { name: "لوازم خانه", slug: "home" },
  { name: "لوازم برقی", slug: "electronics" },
  { name: "زیبایی", slug: "beauty" },
  { name: "ورزشی", slug: "sports" },
];

// [نام، slug، شاخص دسته، قیمت (تومان)، درصد تخفیف، موجودی، [ویژه، پرفروش، محبوب]]
type P = [string, string, number, number, number, number, [boolean, boolean, boolean]];
const products: P[] = [
  ["پیراهن نخی یاسی", "violet-cotton-shirt", 0, 890000, 15, 40, [true, true, false]],
  ["هودی زنانه پشمی", "wool-hoodie", 0, 1450000, 0, 25, [false, true, true]],
  ["شلوار جین راسته", "straight-jeans", 0, 1250000, 20, 30, [false, false, true]],
  ["شال حریر طرح‌دار", "silk-scarf", 0, 540000, 10, 50, [true, false, false]],
  ["ست ملحفه دو نفره", "bed-sheet-set", 1, 2100000, 25, 15, [true, false, false]],
  ["قابلمه گرانیتی ۶ تکه", "granite-pots", 1, 4800000, 12, 10, [false, true, true]],
  ["شمع معطر لاوندر", "lavender-candle", 1, 320000, 0, 80, [false, true, false]],
  ["سرویس چای‌خوری سرامیکی", "ceramic-tea-set", 1, 1750000, 0, 18, [false, false, true]],
  ["جاروبرقی رباتیک", "robot-vacuum", 2, 12900000, 18, 8, [true, false, true]],
  ["هواپز دوقلو", "air-fryer", 2, 6400000, 10, 14, [false, true, true]],
  ["اسپیکر بلوتوثی قابل‌حمل", "bt-speaker", 2, 2300000, 0, 35, [false, false, true]],
  ["سشوار حرفه‌ای یون", "ion-hair-dryer", 2, 2950000, 30, 22, [true, true, false]],
  ["سرم ویتامین C", "vitamin-c-serum", 3, 780000, 0, 60, [false, true, true]],
  ["کرم مرطوب‌کننده روز", "day-moisturizer", 3, 450000, 15, 70, [false, false, true]],
  ["ادکلن زنانه یاس", "jasmine-perfume", 3, 3200000, 20, 20, [true, false, false]],
  ["پالت سایه چشم ۱۲ رنگ", "eyeshadow-palette", 3, 690000, 0, 45, [false, false, false]],
  ["تردمیل خانگی تاشو", "folding-treadmill", 4, 18500000, 8, 5, [true, false, false]],
  ["مت یوگا ضدلغزش", "yoga-mat", 4, 420000, 0, 90, [false, true, true]],
  ["دمبل رنگی ۵ کیلویی", "dumbbell-5kg", 4, 650000, 10, 55, [false, false, true]],
  ["کفش دویدن سبک", "running-shoes", 4, 2650000, 22, 28, [true, true, false]],
];

async function main() {
  const adminPass = await bcrypt.hash("Admin@1234", 10);
  const userPass = await bcrypt.hash("User@1234", 10);

  await prisma.user.upsert({
    where: { email: "admin@violet.shop" },
    update: {},
    create: { name: "مدیر ویولت‌شاپ", email: "admin@violet.shop", password: adminPass, role: "ADMIN" },
  });
  await prisma.user.upsert({
    where: { email: "user@violet.shop" },
    update: {},
    create: { name: "کاربر نمونه", email: "user@violet.shop", password: userPass, role: "USER" },
  });

  const cats = [];
  for (const c of categories) {
    cats.push(await prisma.category.upsert({ where: { slug: c.slug }, update: { name: c.name }, create: c }));
  }

  for (const [name, slug, ci, price, discountPercent, stock, [isFeatured, isBestSeller, isPopular]] of products) {
    const data = {
      name,
      slug,
      description: `${name} با کیفیت عالی و ضمانت اصالت کالا، مناسب استفاده روزمره. ارسال سریع به سراسر کشور.`,
      price,
      discountPercent,
      stock,
      imageUrl: `https://picsum.photos/seed/${slug}/600/600`,
      isFeatured,
      isBestSeller,
      isPopular,
      categoryId: cats[ci].id,
    };
    await prisma.product.upsert({ where: { slug }, update: data, create: data });
  }

  const count = await prisma.contactMessage.count();
  if (count === 0) {
    await prisma.contactMessage.createMany({
      data: [
        { name: "سارا محمدی", email: "sara@example.com", subject: "پیگیری سفارش", message: "سفارش من کی ارسال می‌شود؟" },
        { name: "علی رضایی", email: "ali@example.com", subject: "پیشنهاد", message: "لطفاً محصولات بیشتری در دسته ورزشی اضافه کنید." },
        { name: "مریم کریمی", email: "maryam@example.com", subject: "مشکل پرداخت", message: "در مرحله پرداخت با خطا مواجه شدم." },
      ],
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
