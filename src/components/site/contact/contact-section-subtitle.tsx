import { cn } from "@/lib/utils";

type ContactSectionSubtitleProps = {
  children: React.ReactNode;
  centered?: boolean;
  className?: string;
};

export function ContactSectionSubtitle({
  children,
  centered = false,
  className,
}: ContactSectionSubtitleProps) {
  return (
    <span
      className={cn(
        "relative mb-[15px] inline-block rounded-full py-2 pl-8 pr-4",
        "font-sans text-sm font-medium uppercase leading-none text-foreground",
        "bg-muted",
        "before:absolute before:left-4 before:top-1/2 before:size-1.5",
        "before:-translate-y-1/2 before:rounded-full before:bg-accent before:content-['']",
        centered && "mx-auto",
        className,
      )}
    >
      {children}
    </span>
  );
}
