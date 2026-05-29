import { ContactSectionSubtitle } from "@/components/site/contact/contact-section-subtitle";
import { cn } from "@/lib/utils";

type ContactMapSectionProps = {
  subtitle: string;
  title: string;
  description: string;
  mapEmbedUrl: string;
  className?: string;
};

export function ContactMapSection({
  subtitle,
  title,
  description,
  mapEmbedUrl,
  className,
}: ContactMapSectionProps) {
  return (
    <section
      className={cn(
        "px-6 py-[60px] md:pb-[120px] max-md:py-[30px] max-md:pb-[60px]",
        className,
      )}
    >
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-10 text-center md:mb-12">
          <ContactSectionSubtitle centered>{subtitle}</ContactSectionSubtitle>
          <h2 className="font-display text-3xl font-semibold uppercase leading-none text-primary md:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-[720px] font-sans text-base leading-relaxed text-foreground">
            {description}
          </p>
        </div>

        <div className="h-[350px] overflow-hidden rounded-[20px] sm:h-[450px] lg:h-[600px]">
          <iframe
            title="Bản đồ Giáo xứ Sa Nam"
            src={mapEmbedUrl}
            className="size-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
