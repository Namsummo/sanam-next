import { CouncilMemberCard } from "@/components/site/clergy/council-member-card";
import { PriestCard } from "@/components/site/clergy/priest-card";
import {
  getVisibleCouncilMembers,
  getVisiblePriests,
} from "@/lib/clergy/mock-clergy";
import { cn } from "@/lib/utils";

type ClergyHomeSectionProps = {
  className?: string;
};

export function ClergyHomeSection({ className }: ClergyHomeSectionProps) {
  const priests = getVisiblePriests();
  const council = getVisibleCouncilMembers();

  if (priests.length === 0 && council.length === 0) {
    return null;
  }

  return (
    <section
      className={cn(
        "w-full px-6 py-16 md:px-10 md:py-[120px]",
        className,
      )}
    >
      <div className="mx-auto max-w-[1300px]">
        {/* Main Section Heading */}
        <div className="mb-14 text-center md:mb-20">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-tight">
            Quý Cha & Ban Hành Giáo
          </h2>
          <p className="mt-4 font-sans text-base md:text-lg text-foreground/80 max-w-2xl mx-auto">
            Những người phục vụ âm thầm trong vườn nho của Chúa tại Giáo xứ Sa Nam.
          </p>
        </div>

        {/* Priests Grid (Quý Cha) */}
        {priests.length > 0 ? (
          <div className="mb-16 md:mb-24">
            <div
              className={cn(
                "grid grid-cols-1 gap-8",
                priests.length > 1 && "lg:grid-cols-2",
              )}
            >
              {priests.map((member) => (
                <PriestCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        ) : null}

        {council.length > 0 ? (
          <div className="rounded-[32px] bg-[#eae7de]/60 border border-border/50 p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.015)]">
            <div className="mb-8 text-center md:mb-10">
              <h3 className="font-display text-xs md:text-sm font-bold tracking-[0.2em] text-primary/70 uppercase">
                Ban Hành Giáo Đương Nhiệm
              </h3>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {council.map((member) => (
                <div
                  key={member.id}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(20%-20px)]"
                >
                  <CouncilMemberCard member={member} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
