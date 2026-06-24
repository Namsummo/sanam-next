import Image from "next/image";
import { DEFAULT_COVER } from "@/lib/image-constants";
import type { VocationFruit } from "@/lib/vocation/types";
import { cn } from "@/lib/utils";

type VocationFruitCardProps = {
  fruit: VocationFruit;
  className?: string;
};

export function VocationFruitCard({ fruit, className }: VocationFruitCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col items-center rounded-[20px] border border-border/40 bg-[#eae7de]/50 p-5 text-center md:p-6",
        className,
      )}
    >
      <figure className="mx-auto mb-4 size-[120px] overflow-hidden rounded-[20px] shadow-sm md:size-[130px]">
        <Image
          src={fruit.image || DEFAULT_COVER}
          alt={`Chân dung ${fruit.fullName}`}
          width={130}
          height={130}
          className="size-full object-cover"
        />
      </figure>

      <h3 className="font-display text-base font-bold leading-snug text-primary md:text-lg">
        {fruit.fullName}
      </h3>

      {fruit.religiousOrder ? (
        <p className="mt-2 font-sans text-sm text-foreground/80">
          {fruit.religiousOrder}
        </p>
      ) : null}

      {fruit.currentAssignment ? (
        <p className="mt-1 font-sans text-sm font-medium text-foreground">
          {fruit.currentAssignment}
        </p>
      ) : null}

      {fruit.hometown ? (
        <p className="mt-2 font-sans text-xs text-foreground/70">
          Quê hương: {fruit.hometown}
        </p>
      ) : null}
    </article>
  );
}
