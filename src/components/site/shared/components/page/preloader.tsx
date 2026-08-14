"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const FADE_MS = 600;
const MIN_VISIBLE_MS = 400;
const PRELOADER_DONE_KEY = "sanam-preloader-done";

function hasSeenPreloader(): boolean {
  try {
    return sessionStorage.getItem(PRELOADER_DONE_KEY) === "1";
  } catch {
    return false;
  }
}

function markPreloaderDone() {
  try {
    sessionStorage.setItem(PRELOADER_DONE_KEY, "1");
  } catch {
    // Safari private mode can block sessionStorage
  }
}

export function Preloader() {
  const [phase, setPhase] = useState<"visible" | "hiding" | "hidden">("visible");

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let unmountTimer: ReturnType<typeof setTimeout> | undefined;
    let started = false;
    const startedAt = Date.now();

    const hide = (immediate = false) => {
      if (started && !immediate) return;
      started = true;

      if (immediate || hasSeenPreloader()) {
        markPreloaderDone();
        setPhase("hidden");
        return;
      }

      const delay = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt));
      hideTimer = setTimeout(() => {
        setPhase("hiding");
        unmountTimer = setTimeout(() => {
          markPreloaderDone();
          setPhase("hidden");
        }, FADE_MS);
      }, delay);
    };

    const onReady = () => {
      if (document.readyState === "complete") hide();
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted || hasSeenPreloader()) {
        hide(true);
        return;
      }
      if (document.readyState === "complete") hide();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible" && hasSeenPreloader()) {
        hide(true);
      }
    };

    if (hasSeenPreloader()) {
      hide(true);
    } else if (document.readyState === "complete") {
      hide();
    } else {
      window.addEventListener("load", onReady, { once: true });
      document.addEventListener("readystatechange", onReady);
    }

    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibility);
    const fallbackTimer = setTimeout(() => hide(), 2500);

    return () => {
      window.removeEventListener("load", onReady);
      document.removeEventListener("readystatechange", onReady);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(hideTimer);
      clearTimeout(unmountTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  if (phase === "hidden") {
    return null;
  }

  const isHiding = phase === "hiding";

  return (
    <div
      data-preloader=""
      className={`fixed inset-0 z-1000 flex items-center justify-center bg-primary transition-[opacity,visibility] duration-600 ease-in-out motion-reduce:duration-200 [html[data-preloader-done]_&]:hidden ${
        isHiding ? "pointer-events-none opacity-0 invisible" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="relative size-24 rounded-full">
        <span
          className="absolute inset-0 rounded-full border border-transparent border-r-white border-l-white animate-preloader-spin motion-reduce:animate-none origin-center"
          aria-hidden
        />
        <Image
          src="/images/sanam-cropped.png"
          alt="loader"
          width={66}
          height={66}
          priority
          className="absolute top-1/2 left-1/2 h-auto max-w-15px w-15px -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
}
