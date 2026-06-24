import { SiteFooter } from "@/components/site/shared/components/page/footer";
import { Preloader } from "@/components/site/shared/components/page/preloader";
import { SiteHeader } from "@/components/site/shared/components/page/site-header";
import { UnderConstructionPage } from "@/components/site/shared/components/page/under-construction-page";
import { getPublicContactSettings } from "@/shared/services/contact-api";
import { getPublicFooterSettings } from "@/shared/services/footer-settings-api";
import { cookies } from "next/headers";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isUnderConstruction = process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION === "true";
  const cookieStore = await cookies();
  const isAdminLoggedIn = cookieStore.has("sanam_admin_token");

  if (isUnderConstruction && !isAdminLoggedIn) {
    let contactItems: any[] = [];
    let socialLinks: any[] = [];
    try {
      const contactData = await getPublicContactSettings();
      contactItems = contactData.contactItems || [];
    } catch {
      // fallback handled inside component
    }
    try {
      const footerData = await getPublicFooterSettings();
      socialLinks = footerData.socialLinks || [];
    } catch {
      // fallback handled inside component
    }

    return (
      <div data-theme="site" className="flex min-h-full flex-col px-0 md:px-4">
        <UnderConstructionPage contactItems={contactItems} socialLinks={socialLinks} />
      </div>
    );
  }

  return (
    <div data-theme="site" className="flex min-h-full flex-col px-0 md:px-4">
      <Preloader />
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
