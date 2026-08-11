import Image from "next/image";
import Link from "next/link";
import type { SVGProps } from "react";
import {
  Globe,
  Link2,
  Mail,
  Phone,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getPublicContactSettings,
  type ContactInfoItemData,
} from "@/shared/services/contact-api";
import {
  getPublicFooterSettings,
  type FooterSettingsPayload,
} from "@/shared/services/footer-settings-api";

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-8h2.75l.41-3.2H13.5V7.76c0-.93.26-1.56 1.59-1.56h1.7V3.34c-.29-.04-1.3-.13-2.47-.13-2.45 0-4.12 1.49-4.12 4.24V9.8H7.43V13h2.77v8h3.3Z" />
    </svg>
  );
}

function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.5 3.9-6.5 3.9Z" />
    </svg>
  );
}
function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.32 5.56a5.12 5.12 0 0 1-3-.96 5.16 5.16 0 0 1-1.44-3.58h-3.11v13.83a2.9 2.9 0 1 1-2-2.75V8.93a6.05 6.05 0 1 0 5.11 5.92V7.83a8.18 8.18 0 0 0 4.44 1.3V5.56Z" />
    </svg>
  );
}

const getSocialIcon = (network: string) => {
  const normalized = network.toLowerCase();
  if (normalized.includes("facebook") || normalized.includes("fanpage")) {
    return FacebookIcon;
  }
  if (normalized.includes("youtube") || normalized.includes("youtobe")) {
    return YoutubeIcon;
  }
  if (normalized.includes("tiktok") || normalized.includes("tik tok")) {
    return TikTokIcon;
  }
  if (normalized.includes("globe")) return Globe;
  return Link2;
};

const footerShell = cn(
  "mb-[15px] w-full rounded-[20px] bg-primary bg-[url('/images/dark-section-bg-image.png')] bg-cover bg-top bg-no-repeat pt-[120px]",
  "max-lg:mb-0 max-lg:rounded-none max-lg:pt-[60px]",
);

const container = "mx-auto w-full max-w-[1300px] px-[15px]";

const linkColumnTitle =
  "mb-[25px] font-display text-xl font-semibold uppercase text-white max-md:mb-[15px] max-md:text-lg";

const linkItem =
  "mb-[15px] text-base leading-normal text-white last:mb-0 max-lg:mb-2.5";

const linkAnchor =
  "transition-colors duration-400 hover:text-accent";

