import Image from "next/image";
import { DEFAULT_COVER } from "@/lib/image-constants";
import type { ExecutiveMember } from "@/lib/organization/types";
import { cn } from "@/lib/utils";

type OrganizationMemberCardSize = "executive" | "member";

type OrganizationMemberCardProps = {
  member: ExecutiveMember;
  size?: OrganizationMemberCardSize;
  className?: string;
};

const sizeStyles: Record<
  OrganizationMemberCardSize,
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

export function OrganizationMemberCard({
  member,
  size = "member",
  className,
}: OrganizationMemberCardProps) {
  const styles = sizeStyles[size];
  const imgSrc = member.image || DEFAULT_COVER;
  const isExternal = !!member.image;

  return (
    <article
      className={cn(
        "p-2 text-center flex flex-col items-center",
        className,
      )}
    >
      <figure
        className={cn(
          "mx-auto mb-3 overflow-hidden rounded-[20px] shadow-sm transition-transform duration-300 hover:scale-[1.03]",
          styles.image,
        )}
      >
        {isExternal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={`Chân dung ${member.fullName}`}
            className="size-full object-cover"
          />
        ) : (
          <Image
            src={imgSrc}
            alt={`Chân dung ${member.fullName}`}
            width={styles.imagePx}
            height={styles.imagePx}
            className="size-full object-cover"
          />
        )}
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
        {member.patronSaint ? `${member.patronSaint} ` : ""}
        {member.fullName}
      </h3>
      {member.parish && (
        <p className="mt-1 text-xs text-muted-foreground">{member.parish}</p>
      )}
    </article>
  );
}
