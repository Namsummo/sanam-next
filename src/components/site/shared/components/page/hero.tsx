import { Button } from "@/components/site/shared/ui/button/button";
import { cn } from "@/lib/utils";

const HERO_VIDEO_SRC =
  "https://demo.awaikenthemes.com/assets/videos/emanu-hero-video.mp4";

const counters = [
  { value: "120", suffix: "+", label: "Community Events" },
  { value: "50", suffix: "+", label: "Volunteers Serving" },
  { value: "15", suffix: "+", label: "Years of Ministry" },
] as const;

/** Media floor: shrink viewport crops edges; grow viewport scales with cover */
const heroMediaClass = cn(
  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover",
  "min-h-full min-w-full",
  "h-[max(100%,870px)] w-[max(100%,1920px)]",
);

const heroOverlayClass = cn(
  "pointer-events-none absolute inset-0 z-[1]",
  "bg-[linear-gradient(0deg,transparent_82.81%,rgba(1,1,1,0.8)_100%),linear-gradient(180deg,transparent_56.84%,rgba(1,1,1,0.8)_88.43%)]",
);

export function Hero() {
  return (
    <section
      className={cn(
        "dark-section relative z-0 w-full overflow-hidden rounded-[20px]",
        "flex min-h-[870px] h-screen flex-col justify-end",
        "px-0 pb-20 pt-0 max-lg:rounded-none max-lg:pb-[60px]",
      )}
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <video
          className={heroMediaClass}
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
      </div>

      <div className={heroOverlayClass} aria-hidden />

      <div className="relative z-1 w-full px-20">
        <div className="grid grid-cols-1 items-end gap-10 xl:grid-cols-2">
          <div>
            <div className="section-title">
              <span
                className={cn(
                  "relative mb-[15px] inline-block rounded-full py-2 pl-8 pr-4",
                  "font-sans text-sm font-medium uppercase leading-none text-white",
                  "bg-white/10 backdrop-blur-xs",
                  "before:absolute before:left-4 before:top-1/2 before:size-1.5",
                  "before:-translate-y-1/2 before:rounded-full before:bg-accent before:content-['']",
                )}
              >
                Growing Together in Christ
              </span>
              <h1 className="font-display text-4xl font-semibold uppercase leading-none text-white md:text-5xl lg:text-6xl xl:text-7xl">
                Join Our Community of Faith Today
              </h1>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-[30px] gap-y-5">
              <Button variant="primary" href="#">
                Join Our Church
              </Button>
              <Button variant="transparent" href="#">
                Get Started
              </Button>
            </div>
          </div>

          <div className="xl:ml-[50px]">
            <p className="m-0 font-sans text-base font-semibold leading-relaxed text-white">
              We are committed to sharing God&apos;s love through relationships,
              and opportunities to serve others. Whether you are new to faith or
              seeking a deeper connection, you will find guidance, encouragement.
            </p>

            <div className="mt-10 flex flex-wrap gap-x-[60px] gap-y-[30px] border-t border-white/10 pt-10 max-lg:mt-[30px] max-lg:pt-[30px]">
              {counters.map(({ value, suffix, label }, index) => (
                <div
                  key={label}
                  className={cn(
                    "relative w-full text-center sm:w-[calc(33.33%-40px)]",
                    index < counters.length - 1 &&
                    "sm:before:absolute sm:before:right-[30px] sm:before:top-0 sm:before:h-full sm:before:w-px sm:before:bg-white/10 sm:before:content-['']",
                  )}
                >
                  <h2 className="font-display text-[40px] font-semibold uppercase leading-none text-white max-lg:text-[34px]">
                    {value}
                    {suffix}
                  </h2>
                  <p className="mt-1 font-sans text-base text-white">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
