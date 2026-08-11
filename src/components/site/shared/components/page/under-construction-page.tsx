"use client";

import React from "react";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { ScrollReveal, TextAnime } from "../animation";

type UnderConstructionPageProps = {
  contactItems?: Array<{
    id: string;
    title: string;
    value: string;
    href?: string;
  }>;
}

export function UnderConstructionPage({
  contactItems = [],
}: UnderConstructionPageProps) {
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("sanam_admin_token");
      if (token) {
        document.cookie = `sanam_admin_token=${encodeURIComponent(token)}; path=/; SameSite=Lax; max-age=604800`;
        window.location.reload();
      }
    }
  }, []);

  const phoneItem = contactItems.find((i) => i.id === "phone");
  const emailItem = contactItems.find((i) => i.id === "email");

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-background px-6 py-12 selection:bg-accent selection:text-white">
      {/* Decorative Sacred Background Elements */}
      <div className="absolute -top-40 -left-40 size-[600px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 size-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Main Content Area */}
      <div className="my-auto flex w-full max-w-[800px] flex-col items-center text-center">
        {/* Logo Section */}
        <ScrollReveal animationClass="fadeInDown" delay={0.1}>
          <div className="relative mb-10 flex justify-center">
            <div className="relative z-10 transition-transform duration-500 hover:scale-105">
              <Image
                src="/images/logo.svg"
                alt="Giáo xứ Sa Nam"
                width={200}
                height={66}
                priority
                className="h-auto w-[180px] sm:w-[220px]"
              />
            </div>
            {/* Subtle glow behind logo */}
            <div className="absolute inset-0 -z-10 bg-accent/10 blur-xl scale-125 rounded-full" />
          </div>
        </ScrollReveal>

        {/* Title */}
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-primary sm:text-4xl md:text-5xl lg:text-6xl">
            <TextAnime className="text-accent">Trang web</TextAnime>
            <br className="sm:hidden" />
            <span className="sm:ml-3">
              <TextAnime delay={0.25}>đang được xây dựng</TextAnime>
            </span>
          </h1>
        </div>

        {/* Description / Subtitle */}
        <ScrollReveal animationClass="fadeInUp" delay={0.4}>
          <p className="mx-auto mb-10 max-w-2xl font-sans text-base leading-relaxed text-foreground/80 md:text-lg">
            Chúng tôi đang nâng cấp và hoàn thiện trải nghiệm trực tuyến để phục
            vụ Cộng đoàn Giáo xứ Sa Nam tốt hơn. Xin vui lòng quay lại sau.
          </p>
        </ScrollReveal>

        {/* Quick Contacts */}
        <ScrollReveal animationClass="fadeInUp" delay={0.8} className="mt-12 w-full">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-foreground/80 md:gap-10">
            {phoneItem ? (
              <a
                href={phoneItem.href}
                className="flex items-center gap-2 transition-colors duration-300 hover:text-accent font-sans"
              >
                <Phone className="size-4 text-accent" />
                <span>{phoneItem.value}</span>
              </a>
            ) : (
              <a
                href="tel:0969888888"
                className="flex items-center gap-2 transition-colors duration-300 hover:text-accent font-sans"
              >
                <Phone className="size-4 text-accent" />
                <span>(+84) 969 888 888</span>
              </a>
            )}

            {emailItem ? (
              <a
                href={emailItem.href}
                className="flex items-center gap-2 transition-colors duration-300 hover:text-accent font-sans"
              >
                <Mail className="size-4 text-accent" />
                <span>{emailItem.value}</span>
              </a>
            ) : (
              <a
                href="mailto:giaoxusanam@gmail.com"
                className="flex items-center gap-2 transition-colors duration-300 hover:text-accent font-sans"
              >
                <Mail className="size-4 text-accent" />
                <span>giaoxusanam@gmail.com</span>
              </a>
            )}


          </div>
        </ScrollReveal>
      </div>

      {/* Footer Copyright */}
      <ScrollReveal animationClass="fadeIn" delay={1.0} className="w-full text-center mt-8">
        <p className="font-sans text-xs text-foreground/60">
          Copyright &copy; {new Date().getFullYear()} Giáo xứ Sa Nam. All Rights
          Reserved.
        </p>
      </ScrollReveal>
    </div>
  );
}
