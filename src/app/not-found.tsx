import { NotFoundPage } from "@/components/site/shared/components/page/not-found-page";
import { Preloader } from "@/components/site/shared/components/page/preloader";
import { SiteHeader } from "@/components/site/shared/components/page/site-header";

export default function NotFound() {
  return (
    <div data-theme="site" className="flex min-h-full flex-col px-0 md:px-4">
      <Preloader />
      <SiteHeader />
      <NotFoundPage />
    </div>
  );
}
