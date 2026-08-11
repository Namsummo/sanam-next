"use client";

import { useState } from "react";
import Link from "next/link";
import { CouncilMemberCard } from "@/components/site/clergy/council-member-card";
import { PriestCard } from "@/components/site/clergy/priest-card";
import { ClergyDetailModal } from "@/components/site/clergy/clergy-detail-modal";
import type { ClergyMember } from "@/lib/clergy/types";
import { cn } from "@/lib/utils";
import { ScrollReveal, TextAnime } from "../shared/components/animation";

type ClergyHomeSectionClientProps = {
  priests: ClergyMember[];
  council: ClergyMember[];
  className?: string;
};

const COUNCIL_PREVIEW_COUNT = 3;

export function ClergyHomeSectionClient({
  priests,
  council,
  className,
}: ClergyHomeSectionClientProps) {
  const [selectedMember, setSelectedMember] = useState<ClergyMember | null>(null);
  const councilPreview = council.slice(0, COUNCIL_PREVIEW_COUNT);

  return (
    <>
      <section
        className={cn(
          "w-full px-6 py-16 md:px-10 md:py-[120px]",
          className,
        )}
      >
        <div className="mx-auto max-w-[1300px]">
          <div className="mb-14 text-center md:mb-20">
            <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-primary md:text-5xl lg:text-6xl">
              <TextAnime>Quý Cha & Ban Hành Giáo</TextAnime>
            </h2>
            <ScrollReveal delay={0.2}>
              <p className="mx-auto mt-4 max-w-2xl font-sans text-base text-foreground/80 md:text-lg">
                Những người phục vụ âm thầm trong vườn nho của Chúa tại Giáo xứ Sa Nam.
              </p>
            </ScrollReveal>
          </div>

          {priests.length > 0 ? (
            <ScrollReveal delay={0.4}>
              <div className="mb-16 md:mb-24">
                <div
                  className={cn(
                    "grid grid-cols-1 gap-8",
                    priests.length > 1 ? "lg:grid-cols-2" : "mx-auto max-w-[720px]",
                  )}
                >
                  {priests.map((member) => (
                    <PriestCard
                      key={member.id}
                      member={member}
                      onClick={() => setSelectedMember(member)}
                    />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ) : null}

          {council.length > 0 ? (
            <ScrollReveal delay={0.6}>
              <div className="rounded-md border border-border/50 bg-[#eae7de]/60 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.015)] md:p-12">
                <div className="mb-8 text-center md:mb-10">
                  <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-primary/70 md:text-sm">
                    Ban Hành Giáo Đương Nhiệm
                  </h3>
                </div>

                <ul className="flex list-none justify-center gap-4 overflow-x-auto pb-1 sm:gap-8 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
                  {councilPreview.map((member) => (
                    <li
                      key={member.id}
                      className="min-w-[42vw] shrink-0 sm:min-w-[28vw] md:min-w-0"
                    >
                      <CouncilMemberCard
                        member={member}
                        onClick={() => setSelectedMember(member)}
                        className="w-full"
                      />
                    </li>
                  ))}
                </ul>

                <p className="mt-10 text-center font-sans text-sm text-foreground/80">
                  <Link
                    href="/introduce/ban-hanh-giao"
                    className="font-semibold text-primary underline-offset-4 transition-colors hover:text-accent underline italic"
                  >
                    Xem Thêm
                  </Link>
                </p>
              </div>
            </ScrollReveal>
          ) : null}
        </div>
      </section>

      <ClergyDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </>
  );
}
