import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
import { Button } from "@/components/site/shared/ui/button/button";
import { formatMemberCount } from "@/lib/format";
import type { Organization } from "@/lib/organization/types";
import { DEFAULT_COVER, DEFAULT_COVER_ALT } from "@/lib/image-constants";
import { cn } from "@/lib/utils";

type OrganizationCardProps = {
  organization: Organization;
  className?: string;
};

export function OrganizationCard({ organization, className }: OrganizationCardProps) {
  const href = `/organization/${organization.slug}`;

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[20px] border border-border/40 bg-card shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      <Link href={href} className="block overflow-hidden">
        <figure className="overflow-hidden">
          <Image
            src={DEFAULT_COVER}
            alt={organization.name || DEFAULT_COVER_ALT}
            width={640}
            height={400}
            className="aspect-16/10 w-full object-cover transition-transform duration-600 ease-in-out hover:scale-[1.05]"
          />
        </figure>
      </Link>

      <div className="flex flex-1 flex-col px-6 py-6">
        <h2 className="font-display text-2xl font-semibold leading-tight text-primary">
          <Link
            href={href}
            className="text-inherit transition-colors hover:text-accent"
          >
            {organization.name}
          </Link>
        </h2>

        <p className="mt-3 flex items-center gap-2 font-sans text-base text-foreground">
          <Users className="size-4 shrink-0 text-accent" aria-hidden />
          <span>{formatMemberCount(organization.memberCount)}</span>
        </p>

        <div className="mt-auto pt-6">
          <Button href={href} className="w-full justify-center py-3.5 pr-[46px] text-sm">
            Xem chi tiết
          </Button>
        </div>
      </div>
    </article>
  );
}
