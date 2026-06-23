"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animationClass?: string; // e.g. "fadeInUp" (defaults to fadeInUp)
  delay?: number; // delay in seconds (e.g. 0.2)
  duration?: number; // duration in seconds
  once?: boolean;
}

export function ScrollReveal({
  children,
  className,
  animationClass = "fadeInUp",
  delay = 0,
  duration,
  once = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [once]);

  return (
    <div
      ref={elementRef}
      className={cn(
        !isVisible && "opacity-0",
        isVisible && `animated ${animationClass}`,
        className
      )}
      style={{
        animationDelay: delay ? `${delay}s` : undefined,
        animationDuration: duration ? `${duration}s` : undefined,
        animationFillMode: "both",
      }}
    >
      {children}
    </div>
  );
}

interface TextAnimeProps {
  children: string;
  className?: string;
  once?: boolean;
  delay?: number;
}

export function TextAnime({ children, className, once = true, delay = 0 }: TextAnimeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [once]);

  const words = children.split(" ");
  let globalCharIndex = 0;

  return (
    <span
      ref={elementRef}
      className={cn("inline-block [perspective:400px]", className)}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em] last:mr-0">
          {word.split("").map((char, charIndex) => {
            const charDelay = delay + globalCharIndex * 0.02;
            globalCharIndex++;
            return (
              <span
                key={charIndex}
                className={cn(
                  "inline-block transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu",
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-[50px]"
                )}
                style={{
                  transitionDelay: `${charDelay}s`,
                }}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
