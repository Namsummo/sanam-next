import Image from "next/image";
import Link from "next/link";
import { DEFAULT_COVER } from "@/lib/image-constants";
import { getOrganizationMemberDetailHref } from "@/lib/organization/member-routes";
import type { OrganizationMemberDisplay } from "@/lib/organization/types";
import { cn } from "@/lib/utils";

type OrganizationMemberCardSize = "executive" | "member";

type OrganizationMemberCardProps = {
  member: OrganizationMemberDisplay;
  organizationSlug: string;
  size?: OrganizationMemberCardSize;
  className?: string;
};

const sizeStyles: Record<
  OrganizationMemberCardSize,
  {
    card: string;
    image: string;
    imagePx: number;
    realName: string;
    saintName: string;
  }
> = {
  executive: {
    card: "p-6 md:p-7",
    image: "size-[140px] md:size-[160px]",
    imagePx: 160,
    realName: "text-xl md:text-2xl",
    saintName: "text-sm md:text-base",
  },
  member: {
    card: "p-5",
    image: "size-[110px] md:size-[120px]",
    imagePx: 120,
    realName: "text-lg md:text-xl",
    saintName: "text-xs md:text-sm",
  },
};

export function OrganizationMemberCard({
  member,
  organizationSlug,
  size = "member",
  className,
}: OrganizationMemberCardProps) {
  const displaySaintName = member.saintName.trim();
  const displayRealName = member.realName.trim();
  const styles = sizeStyles[size];
  const href = getOrganizationMemberDetailHref(organizationSlug, member.personId);

  return (
    <Link
      href={href}
      className={cn(
        "block w-full max-w-[320px] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      <article
        className={cn(
          "flex h-full flex-col items-center rounded-[20px] border border-border/40 bg-card text-center shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]",
          styles.card,
        )}
      >
        <figure
          className={cn(
            "mb-4 overflow-hidden rounded-[16px] shadow-sm",
            styles.image,
          )}
        >
          <Image
            src={DEFAULT_COVER}
            alt={`${displaySaintName} ${displayRealName}`}
            width={styles.imagePx}
            height={styles.imagePx}
            className="size-full object-cover"
          />
        </figure>

        <p className="font-sans text-xs font-semibold uppercase tracking-wider text-accent">
          {member.position}
        </p>

        <h3
          className={cn(
            "mt-2 font-display font-bold leading-snug text-primary",
            styles.realName,
          )}
        >
          {displayRealName}
        </h3>

        <p
          className={cn(
            "mt-1 font-sans font-medium text-foreground/70",
            styles.saintName,
          )}
        >
          {displaySaintName}
        </p>
      </article>
    </Link>
  );
}
