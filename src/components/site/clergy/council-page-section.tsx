"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CouncilMembersPanel } from "@/components/site/clergy/council-members-panel";
import { ClergyDetailModal } from "@/components/site/clergy/clergy-detail-modal";
import { getPublicClergy } from "@/shared/services/clergy-api";
import { getVisibleCouncilMembers } from "@/lib/clergy/mock-clergy";
import { CLERGY_TYPE_COUNCIL } from "@/lib/clergy/types";
import type { ClergyMember } from "@/lib/clergy/types";

export function CouncilPageSection() {
  const [selectedMember, setSelectedMember] = useState<ClergyMember | null>(null);
  const [apiMembers, setApiMembers] = useState<ClergyMember[] | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await getPublicClergy({ type: "council" });
        setApiMembers(
          res.members.map((m) => ({
            id: m._id,
            type: m.type as 1 | 2,
            fullName: m.fullName,
            position: m.position,
            motto: m.motto || undefined,
            description: m.description || undefined,
            birthday: m.birthday || undefined,
            sortOrder: m.sortOrder ?? undefined,
            isVisible: m.isVisible,
            image: m.image || undefined,
            ordinationDate: m.ordinationDate || undefined,
            patronSaint: m.patronSaint || undefined,
            patronDate: m.patronDate || undefined,
            hometown: m.hometown || undefined,
            termId: m.termId || undefined,
          })),
        );
      } catch {
        setApiMembers(null);
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  const members = loaded && apiMembers
    ? apiMembers.filter((m) => m.isVisible !== false && m.type === CLERGY_TYPE_COUNCIL)
    : getVisibleCouncilMembers();

  return (
    <>
      <p className="mx-auto mb-12 max-w-[800px] text-center font-sans text-lg leading-relaxed text-foreground md:mb-16">
        Danh sách Ban Hành Giáo qua các nhiệm kỳ. Bạn có thể tìm kiếm hoặc chọn
        khóa để xem ban hành giáo tương ứng.
      </p>

      <CouncilMembersPanel
        members={members}
        onMemberClick={setSelectedMember}
      />

      <div className="mt-14 border-t border-border pt-10 md:mt-16">
        <Link
          href="/introduce"
          className="font-display text-base font-semibold uppercase text-primary transition-colors hover:text-accent"
        >
          ← Quay lại giới thiệu
        </Link>
      </div>

      <ClergyDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </>
  );
}
