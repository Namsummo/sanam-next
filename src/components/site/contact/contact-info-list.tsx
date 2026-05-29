import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ContactInfoItem } from "@/lib/contact/site-contact";

type ContactInfoListProps = {
  items: ContactInfoItem[];
  className?: string;
};

export function ContactInfoList({ items, className }: ContactInfoListProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-10 pt-10 max-md:gap-[30px] max-md:pt-[30px] max-sm:gap-5",
        className,
      )}
    >
      {items.map((item) => (
        <ContactInfoItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function ContactInfoItemCard({ item }: { item: ContactInfoItem }) {
  const isExternalLink = item.href?.startsWith("http");

  const content = item.href ? (
    <a
      href={item.href}
      className="text-inherit transition-colors duration-400 hover:text-accent"
      {...(isExternalLink
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {item.value}
    </a>
  ) : (
    item.value
  );

  return (
    <div
      className={cn(
        "group flex w-full flex-wrap items-center gap-[15px] sm:w-[calc(50%-20px)]",
        item.fullWidth && "sm:w-full",
      )}
    >
      <div
        className={cn(
          "relative flex size-[50px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent",
          "max-md:size-[46px]",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 scale-0 rounded-full bg-primary transition-transform duration-400 ease-in-out",
            "group-hover:scale-100",
          )}
        />
        <Image
          src={item.iconSrc}
          alt=""
          width={24}
          height={24}
          className="relative z-1 size-6"
        />
      </div>

      <div className="min-w-0 flex-1 font-sans sm:max-w-[calc(100%-65px)]">
        <h3 className="font-display text-xl font-semibold uppercase leading-none text-primary max-sm:text-lg">
          {item.title}
        </h3>
        <p className="mt-[5px] text-base leading-normal text-foreground">{content}</p>
      </div>
    </div>
  );
}
