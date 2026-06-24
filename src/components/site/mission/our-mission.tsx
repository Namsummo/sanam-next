"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ScrollReveal, TextAnime } from "../shared/components/animation";
import {
  getOurMissionSettings,
  DEFAULT_OUR_MISSION_SETTINGS,
  type OurMissionSettingsData,
} from "@/shared/services/our-mission-settings-api";
import { resolveApiUrl } from "@/lib/utils";

export function OurMission() {
  const [settings, setSettings] = useState<OurMissionSettingsData>(DEFAULT_OUR_MISSION_SETTINGS);

  useEffect(() => {
    getOurMissionSettings()
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);
  return (
    <div className="our-mission">
      <div className="container mx-auto max-w-[1300px] px-4">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full xl:w-1/2 px-4">
            {/* Our Mission Content Start */}
            <div className="our-mission-content">
              {/* Section Title Start */}
              <div className="section-title">
                {settings.visibility?.subtitle && (
                  <ScrollReveal>
                    <span className="section-sub-title">{settings.subtitle}</span>
                  </ScrollReveal>
                )}
                {settings.visibility?.title && (
                  <h2 className="font-display font-semibold text-3xl md:text-4xl text-primary leading-tight">
                    <TextAnime>{settings.title}</TextAnime>
                  </h2>
                )}
                {settings.visibility?.description && (
                  <ScrollReveal delay={0.2}>
                    <p className="font-sans text-base text-foreground mt-4 leading-relaxed">
                      {settings.description}
                    </p>
                  </ScrollReveal>
                )}
              </div>
              {/* Section Title End */}

              {/* Mission Item List Start */}
              {settings.visibility?.missionItems && (
                <ScrollReveal delay={0.4}>
                  <div className="mission-item-list">
                    {settings.missionItems.map((item, index) => (
                      <div key={index} className="mission-item">
                        <h3 className="font-display font-semibold text-lg text-primary">{item.title}</h3>
                        <p className="font-sans text-sm text-foreground leading-relaxed mt-2.5">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              )}
              {/* Mission Item List End */}

              {/* Our Mission Footer Start */}
              {(settings.visibility?.button || settings.visibility?.contactInfo) && (
                <ScrollReveal delay={0.6}>
                  <div className="our-mission-footer">
                    {/* Mission Button Start */}
                    {settings.visibility?.button && (
                      <div className="mission-btn">
                        <Link href={settings.buttonLink} className="btn-default">
                          {settings.buttonText}
                        </Link>
                      </div>
                    )}
                    {/* Mission Button End */}

                    {/* Mission Contact Info Start */}
                    {settings.visibility?.contactInfo && (
                      <div className="mission-contact-info">
                        <div className="icon-box shrink-0">
                          <Image
                            src="/images/icon-phone-white.svg"
                            alt="Phone Icon"
                            width={24}
                            height={24}
                            className="w-6 h-6"
                          />
                        </div>
                        <div className="mission-contact-info-content">
                          <h3 className="font-display font-semibold text-lg text-primary leading-none">
                            {settings.contactLabel}
                          </h3>
                          <p className="font-sans text-sm text-foreground mt-1 leading-none">
                            <a href={`tel:${settings.contactPhone.replace(/[^0-9+]/g, '')}`} className="hover:text-accent transition-colors font-semibold">
                              {settings.contactPhone}
                            </a>
                          </p>
                        </div>
                      </div>
                    )}
                    {/* Mission Contact Info End */}
                  </div>
                </ScrollReveal>
              )}
              {/* Our Mission Footer End */}
            </div>
            {/* Our Mission Content End */}
          </div>

          <div className="w-full xl:w-1/2 px-4">
            {/* Our Mission Image Box Start */}
            <ScrollReveal>
              <div className="our-mission-image-box">
                {/* Mission Image Start */}
                {settings.visibility?.image1 && (
                  <div className="mission-image img-1">
                    <figure className="image-anime relative w-full aspect-[1/1.8] min-h-[400px]">
                      <Image
                        src={resolveApiUrl(settings.image1UploadUrl || settings.image1Url)}
                        alt="Our Mission 1"
                        fill
                        sizes="(max-width: 1280px) 100vw, 340px"
                        className="object-cover rounded-[20px]"
                      />
                    </figure>
                  </div>
                )}
                {/* Mission Image End */}

                {/* Mission Image Start */}
                {settings.visibility?.image2 && (
                  <div className="mission-image img-2">
                    <figure className="relative w-full aspect-[1/1.9609] min-h-[400px]">
                      <Image
                        src={resolveApiUrl(settings.image2UploadUrl || settings.image2Url)}
                        alt="Our Mission 2"
                        fill
                        sizes="(max-width: 1280px) 100vw, 314px"
                        className="object-cover rounded-[20px]"
                      />
                    </figure>
                  </div>
                )}
                {/* Mission Image End */}
              </div>
            </ScrollReveal>
            {/* Our Mission Image Box End */}
          </div>
        </div>
      </div>
    </div>
  );
}

