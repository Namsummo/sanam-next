import { DonationTabs } from "@/components/site/contact/donation-tabs";
import { ContactSectionSubtitle } from "@/components/site/contact/contact-section-subtitle";
import type { DonationOption } from "@/lib/contact/site-donations";

type DonationSectionProps = {
  subtitle: string;
  title: string;
  description: string;
  options: DonationOption[];
};

export function DonationSection({
  subtitle,
  title,
  description,
  options,
}: DonationSectionProps) {
  return (
    <section className="bg-muted px-6 py-16 md:py-[120px]">
      <div className="mx-auto max-w-[1300px]">
        <div className="mx-auto mb-12 max-w-[820px] text-center md:mb-16 wow fadeInUp" data-wow-delay="0.1s">
          <ContactSectionSubtitle centered>
            {subtitle}
          </ContactSectionSubtitle>
          <h2 className="font-display text-3xl font-semibold uppercase leading-none text-primary md:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-5 font-sans text-base leading-relaxed text-foreground">
            {description}
          </p>
        </div>

        <div className="wow fadeInUp" data-wow-delay="0.2s">
          <DonationTabs options={options} defaultTabId={options[0]?.id ?? "parish"} />
        </div>
      </div>
    </section>
  );
}
