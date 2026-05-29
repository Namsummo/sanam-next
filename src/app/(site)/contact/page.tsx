import type { Metadata } from "next";
import { ContactForm } from "@/components/site/contact/contact-form";
import { ContactInfoList } from "@/components/site/contact/contact-info-list";
import { ContactMapSection } from "@/components/site/contact/contact-map-section";
import { ContactSectionSubtitle } from "@/components/site/contact/contact-section-subtitle";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import {
  siteContactInfo,
  siteContactItems,
} from "@/lib/contact/site-contact";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Thông tin liên hệ và gửi lời nhắn tới Giáo xứ Sa Nam",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Liên hệ"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Liên hệ" },
        ]}
      />

      <section className="px-6 py-16 md:pb-[60px] md:pt-[120px]">
        <div className="mx-auto max-w-[1300px]">
          <div className="grid grid-cols-1 items-center gap-10 xl:grid-cols-2 xl:gap-[30px]">
            <div className="max-xl:mb-[30px]">
              <ContactSectionSubtitle>{siteContactInfo.subtitle}</ContactSectionSubtitle>
              <h2 className="font-display text-3xl font-semibold uppercase leading-none text-primary md:text-4xl lg:text-5xl">
                {siteContactInfo.title}
              </h2>
              <p className="mt-5 font-sans text-base leading-relaxed text-foreground">
                {siteContactInfo.description}
              </p>

              <ContactInfoList items={siteContactItems} />
            </div>

            <ContactForm title={siteContactInfo.formTitle} />
          </div>
        </div>
      </section>

      <ContactMapSection
        subtitle={siteContactInfo.mapSubtitle}
        title={siteContactInfo.mapTitle}
        description={siteContactInfo.mapDescription}
        mapEmbedUrl={siteContactInfo.mapEmbedUrl}
      />
    </>
  );
}
