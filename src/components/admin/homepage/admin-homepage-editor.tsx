"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { HeroSectionEditor } from "./hero-section-editor";
import { AboutUsSectionEditor } from "./about-us-section-editor";
import { OurMissionSectionEditor } from "./our-mission-section-editor";
import { FooterSectionEditor } from "./footer-section-editor";
import { IntroduceEditor } from "./introduce-editor";

type Tab = "hero" | "about-us" | "our-mission" | "footer" | "introduce";

const tabs: { id: Tab; label: string }[] = [
  { id: "hero", label: "Hero Section" },
  { id: "introduce", label: "Giới thiệu" },
  { id: "about-us", label: "About Us" },
  { id: "our-mission", label: "Our Mission" },
  { id: "footer", label: "Footer" },
];

export function AdminHomepageEditor() {
  const [activeTab, setActiveTab] = useState<Tab>("hero");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-card-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Về Tổng quan
        </Link>
        <div className="mt-3">
          <h1 className="font-display text-3xl font-semibold text-card-foreground">
            Giao diện Trang chủ
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Click vào phần tử trong khung xem trước để chỉnh sửa
          </p>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-card-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "hero" && <HeroSectionEditor />}
        {activeTab === "introduce" && <IntroduceEditor />}
        {activeTab === "about-us" && <AboutUsSectionEditor />}
        {activeTab === "our-mission" && <OurMissionSectionEditor />}
        {activeTab === "footer" && <FooterSectionEditor />}
      </div>
    </div>
  );
}
