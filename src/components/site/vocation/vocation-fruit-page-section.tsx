"use client";

import Link from "next/link";
import { VocationFruitPanel } from "@/components/site/vocation/vocation-fruit-panel";
import { getVisibleVocationFruits } from "@/lib/vocation/mock-vocation-fruits";

export function VocationFruitPageSection() {
  const fruits = getVisibleVocationFruits();

  return (
    <>
      <p className="mx-auto mb-12 max-w-[800px] text-center font-sans text-lg leading-relaxed text-foreground md:mb-16">
        Danh sách các Quý Cha, Quý Thầy và Quý Dì xuất thân từ quê hương giáo
        xứ Sa Nam — những hoa trái ơn gọi trong vườn nho Chúa.
      </p>

      <VocationFruitPanel fruits={fruits} />

      <div className="mt-14 border-t border-border pt-10 md:mt-16">
        <Link
          href="/introduce"
          className="font-display text-base font-semibold uppercase text-primary transition-colors hover:text-accent"
        >
          ← Quay lại giới thiệu
        </Link>
      </div>
    </>
  );
}
