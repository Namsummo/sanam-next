import Image from "next/image";
import { DEFAULT_COVER } from "@/lib/image-constants";
import type { ClergyMember } from "@/lib/clergy/types";
import { cn } from "@/lib/utils";

type CouncilMemberCardSize = "executive" | "member";

type CouncilMemberCardProps = {
  member: ClergyMember;
  size?: CouncilMemberCardSize;
  className?: string;
  onClick?: () => void;
};

const sizeStyles: Record<
  CouncilMemberCardSize,
  { image: string; imagePx: number; name: string; position: string }
> = {
  executive: {
    image: "size-[140px] md:size-[160px]",
    imagePx: 160,
    name: "text-lg md:text-xl",
    position: "text-sm",
  },
  member: {
    image: "size-[90px] md:size-[110px] lg:size-[120px]",
    imagePx: 120,
    name: "text-sm md:text-base lg:text-lg",
    position: "text-[10px] md:text-xs lg:text-sm",
  },
};

export function CouncilMemberCard({
  member,
  size = "member",
  className,
  onClick,
}: CouncilMemberCardProps) {
  const styles = sizeStyles[size];

  return (
    <article
      onClick={onClick}
      className={cn(
        "p-2 text-center flex flex-col items-center",
        onClick && "cursor-pointer",
        className,
      )}
    >
      <figure
        className={cn(
          "mx-auto mb-3 overflow-hidden rounded-[20px] shadow-sm transition-transform duration-300",
          onClick && "hover:scale-[1.03]",
          styles.image,
        )}
      >
        <Image
          src={DEFAULT_COVER}
          alt={`Chân dung ${member.fullName}`}
          width={styles.imagePx}
          height={styles.imagePx}
          className="size-full object-cover"
        />
      </figure>
      <h3
        className={cn(
          "font-display font-bold tracking-tight text-primary leading-snug",
          styles.name,
        )}
      >
        {member.fullName}
      </h3>
      <p
        className={cn(
          "mt-0.5 font-sans font-semibold tracking-wider text-accent uppercase",
          styles.position,
        )}
      >
        {member.position}
      </p>
    </article>
  );
}