export async function SiteFooter() {
  let contactItems: ContactInfoItemData[] = [];
  try {
    const data = await getPublicContactSettings();
    contactItems = data.contactItems || [];
  } catch {
    // fallback
  }

  let footerSettings: FooterSettingsPayload = {
    newsletterTitle: "Receive Spiritual Encouragement in Your Inbox Today!",
    newsletterSubtitle: "Newsletter Subscription",
    copyrightText: "Copyright © 2026 All Rights Reserved.",
    newsletterPlaceholder: "Enter Your E-mail",
    quickLinksTitle: "Quick Links",
    ourServicesTitle: "Our Services",
    serviceTimesTitle: "Service Times",
    serviceTimes: [
      "Sunday Worship: 9:00 AM - 11:00 AM",
      "Bible Study: Wednesday - 7:00 PM",
    ],
    socialLinks: [
      { network: "Dribbble", url: "#" },
      { network: "Facebook", url: "#" },
      { network: "Youtube", url: "#" },
      { network: "Tiktok", url: "#" },
    ],
    quickLinks: [],
    ourServices: [],
  };

  try {
    const data = await getPublicFooterSettings();
    if (data && data.newsletterTitle) {
      footerSettings = data;
    }
  } catch {
    // fallback
  }

  const phoneItem = contactItems.find((i) => i.id === "phone");
  const emailItem = contactItems.find((i) => i.id === "email");
  const facebookLink = footerSettings.socialLinks.find(({ network, url }) => {
    const normalized = network.toLowerCase();
    return (
      (normalized.includes("facebook") || normalized.includes("fanpage")) &&
      Boolean(url && url !== "#")
    );
  });

  return (
    <footer className={footerShell}>
      <div className={container}>
        <div className="mb-[60px] flex flex-wrap items-center justify-between gap-5 border-b border-white/10 pb-[60px] max-lg:mb-[30px] max-lg:pb-[30px]">
          <h2 className="max-w-[750px] font-display text-3xl font-semibold uppercase leading-[1.2] text-white md:text-4xl lg:text-[42px]">
            {footerSettings.newsletterTitle}
          </h2>

          <div className="w-full max-w-[415px] max-lg:max-w-full">
            <h3 className="mb-5 font-display text-xl font-semibold uppercase text-white max-lg:mb-[15px] max-md:text-lg">
              {footerSettings.newsletterSubtitle}
            </h3>
            <form action="#" method="post">
              <div className="flex rounded-full bg-white/10 p-1.25 backdrop-blur-[30px]">
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  name="mail"
                  placeholder={footerSettings.newsletterPlaceholder || "Enter Your E-mail"}
                  required
                  className="min-w-0 flex-1 bg-transparent px-6 py-1.5 text-base text-white outline-none placeholder:text-white/60"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="flex size-12.5 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors duration-400 hover:bg-white hover:text-primary max-lg:size-10"
                >
                  <Send className="size-5.5 max-lg:size-4.5" aria-hidden />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-7.5 xl:grid-cols-12">
          <div className="xl:col-span-3">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.svg"
                alt="sanam"
                width={151}
                height={40}
                className="h-auto w-full max-w-[151px]"
              />
            </Link>
            <ul className="mt-12.5 space-y-5 max-lg:mt-5 max-lg:space-y-3">
              {facebookLink && (
                <li>
                  <a
                    href={facebookLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center gap-2.5 text-base text-white",
                      linkAnchor,
                    )}
                  >
                    <FacebookIcon
                      className="size-6 shrink-0 text-accent"
                      aria-hidden
                    />
                    Fanpage Giáo xứ
                  </a>
                </li>
              )}

              {phoneItem && (
                <li>
                  <a
                    href={phoneItem.href}
                    className={cn(
                      "flex items-center gap-2.5 text-base text-white",
                      linkAnchor,
                    )}
                  >
                    <Phone className="size-6 shrink-0 text-accent" aria-hidden />
                    {phoneItem.value}
                  </a>
                </li>
              )}
              {emailItem && (
                <li>
                  <a
                    href={emailItem.href}
                    className={cn(
                      "flex items-center gap-2.5 text-base text-white",
                      linkAnchor,
                    )}
                  >
                    <Mail className="size-6 shrink-0 text-accent" aria-hidden />
                    {emailItem.value}
                  </a>
                </li>
              )}

              {!phoneItem && !emailItem && (
                <>
                  <li>
                    <a
                      href="tel:123456789"
                      className={cn(
                        "flex items-center gap-2.5 text-base text-white",
                        linkAnchor,
                      )}
                    >
                      <Phone className="size-6 shrink-0 text-accent" aria-hidden />
                      (+01) 123 456 789
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:info@domainname.com"
                      className={cn(
                        "flex items-center gap-2.5 text-base text-white",
                        linkAnchor,
                      )}
                    >
                      <Mail className="size-6 shrink-0 text-accent" aria-hidden />
                      info@domainname.com
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="flex flex-wrap gap-7.5 max-md:justify-between xl:col-span-9 xl:ml-[4.167vw] xl:gap-[4.167vw]">
            <FooterLinkColumn
              title={footerSettings.quickLinksTitle || "Quick Links"}
              links={footerSettings.quickLinks || []}
              className="xl:w-[calc(25%-2.778vw)]"
            />
            <FooterLinkColumn
              title={footerSettings.ourServicesTitle || "Our Services"}
              links={footerSettings.ourServices || []}
              className="xl:w-[calc(35%-2.778vw)]"
            />
            <div className="w-full xl:w-[calc(40%-2.778vw)]">
              <h2 className={linkColumnTitle}>{footerSettings.serviceTimesTitle || "Service Times"}</h2>
              <ul>
                {footerSettings.serviceTimes.map((time) => (
                  <li key={time} className={linkItem}>
                    {time}
                  </li>
                ))}
              </ul>
              <div className="mt-7.5 border-t border-white/10 pt-7.5 max-lg:mt-5 max-lg:pt-5">
                <ul className="flex flex-wrap gap-4">
                  {footerSettings.socialLinks.map(({ network, url }) => {
                    const Icon = getSocialIcon(network);
                    return (
                      <li key={network}>
                        <a
                          href={url}
                          aria-label={network}
                          className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white transition-colors duration-400 hover:bg-accent"
                        >
                          <Icon className="size-4.5" aria-hidden />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[60px] border-t border-white/10 py-10 text-center max-lg:mt-[30px] max-lg:py-[30px]">
        <div className={container}>
          <p className="text-base text-white">{footerSettings.copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkColumn({
  title,
  links,
  className,
}: {
  title: string;
  links: readonly { label: string; url?: string; href?: string }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full max-md:w-auto",
        "xl:border-r xl:border-white/10 xl:pr-[2.083vw]",
        className,
      )}
    >
      <h2 className={linkColumnTitle}>{title}</h2>
      <ul>
        {links.map((link, idx) => {
          const target = link.url || link.href || "#";
          return (
            <li key={idx} className={linkItem}>
              <Link href={target} className={linkAnchor}>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
