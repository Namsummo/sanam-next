import Image from "next/image";
import { getClergyAvatarSrc } from "@/lib/clergy/avatar-image";
import type { ClergyMember } from "@/lib/clergy/types";
import { cn } from "@/lib/utils";

type CouncilMemberCardProps = {
  member: ClergyMember;
  className?: string;
};

export function CouncilMemberCard({ member, className }: CouncilMemberCardProps) {
  const avatarSrc = getClergyAvatarSrc(member.avatar);

  return (
    <article
      className={cn(
        "p-2 text-center flex flex-col items-center cursor-pointer",
        className,
      )}
    >
      <figure className="mx-auto mb-3 size-[110px] md:size-[130px] overflow-hidden rounded-[20px] shadow-sm transition-transform duration-300 hover:scale-[1.03]">
        <Image
          src={avatarSrc}
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
