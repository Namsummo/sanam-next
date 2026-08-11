"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import {
  getAboutUsSettings,
  DEFAULT_ABOUT_US_SETTINGS,
  type AboutUsSettingsData,
} from "@/shared/services/about-us-settings-api";
import { ScrollReveal, TextAnime } from "../shared/components/animation";
import { resolveApiUrl } from "@/lib/utils";

function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/,
  );
  if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
  return url;
}

export function AboutUs() {
  const [settings, setSettings] = useState<AboutUsSettingsData>(DEFAULT_ABOUT_US_SETTINGS);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    getAboutUsSettings()
      .then((data) => setSettings(data))
      .catch(() => { });
  }, []);

  const openVideo = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
  };

  return (
    <>
      <div className="about-us">
        <div className="container mx-auto max-w-[1300px] px-4">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full xl:w-1/2 px-4">
              <ScrollReveal>
                <div className="about-us-image-box">
                  {settings.visibility?.video && (
                    <button
                      type="button"
                      onClick={openVideo}
                      className="group block w-full overflow-hidden rounded-[20px] bg-card text-left shadow-[0_15px_45px_rgba(0,0,0,0.1)]"
                      aria-label={`Phát video ${settings.videoTitle}`}
                    >
                      <figure className="relative aspect-video w-full overflow-hidden">
                        <Image
                          src={resolveApiUrl(settings.videoThumbnailUploadUrl || settings.videoThumbnailUrl)}
                          alt={settings.videoTitle}
                          fill
                          sizes="(max-width: 1280px) 100vw, 634px"
                          priority
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <span
                          className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35"
                          aria-hidden
                        />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex size-16 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform duration-300 group-hover:scale-110 md:size-20">
                            <Play className="ml-1 size-7 fill-current md:size-9" />
                          </span>
                        </span>
                      </figure>
                      <span className="block px-5 py-4 text-center font-display text-xl font-semibold text-primary md:text-2xl">
                        {settings.videoTitle}
                      </span>
                    </button>
                  )}
                </div>
              </ScrollReveal>
            </div>

            <div className="w-full xl:w-1/2 px-4">
              <div className="about-us-content xl:pl-10">
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

                {settings.visibility?.missionItems && (
                  <ScrollReveal delay={0.4}>
                    <div className="about-us-item-list">
                      {settings.missionItems.map((item, index) => (
                        <div key={index} className="about-us-item">
                          <div className="icon-box shrink-0">
                            <Image
                              src={resolveApiUrl(item.iconUploadUrl || item.iconUrl)}
                              alt={`${item.title} Icon`}
                              width={24}
                              height={24}
                              className="w-6 h-6"
                            />
                          </div>
                          <div className="about-us-item-content">
                            <h3 className="font-display font-semibold text-lg text-primary">
                              {item.title}
                            </h3>
                            <p className="font-sans text-sm text-foreground leading-relaxed mt-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollReveal>
                )}

                {(settings.visibility?.button || settings.visibility?.author || settings.visibility?.author2) && (
                  <ScrollReveal delay={0.6}>
                    <div className="about-us-footer">
                      {settings.visibility?.button && (
                        <div className="about-us-btn">
                          <Link href={settings.buttonLink} className="btn-default">
                            {settings.buttonText}
                          </Link>
                        </div>
                      )}

                      {settings.visibility?.author && (
                        <div className="about-author-box">
                          <div className="about-author-image overflow-hidden rounded-full w-[50px] h-[50px] relative">
                            <figure className="image-anime w-full h-full">
                              <Image
                                src={resolveApiUrl(settings.authorImageUploadUrl || settings.authorImageUrl)}
                                alt={`Author ${settings.authorName}`}
                                fill
                                sizes="50px"
                                className="object-cover"
                              />
                            </figure>
                          </div>
                          <div className="about-author-content">
                            <h3 className="font-display font-semibold text-lg text-primary leading-none">
                              {settings.authorName}
                            </h3>
                            <p className="font-sans text-sm text-foreground/80 mt-1 leading-none">
                              {settings.authorTitle}
                            </p>
                          </div>
                        </div>
                      )}

                      {settings.visibility?.author2 && (
                        <div className="about-author-box">
                          <div className="about-author-image overflow-hidden rounded-full w-[50px] h-[50px] relative">
                            <figure className="image-anime w-full h-full">
                              <Image
                                src={resolveApiUrl(settings.author2ImageUploadUrl || settings.author2ImageUrl)}
                                alt={`Author 2 ${settings.author2Name}`}
                                fill
                                sizes="50px"
                                className="object-cover"
                              />
                            </figure>
                          </div>
                          <div className="about-author-content">
                            <h3 className="font-display font-semibold text-lg text-primary leading-none">
                              {settings.author2Name}
                            </h3>
                            <p className="font-sans text-sm text-foreground/80 mt-1 leading-none">
                              {settings.author2Title}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      {isVideoOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
          onClick={closeVideo}
        >
          <div
            className="relative w-full max-w-[800px] aspect-video bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              className="absolute top-3 right-3 text-white hover:text-accent z-50 bg-black/40 hover:bg-black/80 rounded-full p-2 transition-colors"
              aria-label="Close video"
            >
              <X className="size-6" />
            </button>
            <iframe
              src={getYouTubeEmbedUrl(settings.videoUrl)}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  );
}
