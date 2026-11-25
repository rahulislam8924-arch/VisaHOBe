import React, { useEffect, useRef, useState } from 'react';
import { JUMPLINKS } from '../data/walletData';

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

  const checkScrollButtons = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distance = 240;
    el.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  return (
    <div className="sticky top-[76px] sm:top-[84px] z-40 px-3 sm:px-4 pointer-events-none mb-6">
      <nav
        className="glue-jumplinks pointer-events-auto bg-white border border-black/5 shadow-[0_1px_3px_0_rgba(60,64,67,0.25),0_4px_8px_3px_rgba(60,64,67,0.12)] rounded-full px-2 py-1.5 max-w-5xl mx-auto flex items-center transition-all duration-300"
        role="navigation"
        aria-label="Jump to page section"
      >
        {/* Previous Arrow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors shrink-0 mr-1"
            aria-label="Scroll jump links left"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <use href="#chevron-left" />
            </svg>
          </button>
        )}

        {/* Scrollable Links List */}
        <ul
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-1 py-0.5 w-full"
        >
          {JUMPLINKS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectSection(item.id);
                  }}
                  className={`text-[13.5px] sm:text-[14px] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 block whitespace-nowrap select-none ${
                    isActive
                      ? 'bg-[#e8f0fe] text-[#1967d2] font-semibold shadow-xs'
                      : 'text-[#444746] hover:text-[#1f1f1f] hover:bg-neutral-100/70 font-medium'
                  }`}
                  aria-label={item.ariaLabel}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {item.name}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Next Arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors shrink-0 ml-1"
            aria-label="Scroll jump links right"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <use href="#chevron-right" />
            </svg>
          </button>
        )}
      </nav>
    </div>
  );
};
