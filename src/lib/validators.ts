import { z } from "zod";

const email = z
  .string()
  .trim()
  .min(1, "ایمیل را وارد کنید.")
  .email("ایمیل معتبر نیست.");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "رمز عبور را وارد کنید."),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "نام باید حداقل ۲ حرف باشد.")
      .max(60, "نام نباید بیشتر از ۶۰ حرف باشد."),
    email,
    password: z
      .string()
      .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد.")
      .regex(/[A-Za-z]/, "رمز عبور باید حداقل یک حرف انگلیسی داشته باشد.")
      .regex(/\d/, "رمز عبور باید حداقل یک عدد داشته باشد."),
    confirmPassword: z.string().min(1, "تکرار رمز عبور را وارد کنید."),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "تکرار رمز عبور مطابقت ندارد.",
    path: ["confirmPassword"],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "نام را وارد کنید.")
    .max(60, "نام خیلی طولانی است."),
  email,
  subject: z
    .string()
    .trim()
    .min(3, "موضوع باید حداقل ۳ حرف باشد.")
    .max(120, "موضوع خیلی طولانی است."),
  message: z
    .string()
    .trim()
    .min(10, "پیام باید حداقل ۱۰ حرف باشد.")
    .max(2000, "پیام نباید بیشتر از ۲۰۰۰ حرف باشد."),
});

export type ContactValues = z.infer<typeof contactSchema>;

const imageUrlPattern = /^(\/uploads\/[\w.-]+|https:\/\/\S+)$/;

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "نام محصول را وارد کنید.")
    .max(120, "نام خیلی طولانی است."),
  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "اسلاگ فقط شامل حروف کوچک انگلیسی، عدد و خط تیره باشد.",
    )
    .or(z.literal("")),
  description: z
    .string()
    .trim()
    .min(10, "توضیحات باید حداقل ۱۰ حرف باشد.")
    .max(5000, "توضیحات خیلی طولانی است."),
  price: z
    .number({ message: "قیمت را وارد کنید." })
    .int("قیمت باید عدد صحیح باشد.")
    .min(0, "قیمت نمی‌تواند منفی باشد.")
    .max(2_000_000_000, "قیمت بیش از حد مجاز است."),
  discountPercent: z
    .number({ message: "درصد تخفیف را وارد کنید." })
    .int("درصد تخفیف باید عدد صحیح باشد.")
    .min(0, "حداقل ۰")
    .max(100, "حداکثر ۱۰۰"),
  stock: z
    .number({ message: "موجودی را وارد کنید." })
    .int("موجودی باید عدد صحیح باشد.")
    .min(0, "موجودی نمی‌تواند منفی باشد."),
  imageUrl: z
    .string()
    .nullable()
    .refine(
      (v) => v === null || imageUrlPattern.test(v),
      "آدرس تصویر نامعتبر است.",
    ),
  isFeatured: z.boolean(),
  isBestSeller: z.boolean(),
  isPopular: z.boolean(),
  categoryId: z.string().min(1, "دسته‌بندی را انتخاب کنید."),
});

export type ProductValues = z.infer<typeof productSchema>;
