import React, { useState } from 'react';
import { ACCESS_SECTION_DATA } from '../data/walletData';

/* Photo card that degrades into a branded gradient tile if the image cannot load */
const AccessCard: React.FC<{
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: string;
}> = ({ title, description, image, imageAlt, icon }) => {
  const [failed, setFailed] = useState(false);

  return (
    <article className="group flex flex-col">
      <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl border border-black/[0.05] bg-[#e9e6df] shadow-[0_14px_36px_-26px_rgba(60,64,67,0.6)]">
        {failed ? (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(150deg,#e8f0fe_0%,#f7fbff_55%,#eefaf4_100%)]">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 text-[#1a73e8] shadow-sm">
              <span className="material-icons text-3xl leading-none">{icon}</span>
            </span>
          </div>
        ) : (
          <img
            src={image}
            alt={imageAlt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/40"
        />
      </div>

      <h4 className="mb-2 text-xl font-bold leading-snug tracking-tight text-[#202124] sm:text-2xl">
        {title}
      </h4>
      <p className="text-[14.5px] leading-relaxed text-[#5f6368] sm:text-[15.5px]">{description}</p>
    </article>
  );
};

export const AccessSection: React.FC = () => {
  const { heading, cards } = ACCESS_SECTION_DATA;
  const icons = ['phone_iphone', 'public'];

  return (
    <section className="bg-[#f2f0ec] py-16 sm:py-24" aria-label="Visa Portal Access Across Global Travel Platforms">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {/* Headline column */}
          <div className="flex flex-col justify-center lg:sticky lg:top-32 lg:py-8">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.13em] text-[#5f6368]">
              <span className="material-icons text-[14px] leading-none text-[#1a73e8]">devices</span>
              Everywhere you travel
            </span>
            <h3 className="text-[28px] font-bold leading-[1.16] tracking-tight text-[#202124] sm:text-4xl lg:text-[38px]">
              {heading}
            </h3>
          </div>

          {cards.map((card, index) => (
            <AccessCard
              key={card.title}
              title={card.title}
              description={card.description}
              image={card.image}
              imageAlt={card.imageAlt}
              icon={icons[index] ?? 'description'}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
