import { DonationTabs } from "@/components/site/contact/donation-tabs";
import { ContactSectionSubtitle } from "@/components/site/contact/contact-section-subtitle";
import {
  siteDonationInfo,
  siteDonationOptions,
} from "@/lib/contact/site-donations";

export function DonationSection() {
  return (
    <section className="bg-muted px-6 py-16 md:py-[120px]">
      <div className="mx-auto max-w-[1300px]">
        <div className="mx-auto mb-12 max-w-[820px] text-center md:mb-16">
          <ContactSectionSubtitle centered>
            {siteDonationInfo.subtitle}
          </ContactSectionSubtitle>
          <h2 className="font-display text-3xl font-semibold uppercase leading-none text-primary md:text-4xl lg:text-5xl">
            {siteDonationInfo.title}
          </h2>
          <p className="mt-5 font-sans text-base leading-relaxed text-foreground">
            {siteDonationInfo.description}
          </p>
        </div>

        <DonationTabs options={siteDonationOptions} defaultTabId="parish" />
      </div>
    </section>
  );
}
