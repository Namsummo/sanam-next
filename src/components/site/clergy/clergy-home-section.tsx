"use client";

import { useState } from "react";
import Link from "next/link";
import { CouncilMemberCard } from "@/components/site/clergy/council-member-card";
import { PriestCard } from "@/components/site/clergy/priest-card";
import { ClergyDetailModal } from "@/components/site/clergy/clergy-detail-modal";
import {
  getCurrentCouncilMembers,
  getVisiblePriests,
} from "@/lib/clergy/mock-clergy";
import { cn } from "@/lib/utils";
import type { ClergyMember } from "@/lib/clergy/types";

type ClergyHomeSectionProps = {
  className?: string;
};

export function ClergyHomeSection({ className }: ClergyHomeSectionProps) {
  const [selectedMember, setSelectedMember] = useState<ClergyMember | null>(null);

  const priests = getVisiblePriests();
  const council = getCurrentCouncilMembers();

  if (priests.length === 0 && council.length === 0) {
    return null;
  }

  return (
    <>
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
                  <PriestCard
                    key={member.id}
                    member={member}
                    onClick={() => setSelectedMember(member)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {/* Council Grid (Ban Hành Giáo) */}
          {council.length > 0 ? (
            <div className="rounded-[32px] bg-[#eae7de]/60 border border-border/50 p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.015)]">
              <div className="mb-8 text-center md:mb-10">
                <h3 className="font-display text-xs md:text-sm font-bold tracking-[0.2em] text-primary/70 uppercase">
                  Ban Hành Giáo Đương Nhiệm
                </h3>
              </div>

              <ul className="flex list-none gap-4 overflow-x-auto pb-1 md:grid md:grid-cols-5 md:overflow-visible md:pb-0 md:gap-6">
                {council.map((member) => (
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
                  className="font-semibold text-primary underline-offset-4 transition-colors hover:text-accent hover:underline"
                >
                  Xem Ban Hành Giáo các khóa trước
                </Link>
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Profile Detail Modal */}
      <ClergyDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </>
  );
}

