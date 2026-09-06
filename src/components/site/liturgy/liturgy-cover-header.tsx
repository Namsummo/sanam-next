import Image from "next/image";
import { cn, resolveApiUrl } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { formatIsoDateToVi } from "@/lib/format";

type LiturgyCoverHeaderProps = {
  title: string;
  coverImage?: string | null;
  subtitle: string;
  className?: string;
  date: string;
};

export function LiturgyCoverHeader({
  title,
  coverImage,
  subtitle,
  className,
  date,
}: LiturgyCoverHeaderProps) {
  const imageSrc = coverImage ? resolveApiUrl(coverImage) : null;

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card", className)}>
      {imageSrc ? (
        <div className="relative aspect-21/9 w-full bg-muted">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      ) : null}
      <div className={cn("p-5 md:p-6 space-y-2", imageSrc && "border-t border-border")}>
        <h3 className="font-display text-xl font-semibold text-primary md:text-2xl">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-2 font-sans text-lg font-semibold text-foreground/70 italic">&ldquo;{subtitle}&rdquo;</p>
        ) : null}
        <span className="flex items-center gap-2 text-sm text-foreground/70">
          <CalendarIcon className="size-4" /> {formatIsoDateToVi(date)}
        </span>
      </div>
    </div>
  );
}
