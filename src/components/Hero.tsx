import React from 'react';
import { LottiePlayer } from './LottiePlayer';

interface HeroProps {
  onBookConsultation: () => void;
  onOpenPortal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookConsultation, onOpenPortal }) => {
  return (
    <section
      className="relative pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-20 overflow-hidden bg-[#f2f0ec]"
      aria-label="VisaHOBe Introduction"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* VisaHOBe Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-neutral-300/80 shadow-2xs mb-5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-[#1f1f1f] tracking-wide">
            Your Trusted Partner for Global Visa Support
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold text-[#202124] leading-[1.12] tracking-tight max-w-4xl mx-auto">
          <span>Tap into m</span>
          <span className="material-icons hero-inline-title-icon align-middle">
            contactless
          </span>
          <span>re</span>
          <br />
          <span>with VisaHOBe</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl md:text-[22px] text-[#5f6368] font-normal leading-relaxed max-w-3xl mx-auto">
          Visa guidance and application support, made clearer. Keep everything – your approved
          e-Visas, consular fee receipts, embassy appointment passes, and verified document checklists
          – in one safe place, no matter where you travel.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onBookConsultation}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium text-[15px] transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer"
          >
            <span className="material-icons text-base">calendar_month</span>
            <span>Book a Consultation</span>
          </button>

          <button
            type="button"
            onClick={onOpenPortal}
            className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-transparent hover:bg-neutral-300/40 text-[#3c4043] border border-[#747775]/50 hover:border-[#3c4043] font-medium text-[15px] transition-all active:scale-[0.98] cursor-pointer"
          >
            Log into Client Portal
          </button>
        </div>

        {/* Legal Disclaimer Pill Notice */}
        <p className="mt-4 text-xs text-[#70757a] max-w-xl mx-auto leading-relaxed">
          Visa decisions are made solely by the relevant embassy, consulate, or immigration authority.
          Our services do not guarantee visa approval.
        </p>

        {/* Hero Lottie Graphic Container */}
        <div className="mt-10 sm:mt-14 w-full max-w-[850px] mx-auto relative flex justify-center">
          <LottiePlayer
            src="https://www.gstatic.com/marketing-cms/84/e0/4ea3d6ec422284df08def68fc0ef/gwallet-hero-en-us.json"
            className="w-full h-auto min-h-[360px] sm:min-h-[500px] md:min-h-[620px] max-w-[800px]"
            autoplay={true}
            loop={true}
            trigger="autoplay"
            alt="VisaHOBe Digital Visa & Consular Application Showcase"
            badgeIcon="verified_user"
          />
        </div>
      </div>
    </section>
  );
};
