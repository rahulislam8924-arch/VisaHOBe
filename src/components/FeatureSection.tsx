import React from 'react';
import { FeatureSectionData } from '../types';
import { LottiePlayer } from './LottiePlayer';
import { FeatureVisual } from './FeatureVisual';

interface FeatureSectionProps {
  section: FeatureSectionData;
  index: number;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({ section, index }) => {
  const sectionNumber = String(index + 1).padStart(2, '0');
  const isImageLeft = section.imagePosition === 'left';

  return (
    <section
      id={section.id}
      className={`ambient-wash relative scroll-mt-[140px] py-14 transition-opacity duration-700 sm:py-20 md:py-24 ${
        index % 2 === 1 ? 'bg-[#f6f4f0]' : 'bg-[#f2f0ec]'
      }`}
      data-modulewell=""
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center ${
            isImageLeft ? '' : 'lg:flex-row-reverse'
          }`}
        >
          {/* Lottie Visual Column */}
          <div
            className={`w-full flex justify-center items-center ${
              isImageLeft
                ? 'lg:col-span-6 lg:order-1'
                : 'lg:col-span-6 lg:order-2'
            }`}
          >
            <div className="relative w-full max-w-[460px] sm:max-w-[500px] lg:max-w-[520px]">
              {/* Soft stage behind the animation */}
              <div
                aria-hidden="true"
                className="absolute inset-4 rounded-[42px] bg-[radial-gradient(closest-side,rgba(26,115,232,0.14),transparent)] blur-xl"
              />
              <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(155deg,#ffffff_0%,#f6faff_55%,#f1f8f5_100%)] p-1.5 shadow-[0_20px_50px_-34px_rgba(60,64,67,0.5)] ring-1 ring-black/[0.03] sm:rounded-[36px] sm:p-2">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(#c8c4bc_0.8px,transparent_0.8px)] [background-size:16px_16px] opacity-35 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75px)]"
                />
                <LottiePlayer
                  src={section.lottieUrl}
                  className="relative w-full aspect-square rounded-[26px] sm:rounded-[30px]"
                  trigger="enter-viewport"
                  loop={true}
                  alt={section.altText}
                  badgeIcon={section.inlineIcon}
                  fallback={
                    <FeatureVisual variant={section.id} accent={section.iconColor || '#1a73e8'} />
                  }
                />
              </div>
            </div>
          </div>

          {/* Text & Content Column */}
          <div
            className={`flex flex-col justify-center text-left ${
              isImageLeft
                ? 'lg:col-span-6 lg:order-2 lg:pl-6'
                : 'lg:col-span-6 lg:order-1 lg:pr-6'
            }`}
          >
            {/* Category subtitle */}
            <p className="mb-3 inline-flex items-center gap-2 self-start rounded-full border border-black/[0.06] bg-white/80 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.11em] text-[#5f6368] shadow-2xs">
              <span className="tabular-nums text-[#9aa0a6]">{sectionNumber}</span>
              <span className="h-2.5 w-px bg-black/10" />
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: section.iconColor || '#1a73e8' }}
              />
              <span>{section.category}</span>
            </p>

            {/* Title with Inline Material Icon */}
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#202124] leading-[1.18] tracking-tight mb-5">
              <span>{section.titlePrefix}</span>
              <span
                className="material-icons promo-inline-title-icon align-middle transition-transform duration-300 hover:scale-110"
                style={{ color: section.iconColor || '#1a73e8' }}
              >
                {section.inlineIcon}
              </span>
              <span>{section.titleSuffix}</span>
            </h2>

            {/* Description Paragraph */}
            <p className="text-base sm:text-lg text-[#5f6368] font-normal leading-[1.65] mb-6 max-w-xl">
              {section.description}
            </p>

            {/* Optional CTA Link */}
            {section.ctaText && section.ctaUrl && (
              <div className="mb-4">
                <a
                  href={section.ctaUrl}
                  target={section.isExternalCta ? '_blank' : '_self'}
                  rel={section.isExternalCta ? 'noopener noreferrer' : undefined}
                  className="group inline-flex items-center gap-2 rounded-full border border-[#1a73e8]/20 bg-white px-4 py-2 text-[13.5px] font-semibold text-[#0b57d0] shadow-2xs transition-all hover:-translate-y-0.5 hover:border-[#1a73e8]/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/60"
                >
                  <span>{section.ctaText}</span>
                  <span className="material-icons text-[16px] leading-none transition-transform group-hover:translate-x-0.5">
                    arrow_forward
                  </span>
                </a>
              </div>
            )}

            {/* Optional Footnote */}
            {section.footnote && (
              <p className="text-xs sm:text-[13px] text-[#70757a] font-normal leading-relaxed mt-2 max-w-lg">
                {section.footnote}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
