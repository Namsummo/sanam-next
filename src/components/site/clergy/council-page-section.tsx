"use client";

import { useState } from "react";
import Link from "next/link";
import { CouncilMembersPanel } from "@/components/site/clergy/council-members-panel";
import { ClergyDetailModal } from "@/components/site/clergy/clergy-detail-modal";
import { getVisibleCouncilMembers } from "@/lib/clergy/mock-clergy";
import type { ClergyMember } from "@/lib/clergy/types";

export function CouncilPageSection() {
  const [selectedMember, setSelectedMember] = useState<ClergyMember | null>(null);
  const members = getVisibleCouncilMembers();

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
