import React, { useEffect, useRef, useState } from 'react';
import lottie, { type AnimationItem } from 'lottie-web/build/player/lottie_light';

interface LottiePlayerProps {
  src: string;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  trigger?: 'enter-viewport' | 'autoplay';
  alt?: string;
  badgeIcon?: string;
  /** Custom visual shown when the animation cannot be fetched */
  fallback?: React.ReactNode;
}

export const LottiePlayer: React.FC<LottiePlayerProps> = ({
  src,
  className = '',
  autoplay = true,
  loop = true,
  trigger = 'enter-viewport',
  alt = 'VisaHOBe Portal Feature Animation',
  badgeIcon,
  fallback,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const container = containerRef.current;
    if (!container) return;

    // Never leave an empty frame behind: fall back if the JSON does not arrive
    const fallbackTimer = setTimeout(() => {
      if (isMounted && !loadedRef.current) setHasError(true);
    }, 4500);

    try {
      const anim = lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop,
        autoplay: trigger === 'autoplay' || autoplay,
        path: src,
        rendererSettings: {
          progressiveLoad: true,
          preserveAspectRatio: 'xMidYMid meet',
        },
      });

      animRef.current = anim;

      anim.addEventListener('DOMLoaded', () => {
        loadedRef.current = true;
        if (isMounted) {
          setIsLoaded(true);
        }
      });

      anim.addEventListener('data_failed', () => {
        if (isMounted) {
          setHasError(true);
        }
      });

      anim.addEventListener('error', () => {
        if (isMounted) {
          setHasError(true);
        }
      });

      // Viewport trigger
      if (trigger === 'enter-viewport') {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                anim.play();
              } else {
                anim.pause();
              }
            });
          },
          { threshold: 0.15 }
        );

        observer.observe(container);

        return () => {
          clearTimeout(fallbackTimer);
          observer.disconnect();
          anim.destroy();
          isMounted = false;
        };
      }

      return () => {
        clearTimeout(fallbackTimer);
        anim.destroy();
        isMounted = false;
      };
    } catch {
      clearTimeout(fallbackTimer);
      setHasError(true);
    }
  }, [src, loop, trigger, autoplay]);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-none">
          <div className="w-10 h-10 rounded-full border-3 border-blue-500/20 border-t-blue-600 animate-spin" />
        </div>
      )}

      {/* Actual Lottie Container */}
      <div
        ref={containerRef}
        className={`w-full h-full transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label={alt}
      />

      {/* Branded fallback when the animation cannot be fetched */}
      {hasError && fallback}

      {hasError && !fallback && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-[#1a73e8] shadow-[0_10px_28px_-14px_rgba(60,64,67,0.6)] ring-1 ring-black/[0.04]">
            <span className="material-icons text-[30px] leading-none">
              {badgeIcon || 'wallet'}
            </span>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm ring-2 ring-white">
              <span className="material-icons text-[13px] leading-none">check</span>
            </span>
          </span>

          <div className="space-y-1">
            <p className="text-[13px] font-semibold tracking-tight text-[#202124]">
              VisaHOBe portal preview
            </p>
            <p className="mx-auto max-w-[24rem] text-[11px] leading-relaxed text-[#70757a]">
              {alt}
            </p>
          </div>

          {/* Skeleton bars hint at the interface behind the animation */}
          <div className="mt-1 w-full max-w-[15rem] space-y-1.5" aria-hidden="true">
            <div className="h-1.5 w-full rounded-full bg-[#1a73e8]/15" />
            <div className="h-1.5 w-4/5 rounded-full bg-[#202124]/10" />
            <div className="h-1.5 w-2/3 rounded-full bg-[#202124]/8" />
          </div>
        </div>
      )}
    </div>
  );
};
