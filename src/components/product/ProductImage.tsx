import Image from "next/image";
import { ImageIcon } from "lucide-react";

type Props = {
  src: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
};

export function ProductImage({
  src,
  alt,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority,
}: Props) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-violet-100 text-violet-400">
        <ImageIcon className="h-10 w-10" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      // تصاویر آپلودی در زمان اجرا ساخته می‌شوند و قبلاً با sharp بهینه شده‌اند
      unoptimized={src.startsWith("http") || src.startsWith("/uploads/")}
      className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}
