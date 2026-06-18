import type { Metadata } from "next";
import { ContactForm } from "@/components/site/contact/contact-form";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";
import { ContactInfoList } from "@/components/site/contact/contact-info-list";
import { ContactMapSection } from "@/components/site/contact/contact-map-section";
import { ContactSectionSubtitle } from "@/components/site/contact/contact-section-subtitle";
import { DonationSection } from "@/components/site/contact/donation-section";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { getPublicContactSettings } from "@/shared/services/contact-api";
import type { DonationOption } from "@/lib/contact/site-donations";
import type { ContactInfoItem } from "@/lib/contact/site-contact";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Thông tin liên hệ, quyên góp và gửi lời nhắn tới Giáo xứ Sa Nam",
};

async function getData() {
  try {
    return await getPublicContactSettings();
  } catch {
    const { siteContactInfo, siteContactItems } = await import(
      "@/lib/contact/site-contact"
    );
    const { siteDonationInfo, siteDonationOptions } = await import(
      "@/lib/contact/site-donations"
    );
    return {
      subtitle: siteContactInfo.subtitle,
      title: siteContactInfo.title,
      description: siteContactInfo.description,
      formTitle: siteContactInfo.formTitle,
      mapSubtitle: siteContactInfo.mapSubtitle,
      mapTitle: siteContactInfo.mapTitle,
      mapDescription: siteContactInfo.mapDescription,
      mapEmbedUrl: siteContactInfo.mapEmbedUrl,
      contactItems: siteContactItems as ContactInfoItem[],
      donationSubtitle: siteDonationInfo.subtitle,
      donationTitle: siteDonationInfo.title,
      donationDescription: siteDonationInfo.description,
      donationOptions: siteDonationOptions as DonationOption[],
    };
  }
}

export default async function ContactPage() {
  const data = await getData();
  const bgSettings = await getBackgroundSettings().catch(() => null);

  return (
    <>
      <PageHeader
        title="Liên hệ"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Liên hệ" },
        ]}
        backgroundImage={bgSettings?.contactBg}
      />

      <section className="px-6 py-16 md:pb-[60px] md:pt-[120px]">
        <div className="mx-auto max-w-[1300px]">
          <div className="grid grid-cols-1 items-center gap-10 xl:grid-cols-2 xl:gap-[30px]">
            <div className="max-xl:mb-[30px] wow fadeInLeft" data-wow-delay="0.1s">
              <ContactSectionSubtitle>{data.subtitle}</ContactSectionSubtitle>
              <h2 className="font-display text-3xl font-semibold uppercase leading-none text-primary md:text-4xl lg:text-5xl">
                {data.title}
              </h2>
              <p className="mt-5 font-sans text-base leading-relaxed text-foreground">
                {data.description}
              </p>

              <ContactInfoList items={data.contactItems} />
            </div>

            <div className="wow fadeInRight" data-wow-delay="0.2s">
              <ContactForm title={data.formTitle} />
            </div>
          </div>
        </div>
      </section>

      <DonationSection
        subtitle={data.donationSubtitle}
        title={data.donationTitle}
        description={data.donationDescription}
        options={data.donationOptions as unknown as DonationOption[]}
      />

      <ContactMapSection
        subtitle={data.mapSubtitle}
        title={data.mapTitle}
        description={data.mapDescription}
        mapEmbedUrl={data.mapEmbedUrl}
      />
    </>
  );
}
