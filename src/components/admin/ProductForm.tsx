"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/actions/product";
import { ProductImage } from "@/components/product/ProductImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slug";
import { productSchema, type ProductValues } from "@/lib/validators";

type Props = {
  categories: { id: string; name: string }[];
  productId?: string;
  initialValues?: ProductValues;
};

const EMPTY: ProductValues = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  discountPercent: 0,
  stock: 0,
  imageUrl: null,
  isFeatured: false,
  isBestSeller: false,
  isPopular: false,
  categoryId: "",
};

const selectClass =
  "h-9 w-full rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

// فقط آدرس‌های معتبر پیش‌نمایش داده می‌شوند تا هنگام تایپ، next/image خطا ندهد
const PREVIEWABLE = /^(\/uploads\/[\w.-]+|https:\/\/\S+)$/;

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function ProductForm({ categories, productId, initialValues }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isEdit = Boolean(productId);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues ?? EMPTY,
  });

  const imageUrl = watch("imageUrl");
  const previewSrc = imageUrl && PREVIEWABLE.test(imageUrl) ? imageUrl : null;

  const setImageUrl = (value: string) => {
    const trimmed = value.trim();
    setValue("imageUrl", trimmed === "" ? null : trimmed, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = (values: ProductValues) =>
    startTransition(async () => {
      const result = productId
        ? await updateProduct(productId, values)
        : await createProduct(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.push("/admin/products");
      router.refresh();
    });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-6 lg:grid-cols-3"
      noValidate
    >
      <div className="space-y-5 rounded-2xl border bg-card p-5 lg:col-span-2">
        <Field label="نام محصول" htmlFor="name" error={errors.name?.message}>
          <Input
            id="name"
            aria-invalid={!!errors.name}
            {...register("name", {
              onBlur: () => {
                if (!getValues("slug")) {
                  const s = slugify(getValues("name"));
                  if (s) setValue("slug", s);
                }
              },
            })}
          />
        </Field>

        <Field
          label="اسلاگ (آدرس صفحه، انگلیسی)"
          htmlFor="slug"
          error={errors.slug?.message}
        >
          <Input
            id="slug"
            dir="ltr"
            className="text-left"
            placeholder={isEdit ? "" : "خالی بگذارید تا خودکار ساخته شود"}
            aria-invalid={!!errors.slug}
            {...register("slug")}
          />
        </Field>

        <Field
          label="توضیحات"
          htmlFor="description"
          error={errors.description?.message}
        >
          <Textarea
            id="description"
            rows={6}
            aria-invalid={!!errors.description}
            {...register("description")}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field
            label="قیمت (تومان)"
            htmlFor="price"
            error={errors.price?.message}
          >
            <Input
              id="price"
              type="number"
              min={0}
              dir="ltr"
              className="text-left"
              {...register("price", { valueAsNumber: true })}
            />
          </Field>
          <Field
            label="تخفیف (٪)"
            htmlFor="discountPercent"
            error={errors.discountPercent?.message}
          >
            <Input
              id="discountPercent"
              type="number"
              min={0}
              max={100}
              dir="ltr"
              className="text-left"
              {...register("discountPercent", { valueAsNumber: true })}
            />
          </Field>
          <Field label="موجودی" htmlFor="stock" error={errors.stock?.message}>
            <Input
              id="stock"
              type="number"
              min={0}
              dir="ltr"
              className="text-left"
              {...register("stock", { valueAsNumber: true })}
            />
          </Field>
        </div>

        <Field
          label="دسته‌بندی"
          htmlFor="categoryId"
          error={errors.categoryId?.message}
        >
          <select
            id="categoryId"
            className={selectClass}
            {...register("categoryId")}
          >
            <option value="">انتخاب کنید...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="space-y-5">
        <div className="space-y-3 rounded-2xl border bg-card p-5">
          <Label htmlFor="imageUrl">تصویر محصول</Label>

          <div className="group relative aspect-square overflow-hidden rounded-xl border bg-muted">
            <ProductImage
              src={previewSrc}
              alt="پیش‌نمایش تصویر"
              sizes="320px"
            />
          </div>

          <Input
            id="imageUrl"
            type="url"
            dir="ltr"
            className="text-left"
            placeholder="https://example.com/image.jpg"
            value={imageUrl ?? ""}
            onChange={(e) => setImageUrl(e.target.value)}
            aria-invalid={!!errors.imageUrl}
          />
          <p className="text-xs leading-6 text-muted-foreground">
            آدرس مستقیم تصویر را وارد کنید. باید با{" "}
            <span dir="ltr">https://</span> شروع شود.
          </p>
          {errors.imageUrl && (
            <p className="text-sm text-destructive">
              {errors.imageUrl.message}
            </p>
          )}

          {imageUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setImageUrl("")}
            >
              <X className="h-4 w-4" />
              حذف تصویر
            </Button>
          )}
        </div>

        <div className="space-y-3 rounded-2xl border bg-card p-5">
          <Label>نمایش در فروشگاه</Label>
          {(
            [
              ["isFeatured", "محصول ویژه"],
              ["isBestSeller", "پرفروش"],
              ["isPopular", "محبوب"],
            ] as const
          ).map(([name, label]) => (
            <label
              key={name}
              className="flex cursor-pointer items-center gap-3 text-sm"
            >
              <input
                type="checkbox"
                className="h-4 w-4 accent-violet-600"
                {...register(name)}
              />
              {label}
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1" disabled={pending}>
            {pending
              ? "در حال ذخیره..."
              : isEdit
                ? "ذخیره تغییرات"
                : "ایجاد محصول"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
            disabled={pending}
          >
            انصراف
          </Button>
        </div>
      </div>
    </form>
  );
}
