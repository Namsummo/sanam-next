import Image from "next/image";
import { Button } from "../../ui/button/button";

export function NotFoundPage() {
  return (
    <>
      <section className="px-6 py-10 md:py-[120px]">
        <div className="mx-auto max-w-[1300px] text-center">
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/404-error-img.png"
              alt="404 — page not found illustration"
              width={600}
              height={400}
              className="h-auto w-full max-w-[600px]"
              priority
            />
          </div>

          <h2 className="mb-4 font-display text-3xl font-semibold uppercase text-primary md:text-4xl">
            <span className="text-accent">Oops!</span> page not found
          </h2>

          <p className="mx-auto mb-8 max-w-md font-sans text-base leading-relaxed text-foreground">
            The page you are looking for does not exist.
          </p>

          <Button variant="primary" href="/">
            Back to Homepage
          </Button>
        </div>
      </section>
    </>
  );
}
