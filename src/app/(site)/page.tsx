import { Button } from "@/components/site/shared/ui/button/button";

export default function HomePage() {
  return (
    <>
      <main className="flex w-full flex-col gap-12 py-16">
        <section className="rounded-sm bg-card p-10 md:p-16">
          <p className="mb-4 inline-block rounded-full bg-muted px-4 py-2 font-display text-sm font-medium uppercase text-primary">
            Design system base
          </p>
          <h1 className="mb-6 max-w-3xl text-5xl md:text-6xl">
            Church Religion Template
          </h1>
          <div className="flex flex-wrap gap-4">
            <Button variant="dark" href="#">Join Our Church</Button>
            <Button variant="primary" href="#">
              Learn More
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
