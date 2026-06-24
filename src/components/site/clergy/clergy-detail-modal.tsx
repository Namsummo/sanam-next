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
      className="fixed inset-0 z-200 flex items-center justify-center overflow-y-auto p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-[#010101]/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-[800px] overflow-hidden rounded-[32px] border border-border bg-[#f5f3ec] shadow-[0_35px_70px_rgba(0,0,0,0.25)] transition-all duration-300 md:flex">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 flex size-10 cursor-pointer items-center justify-center rounded-full bg-[#010101]/10 text-primary transition-all duration-300 hover:bg-accent hover:text-white"
          aria-label="Đóng"
        >
          <X className="size-5" />
        </button>

        <div className="relative flex w-full shrink-0 flex-col items-center justify-center border-b border-border/40 bg-[#eae7de]/70 p-8 text-center md:w-[320px] md:border-r md:border-b-0">
          <figure className="relative mb-4 aspect-4/5 w-[180px] overflow-hidden rounded-[24px] border-4 border-white shadow-md transition-transform duration-500 hover:scale-[1.02]">
            <Image
              src={imageSrc}
              alt={`Chân dung ${member.fullName}`}
              width={180}
              height={225}
              unoptimized={!!member.image}
              className="size-full object-cover object-top"
              priority
            />
          </figure>

          <span className="mb-2 inline-block rounded-full bg-accent/10 px-3.5 py-1 text-[11px] font-bold tracking-wider text-accent uppercase">
            {isPriest ? "Linh mục" : "Ban Hành Giáo"}
          </span>

          <p className="mt-1 font-sans text-sm font-semibold text-foreground/80">
            {member.position}
          </p>
          <h3 className="font-display text-lg font-bold leading-tight text-primary">
            {member.fullName}
          </h3>
        </div>

        <div className="flex flex-1 flex-col justify-center p-6 sm:p-10">
          <div className="space-y-6">
            <div>
              <span className="font-bold text-xs tracking-widest text-accent/80 uppercase">
                Thông tin ban hành giáo
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold text-primary">
                Chi tiết ban hành giáo
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {member.birthday ? (
                <div className="flex items-center gap-3 rounded-[16px] border border-border/30 bg-white/50 p-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/5 text-accent">
                    <Calendar className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-foreground/50 uppercase">Ngày sinh</p>
                    <p className="text-sm font-semibold text-primary">{formatIsoDateToVi(member.birthday)}</p>
                  </div>
                </div>
              ) : null}

              {isPriest && member.ordinationDate ? (
                <div className="flex items-center gap-3 rounded-[16px] border border-border/30 bg-white/50 p-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/5 text-accent">
                    <Award className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-foreground/50 uppercase">Thụ phong Linh mục</p>
                    <p className="text-sm font-semibold text-primary">{formatIsoDateToVi(member.ordinationDate)}</p>
                  </div>
                </div>
              ) : null}

              {member.patronSaint ? (
                <div className="flex items-center gap-3 rounded-[16px] border border-border/30 bg-white/50 p-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/5 text-accent">
                    <Heart className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-foreground/50 uppercase">Thánh bổn mạng</p>
                    <p className="text-sm font-semibold text-primary">{member.patronSaint}</p>
                  </div>
                </div>
              ) : null}

              {member.patronDate ? (
                <div className="flex items-center gap-3 rounded-[16px] border border-border/30 bg-white/50 p-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/5 text-accent">
                    <BookOpen className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-foreground/50 uppercase">Lễ bổn mạng</p>
                    <p className="text-sm font-semibold text-primary">{member.patronDate}</p>
                  </div>
                </div>
              ) : null}

              {member.hometown ? (
                <div className="flex items-center gap-3 rounded-[16px] border border-border/30 bg-white/50 p-3 sm:col-span-2">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/5 text-accent">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-foreground/50 uppercase">
                      {isPriest ? "Quê quán" : "Giáo họ thuộc giáo xứ"}
                    </p>
                    <p className="text-sm font-semibold text-primary">{member.hometown}</p>
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
