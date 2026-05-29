"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, Calendar, Award, Heart, BookOpen, MapPin, Quote } from "lucide-react";
import { formatIsoDateToVi } from "@/lib/format";
import { DEFAULT_COVER } from "@/lib/image-constants";
import type { ClergyMember } from "@/lib/clergy/types";
import { CLERGY_TYPE_PRIEST } from "@/lib/clergy/types";

type ClergyDetailModalProps = {
  member: ClergyMember | null;
  onClose: () => void;
};

export function ClergyDetailModal({ member, onClose }: ClergyDetailModalProps) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (member) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [member]);

  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!member) return null;

  const isPriest = member.type === CLERGY_TYPE_PRIEST;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop with Blur */}
      <div
        className="fixed inset-0 bg-[#010101]/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content Container */}
      <div className="relative w-full max-w-[800px] overflow-hidden rounded-[32px] bg-[#f5f3ec] border border-border shadow-[0_35px_70px_rgba(0,0,0,0.25)] transition-all duration-300 md:flex z-10">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#010101]/10 text-primary hover:bg-accent hover:text-white transition-all duration-300 cursor-pointer"
          aria-label="Đóng"
        >
          <X className="size-5" />
        </button>

        {/* Left Side: Avatar and Quick Info */}
        <div className="relative w-full md:w-[320px] shrink-0 bg-[#eae7de]/70 flex flex-col items-center justify-center p-8 text-center border-b md:border-b-0 md:border-r border-border/40">
          <figure className="relative w-[180px] aspect-4/5 overflow-hidden rounded-[24px] shadow-md border-4 border-white mb-4 transition-transform duration-500 hover:scale-[1.02]">
            <Image
              src={DEFAULT_COVER}
              alt={`Chân dung ${member.fullName}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 180px, 180px"
              priority
            />
          </figure>

          <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider text-accent bg-accent/10 uppercase mb-2">
            {isPriest ? "Linh mục Triều" : "Ban Hành Giáo"}
          </span>

          <h3 className="font-display text-lg font-bold text-primary leading-tight">
            {member.fullName}
          </h3>
          <p className="mt-1 font-sans text-sm font-semibold text-foreground/80">
            {member.position}
          </p>
        </div>

        {/* Right Side: Detailed Profile Info */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center">
          <div className="space-y-6">
            <div>
              <span className="font-display text-xs font-bold tracking-[0.2em] text-accent/80 uppercase">
                Thông tin cá nhân
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold text-primary">
                Chi tiết nhân sự
              </h2>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Birthday */}
              {member.birthday ? (
                <div className="flex items-center gap-3 p-3 rounded-[16px] bg-white/50 border border-border/30">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/5 text-accent">
                    <Calendar className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Ngày sinh</p>
                    <p className="text-sm font-semibold text-primary">{formatIsoDateToVi(member.birthday)}</p>
                  </div>
                </div>
              ) : null}

              {/* Ordination Date (Priests only) */}
              {isPriest && member.ordinationDate ? (
                <div className="flex items-center gap-3 p-3 rounded-[16px] bg-white/50 border border-border/30">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/5 text-accent">
                    <Award className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Thụ phong Linh mục</p>
                    <p className="text-sm font-semibold text-primary">{formatIsoDateToVi(member.ordinationDate)}</p>
                  </div>
                </div>
              ) : null}

              {/* Patron Saint */}
              {member.patronSaint ? (
                <div className="flex items-center gap-3 p-3 rounded-[16px] bg-white/50 border border-border/30">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/5 text-accent">
                    <Heart className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Thánh bổn mạng</p>
                    <p className="text-sm font-semibold text-primary">{member.patronSaint}</p>
                  </div>
                </div>
              ) : null}

              {/* Feast Day (Ngày mừng lễ bổn mạng) */}
              {member.patronDate ? (
                <div className="flex items-center gap-3 p-3 rounded-[16px] bg-white/50 border border-border/30">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/5 text-accent">
                    <BookOpen className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Lễ bổn mạng</p>
                    <p className="text-sm font-semibold text-primary">{member.patronDate}</p>
                  </div>
                </div>
              ) : null}

              {/* Hometown or Giáo họ */}
              {member.hometown ? (
                <div className="flex items-center gap-3 p-3 rounded-[16px] bg-white/50 border border-border/30 sm:col-span-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/5 text-accent">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">
                      {isPriest ? "Quê quán" : "Giáo họ thuộc giáo xứ"}
                    </p>
                    <p className="text-sm font-semibold text-primary">{member.hometown}</p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Motto (Priests only) */}
            {isPriest && member.motto ? (
              <div className="relative p-5 rounded-[20px] bg-white/70 border border-border/40 overflow-hidden">
                <Quote className="absolute right-4 bottom-4 h-16 w-16 text-accent/5 pointer-events-none transform translate-y-2 translate-x-2" />
                <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-2">Khẩu hiệu mục vụ</p>
                <blockquote className="italic text-foreground text-sm md:text-[14px] leading-relaxed pl-3 border-l-2 border-accent">
                  &ldquo;{member.motto}&rdquo;
                </blockquote>
              </div>
            ) : null}

            {/* Description (Biography / Ministry) */}
            {member.description ? (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Sơ lược mục vụ</h4>
                <p className="text-sm text-foreground/80 leading-relaxed font-sans">
                  {member.description}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
