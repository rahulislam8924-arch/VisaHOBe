import React from 'react';
import { ACCESS_SECTION_DATA } from '../data/walletData';

export const AccessSection: React.FC = () => {
  const { heading, cards } = ACCESS_SECTION_DATA;

  return (
    <section className="py-16 sm:py-24 bg-[#f2f0ec]" aria-label="Visa Portal Access Across Global Travel Platforms">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 items-stretch">
          {/* Card 1: Headline */}
          <div className="flex flex-col justify-center p-4 sm:p-6 lg:p-8">
            <h3 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#202124] leading-[1.2] tracking-tight">
              {heading}
            </h3>
          </div>

          {/* Card 2: Online */}
          <div className="bg-transparent flex flex-col justify-between group">
            <div className="overflow-hidden rounded-2xl bg-[#e3e1dc] mb-6 aspect-[16/9] shadow-xs">
              <img
                src={cards[0].image}
                alt={cards[0].imageAlt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-[#202124] mb-3">
                {cards[0].title}
              </h4>
              <p className="text-[15px] sm:text-base text-[#5f6368] leading-relaxed">
                {cards[0].description}
              </p>
            </div>
          </div>

          {/* Card 3: Across Google */}
          <div className="bg-transparent flex flex-col justify-between group">
            <div className="overflow-hidden rounded-2xl bg-[#e3e1dc] mb-6 aspect-[16/9] shadow-xs">
              <img
                src={cards[1].image}
                alt={cards[1].imageAlt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-[#202124] mb-3">
                {cards[1].title}
              </h4>
              <p className="text-[15px] sm:text-base text-[#5f6368] leading-relaxed">
                {cards[1].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
