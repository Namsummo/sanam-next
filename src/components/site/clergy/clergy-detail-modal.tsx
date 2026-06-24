"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Calendar, Award, Heart, BookOpen, MapPin } from "lucide-react";
import { formatIsoDateToVi } from "@/lib/format";
import { DEFAULT_COVER } from "@/lib/image-constants";
import type { ClergyMember } from "@/lib/clergy/types";
import { CLERGY_TYPE_PRIEST } from "@/lib/clergy/types";
import { resolveApiUrl } from "@/lib/utils";

type ClergyDetailModalProps = {
  member: ClergyMember | null;
  onClose: () => void;
};

export function ClergyDetailModal({ member, onClose }: ClergyDetailModalProps) {
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

  if (!member || typeof document === "undefined") return null;

  const isPriest = member.type === CLERGY_TYPE_PRIEST;
  const imageSrc = resolveApiUrl(member.image) || DEFAULT_COVER;

  return createPortal(
    <div
      className="fixed inset-0 z-200 flex items-center justify-center overflow-y-auto p-2 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-[#010101]/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[92vh] w-full max-w-[800px] overflow-y-auto rounded-[20px] border border-border bg-[#f5f3ec] shadow-[0_35px_70px_rgba(0,0,0,0.25)] transition-all duration-300 md:flex md:max-h-none md:overflow-hidden md:rounded-[32px]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex size-8 cursor-pointer items-center justify-center rounded-full bg-[#010101]/10 text-primary transition-all duration-300 hover:bg-accent hover:text-white md:top-5 md:right-5 md:size-10"
          aria-label="Đóng"
        >
          <X className="size-4 md:size-5" />
        </button>

        <div className="relative flex w-full shrink-0 flex-col items-center justify-center border-b border-border/40 bg-[#eae7de]/70 p-4 text-center sm:p-6 md:w-[260px] md:border-r md:border-b-0 md:p-6">
          <figure className="relative mb-2 aspect-3/4 w-[112px] overflow-hidden transition-transform duration-500 hover:scale-[1.02] sm:mb-3 sm:w-[130px] md:mb-3 md:w-[140px]">
            <Image
              src={imageSrc}
              alt={`Chân dung ${member.fullName}`}
              width={140}
              height={187}
              unoptimized={!!member.image}
              className="size-full object-cover object-top"
              priority
            />
          </figure>

          <span className="mb-1 inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-accent uppercase md:mb-2 md:px-3.5 md:py-1 md:text-[11px]">
            {isPriest ? "Linh mục" : "Ban Hành Giáo"}
          </span>

          <p className="mt-0.5 font-sans text-xs font-semibold text-foreground/80 md:mt-1 md:text-sm">
            {member.position}
          </p>
          <h3 className="font-display text-base font-bold leading-tight text-primary md:text-lg">
            {member.fullName}
          </h3>
        </div>

        <div className="flex flex-1 flex-col justify-center p-4 sm:p-6 md:p-10">
          <div className="space-y-3 md:space-y-6">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-accent/80 uppercase md:text-xs">
                {isPriest ? "Thông tin linh mục" : "Thông tin ban hành giáo"}
              </span>
              <h2 className="mt-0.5 font-display text-lg font-bold text-primary md:mt-1 md:text-2xl">
                {isPriest ? "Chi tiết về Cha" : "Chi tiết ban hành giáo"}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:gap-4">
              {member.birthday ? (
                <div className="flex items-center gap-2 rounded-[12px] border border-border/30 bg-white/50 p-2.5 md:gap-3 md:rounded-[16px] md:p-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/5 text-accent md:size-10 md:rounded-xl">
                    <Calendar className="size-4 md:size-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold tracking-wider text-foreground/50 uppercase md:text-[10px]">Ngày sinh</p>
                    <p className="text-xs font-semibold text-primary md:text-sm">{formatIsoDateToVi(member.birthday)}</p>
                  </div>
                </div>
              ) : null}

              {isPriest && member.ordinationDate ? (
                <div className="flex items-center gap-2 rounded-[12px] border border-border/30 bg-white/50 p-2.5 md:gap-3 md:rounded-[16px] md:p-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/5 text-accent md:size-10 md:rounded-xl">
                    <Award className="size-4 md:size-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold tracking-wider text-foreground/50 uppercase md:text-[10px]">Thụ phong Linh mục</p>
                    <p className="text-xs font-semibold text-primary md:text-sm">{formatIsoDateToVi(member.ordinationDate)}</p>
                  </div>
                </div>
              ) : null}

              {member.patronSaint ? (
                <div className="flex items-center gap-2 rounded-[12px] border border-border/30 bg-white/50 p-2.5 md:gap-3 md:rounded-[16px] md:p-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/5 text-accent md:size-10 md:rounded-xl">
                    <Heart className="size-4 md:size-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold tracking-wider text-foreground/50 uppercase md:text-[10px]">Thánh bổn mạng</p>
                    <p className="text-xs font-semibold text-primary md:text-sm">{member.patronSaint}</p>
                  </div>
                </div>
              ) : null}

              {member.patronDate ? (
                <div className="flex items-center gap-2 rounded-[12px] border border-border/30 bg-white/50 p-2.5 md:gap-3 md:rounded-[16px] md:p-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/5 text-accent md:size-10 md:rounded-xl">
                    <BookOpen className="size-4 md:size-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold tracking-wider text-foreground/50 uppercase md:text-[10px]">Lễ bổn mạng</p>
                    <p className="text-xs font-semibold text-primary md:text-sm">{member.patronDate}</p>
                  </div>
                </div>
              ) : null}

              {member.hometown ? (
                <div className="flex items-center gap-2 rounded-[12px] border border-border/30 bg-white/50 p-2.5 sm:col-span-2 md:gap-3 md:rounded-[16px] md:p-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/5 text-accent md:size-10 md:rounded-xl">
                    <MapPin className="size-4 md:size-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold tracking-wider text-foreground/50 uppercase md:text-[10px]">
                      {isPriest ? "Quê quán" : "Giáo họ thuộc giáo xứ"}
                    </p>
                    <p className="text-xs font-semibold text-primary md:text-sm">{member.hometown}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
