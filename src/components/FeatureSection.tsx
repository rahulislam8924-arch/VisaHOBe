import React from 'react';
import { FeatureSectionData } from '../types';
import { LottiePlayer } from './LottiePlayer';

interface FeatureSectionProps {
  section: FeatureSectionData;
  index: number;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({ section }) => {
  const isImageLeft = section.imagePosition === 'left';

  return (
    <section
      id={section.id}
      className="py-14 sm:py-20 md:py-24 scroll-mt-[140px] transition-opacity duration-700 bg-[#f2f0ec]"
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
            <div className="w-full max-w-[460px] sm:max-w-[500px] lg:max-w-[520px] relative">
              <LottiePlayer
                src={section.lottieUrl}
                className="w-full aspect-square"
                trigger="enter-viewport"
                loop={true}
                alt={section.altText}
                badgeIcon={section.inlineIcon}
              />
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
            {/* Category Subtitle */}
            <p className="text-[13px] sm:text-[14px] font-medium tracking-[0.08em] text-[#5f6368] uppercase mb-2">
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
                  className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[#1a73e8] hover:text-[#1557b0] transition-colors group cursor-pointer"
                >
                  <span className="group-hover:underline underline-offset-4">{section.ctaText}</span>
                  <svg className="w-4 h-4 fill-current group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24">
                    <use href="#arrow-forward" />
                  </svg>
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
