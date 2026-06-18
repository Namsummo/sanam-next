"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getHeroSettings, DEFAULT_HERO_SETTINGS, type HeroSettingsData } from "@/shared/services/hero-settings-api";
import { ScrollReveal, TextAnime } from "../animation";

export function Hero() {
  const [settings, setSettings] = useState<HeroSettingsData>(DEFAULT_HERO_SETTINGS);
  const [counts, setCounts] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    getHeroSettings()
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const targets = settings.counters.map((c) => c.value);
    const duration = 2000;
    const steps = 50;
    const intervalTime = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const newCounts = targets.map((v) => Math.min(Math.floor(v * progress), v));
      setCounts(newCounts);
      if (currentStep >= steps) {
        clearInterval(interval);
        setCounts(targets);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [settings.counters]);

  return (
    <div className="hero dark-section">
      <div className="hero-bg-video">
        <video autoPlay muted playsInline loop preload="metadata">
          <source src={settings.backgroundVideoUrl} type="video/mp4" />
        </video>
      </div>

      <div className="container mx-auto max-w-[1300px] px-4">
        <div className="flex flex-wrap items-end -mx-4">
          <div className="w-full xl:w-1/2 px-4">
            <div className="hero-content">
              <div className="section-title">
                {settings.visibility?.subtitle && (
                  <ScrollReveal>
                    <span className="section-sub-title">{settings.subtitle}</span>
                  </ScrollReveal>
                )}
                {settings.visibility?.title && (
                  <h1 className="font-display font-semibold uppercase leading-none text-white">
                    <TextAnime>{settings.title}</TextAnime>
                  </h1>
                )}
              </div>

              {(settings.visibility?.primaryButton || settings.visibility?.secondaryButton) && (
                <ScrollReveal delay={0.2}>
                  <div className="hero-content-btn">
                    {settings.visibility?.primaryButton && (
                      <Link href={settings.primaryButton.link} className="btn-default btn-highlighted">
                        {settings.primaryButton.text}
                      </Link>
                    )}
                    {settings.visibility?.secondaryButton && (
                      <Link href={settings.secondaryButton.link} className="btn-default btn-border">
                        {settings.secondaryButton.text}
                      </Link>
                    )}
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>

          <div className="w-full xl:w-1/2 px-4">
            <div className="hero-body">
              {settings.visibility?.description && (
                <ScrollReveal>
                  <div className="hero-body-content">
                    <p className="font-sans text-base font-semibold leading-relaxed text-white">
                      {settings.description}
                    </p>
                  </div>
                </ScrollReveal>
              )}

              {settings.visibility?.counters && (
                <ScrollReveal delay={0.2}>
                  <div className="hero-counter-list">
                  {settings.counters.map((counter, index) => (
                    <div key={index} className="hero-counter-item">
                      <h2 className="font-display text-[40px] font-semibold uppercase leading-none text-white">
                        <span>{counts[index]}</span>+
                      </h2>
                      <p className="font-sans text-sm text-white mt-1">
                        {counter.label}
                      </p>
                    </div>
                  ))}
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

