import Image from "next/image";
import { DEFAULT_COVER } from "@/lib/image-constants";
import type { ClergyMember } from "@/lib/clergy/types";
import { cn, resolveApiUrl } from "@/lib/utils";

type CouncilMemberCardSize = "executive" | "member";

type CouncilMemberCardProps = {
  member: ClergyMember;
  size?: CouncilMemberCardSize;
  className?: string;
  onClick?: () => void;
};

const sizeStyles: Record<
  CouncilMemberCardSize,
  { image: string; imageWidth: number; imageHeight: number; name: string; position: string }
> = {
  executive: {
    image: "w-[100px] md:w-[160px] aspect-[3/4]",
    imageWidth: 160,
    imageHeight: 213,
    name: "text-lg md:text-xl",
    position: "text-sm",
  },
  member: {
    image: "w-[72px] md:w-[110px] lg:w-[120px] aspect-[3/4]",
    imageWidth: 120,
    imageHeight: 160,
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
  const imgSrc = resolveApiUrl(member.image) || DEFAULT_COVER;

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
          "mx-auto mb-3 overflow-hidden  shadow-sm transition-transform duration-300",
          onClick && "hover:scale-[1.03]",
          styles.image,
        )}
      >
        <Image
          src={imgSrc}
          alt={`Chân dung ${member.fullName}`}
          width={styles.imageWidth}
          height={styles.imageHeight}
          unoptimized={!!member.image}
          className="size-full object-cover object-top"
        />
      </figure>
      <p
        className={cn(
          "mt-0.5 font-sans font-semibold tracking-wider text-accent uppercase",
          styles.position,
        )}
      >
        {member.position}
      </p>
      <h3
        className={cn(
          "font-display font-bold tracking-tight text-primary leading-snug",
          styles.name,
        )}
      >
        {member.fullName}
      </h3>
    </article>
  );
}
