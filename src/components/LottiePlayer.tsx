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
}

export const LottiePlayer: React.FC<LottiePlayerProps> = ({
  src,
  className = '',
  autoplay = true,
  loop = true,
  trigger = 'enter-viewport',
  alt = 'VisaHOBe Portal Feature Animation',
  badgeIcon,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const container = containerRef.current;
    if (!container) return;

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
          observer.disconnect();
          anim.destroy();
          isMounted = false;
        };
      }

      return () => {
        anim.destroy();
        isMounted = false;
      };
    } catch {
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

      {/* Fallback Phone Graphic if Network Blocked */}
      {hasError && (
        <div className="w-full max-w-[420px] aspect-[4/5] bg-white rounded-[36px] shadow-xl border-4 border-neutral-800 p-4 flex flex-col justify-between items-center text-center">
          <div className="w-24 h-4 bg-neutral-800 rounded-full mb-6" />
          <div className="w-20 h-20 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
            <span className="material-icons text-4xl">{badgeIcon || 'wallet'}</span>
          </div>
          <div className="space-y-2 px-4">
            <p className="font-medium text-neutral-800 text-sm">VisaHOBe Portal</p>
            <p className="text-xs text-neutral-500">{alt}</p>
          </div>
          <div className="w-full h-12 bg-neutral-100 rounded-xl" />
        </div>
      )}
    </div>
  );
};
