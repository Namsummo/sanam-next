import { SiteFooter } from "@/components/site/shared/components/page/footer";
import { Preloader } from "@/components/site/shared/components/page/preloader";
import { SiteHeader } from "@/components/site/shared/components/page/site-header";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div data-theme="site" className="flex min-h-full flex-col px-0 md:px-4">
      <Preloader />
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
