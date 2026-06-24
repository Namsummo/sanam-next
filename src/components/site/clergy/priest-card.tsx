import Image from "next/image";
import { DEFAULT_COVER } from "@/lib/image-constants";
import type { ClergyMember } from "@/lib/clergy/types";
import { cn, resolveApiUrl } from "@/lib/utils";

type PriestCardProps = {
  member: ClergyMember;
  className?: string;
  onClick?: () => void;
};

export function PriestCard({ member, className, onClick }: PriestCardProps) {
  const imgSrc = resolveApiUrl(member.image) || DEFAULT_COVER;

  return (
    <article
      onClick={onClick}
      className={cn(
        "flex flex-col sm:flex-row gap-6 p-6 items-center sm:items-start rounded-[24px] bg-card border border-border/40 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 cursor-pointer",
        className,
      )}
    >
      <figure className="relative w-[160px] sm:w-[150px] md:w-[170px] lg:w-[190px] aspect-4/5 shrink-0 overflow-hidden rounded-[16px] shadow-sm">
        <Image
          src={imgSrc}
          alt={`Chân dung ${member.fullName}`}
          width={300}
          height={375}
          unoptimized={!!member.image}
          className="size-full object-cover object-top transition-transform duration-600 ease-in-out hover:scale-[1.03]"
        />
      </figure>

      <div className="flex-1 flex flex-col justify-start text-center sm:text-left">
        <span className="font-sans text-xs md:text-sm font-semibold tracking-wider text-accent uppercase">
          {member.position}
        </span>

        <h3 className="mt-1 font-display text-xl md:text-2xl font-semibold tracking-tight text-primary">
          {member.fullName}
        </h3>

        {member.motto ? (
          <blockquote className="relative mt-3 pl-4 border-l-[3px] border-accent/70 italic text-foreground/80 text-sm md:text-base font-sans leading-relaxed">
            &ldquo;{member.motto}&rdquo;
          </blockquote>
        ) : null}

        {member.description ? (
          <p className="mt-3 text-sm md:text-base text-foreground/70 leading-relaxed font-sans">
            {member.description}
          </p>
        ) : null}
      </div>
    </article>
  );
}
