"use client";

import Image from "next/image";
import { useState } from "react";
import {
  DEFAULT_NEWS_COVER,
  DEFAULT_NEWS_COVER_ALT,
} from "@/lib/news/cover-image-constants";
import { cn } from "@/lib/utils";

type NewsCoverImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
};

export function NewsCoverImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
}: NewsCoverImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt || DEFAULT_NEWS_COVER_ALT}
      width={width}
      height={height}
      priority={priority}
      className={cn(className)}
      onError={() => {
        if (imgSrc !== DEFAULT_NEWS_COVER) {
          setImgSrc(DEFAULT_NEWS_COVER);
        }
      }}
    />
  );
}
