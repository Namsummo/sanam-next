import { ClergyHomeSection } from "@/components/site/clergy/clergy-home-section";
import { EventsHomeSection } from "@/components/site/events/events-home-section";
import { MassHomeSection } from "@/components/site/mass/mass-home-section";
import { FeaturedNewsSection } from "@/components/site/news/featured-news-section";

export default function HomePage() {
  return (
    <main className="flex w-full flex-col">
      <ClergyHomeSection />
      <MassHomeSection />
      <EventsHomeSection />
      <FeaturedNewsSection />
    </main>
  );
}
