import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  Link2,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Share2,
} from "lucide-react";
import {
  siteFooterQuickLinks,
  siteFooterServiceLinks,
} from "@/lib/site-navigation";
import { cn } from "@/lib/utils";

const serviceTimes = [
  "Sunday Worship: 9:00 AM - 11:00 AM",
  "Bible Study: Wednesday - 7:00 PM",
] as const;

const socialLinks = [
  { label: "Dribbble", href: "#", icon: Share2 },
  { label: "Facebook", href: "#", icon: Globe },
  { label: "Instagram", href: "#", icon: MessageCircle },
  { label: "LinkedIn", href: "#", icon: Link2 },
] as const;

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

export function SiteFooter() {
  return (
    <footer className={footerShell}>
      <div className={container}>
        <div className="mb-[60px] flex flex-wrap items-center justify-between gap-5 border-b border-white/10 pb-[60px] max-lg:mb-[30px] max-lg:pb-[30px]">
          <h2 className="max-w-[750px] font-display text-3xl font-semibold uppercase leading-[1.2] text-white md:text-4xl lg:text-[42px]">
            Receive Spiritual Encouragement in Your Inbox Today!
          </h2>

          <div className="w-full max-w-[415px] max-lg:max-w-full">
            <h3 className="mb-5 font-display text-xl font-semibold uppercase text-white max-lg:mb-[15px] max-md:text-lg">
              Newsletter Subscription
            </h3>
            <form action="#" method="post">
              <div className="flex rounded-full bg-white/10 p-[5px] backdrop-blur-[30px]">
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  name="mail"
                  placeholder="Enter Your E-mail"
                  required
                  className="min-w-0 flex-1 bg-transparent px-6 py-1.5 text-base text-white outline-none placeholder:text-foreground"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors duration-400 hover:bg-white hover:text-primary max-lg:size-10"
                >
                  <Send className="size-[22px] max-lg:size-[18px]" aria-hidden />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-[30px] xl:grid-cols-12">
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
            <ul className="mt-[50px] space-y-5 max-lg:mt-5 max-lg:space-y-3">
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
            </ul>
          </div>

          <div className="flex flex-wrap gap-[30px] max-md:justify-between xl:col-span-9 xl:ml-[4.167vw] xl:gap-[4.167vw]">
            <FooterLinkColumn
              title="Quick Links"
              links={siteFooterQuickLinks}
              className="xl:w-[calc(25%-2.778vw)]"
            />
            <FooterLinkColumn
              title="Our Services"
              links={siteFooterServiceLinks}
              className="xl:w-[calc(35%-2.778vw)]"
            />
            <div className="w-full xl:w-[calc(40%-2.778vw)]">
              <h2 className={linkColumnTitle}>Service Times</h2>
              <ul>
                {serviceTimes.map((time) => (
                  <li key={time} className={linkItem}>
                    {time}
                  </li>
                ))}
              </ul>
              <div className="mt-[30px] border-t border-white/10 pt-[30px] max-lg:mt-5 max-lg:pt-5">
                <ul className="flex flex-wrap gap-[15px]">
                  {socialLinks.map(({ label, href, icon: Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        aria-label={label}
                        className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white transition-colors duration-400 hover:bg-accent"
                      >
                        <Icon className="size-[18px]" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[60px] border-t border-white/10 py-10 text-center max-lg:mt-[30px] max-lg:py-[30px]">
        <div className={container}>
          <p className="text-base text-white">Copyright © 2026 All Rights Reserved.</p>
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
  links: readonly { label: string; href: string }[];
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
        {links.map(({ label, href }) => (
          <li key={label} className={linkItem}>
            <Link href={href} className={linkAnchor}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
