import Image from "next/image";
import { DEFAULT_COVER } from "@/lib/image-constants";
import type { ClergyMember } from "@/lib/clergy/types";
import { cn } from "@/lib/utils";

type CouncilMemberCardProps = {
  member: ClergyMember;
  className?: string;
  onClick?: () => void;
};

export function CouncilMemberCard({ member, className, onClick }: CouncilMemberCardProps) {
  return (
    <article
      onClick={onClick}
      className={cn(
        "p-2 text-center flex flex-col items-center cursor-pointer",
        className,
      )}
    >
      <figure className="mx-auto mb-3 size-[110px] md:size-[130px] overflow-hidden rounded-[20px] shadow-sm transition-transform duration-300 hover:scale-[1.03]">
        <Image
          src={DEFAULT_COVER}
          alt={`Chân dung ${member.fullName}`}
          width={130}
          height={130}
          className="size-full object-cover"
        />
      </figure>
      <h3 className="font-display text-base font-bold tracking-tight text-primary leading-snug md:text-lg">
        {member.fullName}
      </h3>
      <p className="mt-0.5 font-sans text-xs md:text-sm font-semibold tracking-wider text-accent uppercase">
        {member.position}
      </p>
    </article>
  );
}
