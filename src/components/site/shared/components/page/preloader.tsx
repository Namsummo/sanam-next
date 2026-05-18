"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const FADE_MS = 600;
const MIN_VISIBLE_MS = 400;

export function Preloader() {
  const [phase, setPhase] = useState<"visible" | "hiding" | "hidden">("visible");

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    let unmountTimer: ReturnType<typeof setTimeout>;
    const startedAt = Date.now();

    const hide = () => {
      const elapsed = Date.now() - startedAt;
      const delay = Math.max(0, MIN_VISIBLE_MS - elapsed);

      hideTimer = setTimeout(() => {
        setPhase("hiding");
        unmountTimer = setTimeout(() => setPhase("hidden"), FADE_MS);
      }, delay);
    };

    if (document.readyState === "complete") {
      hide();
    } else {
      window.addEventListener("load", hide, { once: true });
    }

    return () => {
      window.removeEventListener("load", hide);
      clearTimeout(hideTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (phase === "hidden") {
    return null;
  }

  const isHiding = phase === "hiding";

  return (
    <div
      className={`fixed inset-0 z-1000 flex items-center justify-center bg-primary transition-[opacity,visibility] duration-600 ease-in-out motion-reduce:duration-200 ${isHiding ? "pointer-events-none opacity-0 invisible" : ""
        }`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="relative size-[100px] rounded-full">
        <span
          className="absolute inset-0 rounded-full border border-transparent border-r-white border-l-white animate-preloader-spin motion-reduce:animate-none origin-center"
          aria-hidden
        />
        <Image
          src="/images/loader.svg"
          alt=""
          width={66}
          height={66}
          priority
          className="absolute top-1/2 left-1/2 max-w-[66px] w-[66px] h-auto -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
}
