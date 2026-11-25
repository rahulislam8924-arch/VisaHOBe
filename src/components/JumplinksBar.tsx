import React, { useCallback, useEffect, useRef, useState } from 'react';
import { JUMPLINKS } from '../data/walletData';
import { cn } from './ui';

interface JumplinksBarProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
}

export const JumplinksBar: React.FC<JumplinksBarProps> = ({
  activeSection,
  onSelectSection,
}) => {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [checkScrollButtons]);

  // Keep the active link visible while scrolling through the page
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const activeLink = el.querySelector<HTMLElement>(`[data-jumplink="${activeSection}"]`);
    if (!activeLink) return;
    const linkLeft = activeLink.offsetLeft;
    const linkRight = linkLeft + activeLink.offsetWidth;
    if (linkLeft < el.scrollLeft) {
      el.scrollTo({ left: linkLeft - 12, behavior: 'smooth' });
    } else if (linkRight > el.scrollLeft + el.clientWidth) {
      el.scrollTo({ left: linkRight - el.clientWidth + 12, behavior: 'smooth' });
    }
  }, [activeSection]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === 'left' ? -240 : 240, behavior: 'smooth' });
  };

  const arrowClass =
    'hidden h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#5f6368] transition-colors hover:bg-black/[0.06] hover:text-[#202124] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/60 sm:flex cursor-pointer';

  return (
    <div className="pointer-events-none sticky top-[76px] z-40 mb-6 px-3 sm:top-[84px] sm:px-4">
      <nav
        className="pointer-events-auto mx-auto flex max-w-5xl items-center gap-1 rounded-full border border-black/[0.06] bg-white/95 px-2 py-1.5 shadow-[0_2px_10px_rgba(60,64,67,0.16)] backdrop-blur-md"
        role="navigation"
        aria-label="Jump to page section"
      >
        {/* Previous */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className={cn(arrowClass, 'mr-0.5')}
            aria-label="Scroll section links left"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <use href="#chevron-left" />
            </svg>
          </button>
        )}

        {/* Scrollable links */}
        <div className="relative min-w-0 flex-1">
          {/* Edge fades hint at more links */}
          {canScrollLeft && (
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-white to-transparent" />
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-white to-transparent" />
          )}

          <ul
            ref={scrollContainerRef}
            onScroll={checkScrollButtons}
            className="no-scrollbar flex w-full items-center gap-1 overflow-x-auto scroll-smooth px-1 py-0.5"
          >
            {JUMPLINKS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id} className="shrink-0">
                  <a
                    href={`#${item.id}`}
                    data-jumplink={item.id}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectSection(item.id);
                    }}
                    aria-label={item.ariaLabel}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'block whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] leading-none transition-all duration-200 select-none sm:text-[13.5px]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/60',
                      isActive
                        ? 'bg-[#e8f0fe] font-semibold text-[#0b57d0] shadow-[inset_0_0_0_1px_#c2e7ff]'
                        : 'font-medium text-[#444746] hover:bg-black/[0.05] hover:text-[#202124]'
                    )}
                  >
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Next */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className={cn(arrowClass, 'ml-0.5')}
            aria-label="Scroll section links right"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <use href="#chevron-right" />
            </svg>
          </button>
        )}
      </nav>
    </div>
  );
};
