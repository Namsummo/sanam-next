import { AboutUs } from "@/components/site/about/about-us";
import { ClergyHomeSection } from "@/components/site/clergy/clergy-home-section";
import { MassHomeSection } from "@/components/site/mass/mass-home-section";
import { FeaturedNewsSection } from "@/components/site/news/featured-news-section";
import { EventsHomeSection } from "@/components/site/events/events-home-section";
import { OurMission } from "@/components/site/mission/our-mission";
import { Hero } from "@/components/site/shared/components/page/hero";

export default function HomePage() {
  return (
    <main className="flex w-full flex-col">
      <Hero />
      <AboutUs />
      <ClergyHomeSection />
      <OurMission />
      <EventsHomeSection />
      <MassHomeSection />
      <FeaturedNewsSection />
    </main>
  );
}
