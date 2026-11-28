import React from 'react';
import { Button } from './ui';

interface BottomPromoProps {
  onBookConsultation: () => void;
  onOpenPortal: () => void;
  onOpenDemo: () => void;
}

export const BottomPromo: React.FC<BottomPromoProps> = ({
  onBookConsultation,
  onOpenPortal,
  onOpenDemo,
}) => {
  return (
    <section
      className="ambient-wash relative px-4 py-16 sm:px-6 sm:py-24"
      aria-label="Get VisaHOBe Support"
    >
      <div className="glass glass-sheen relative mx-auto max-w-5xl overflow-hidden rounded-[28px] px-5 py-12 text-center sm:rounded-[40px] sm:px-12 sm:py-16">
        {/* Decorative rings + glow */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full border border-[#1a73e8]/12" />
          <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full border border-[#1a73e8]/10" />
          <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full border border-emerald-500/12" />
          <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-[radial-gradient(closest-side,rgba(26,115,232,0.14),transparent)] blur-2xl" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/50 to-transparent" />
        </div>

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/80 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.13em] text-[#5f6368] shadow-2xs backdrop-blur-sm">
            <span className="material-icons text-[14px] leading-none text-[#1a73e8]">flight_takeoff</span>
            Start here
          </span>

          <h2 className="mx-auto mt-5 max-w-2xl text-[30px] font-bold leading-[1.12] tracking-tight text-[#202124] sm:text-4xl md:text-[46px]">
            Make your next visa application simpler
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#5f6368] sm:text-[17px]">
            Start your global travel, study, or work visa journey with transparent guidance, clear
            checklists, and zero false promises.
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-3.5">
            <Button
              variant="primary"
              size="lg"
              onClick={onBookConsultation}
              leadingIcon="calendar_month"
              className="shadow-[0_12px_26px_-12px_rgba(26,115,232,0.65)]"
            >
              Book a Consultation
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={onOpenPortal}
              leadingIcon="dashboard"
              className="border-[#747775]/30 bg-white/85 hover:bg-white"
            >
              Log into Client Portal
            </Button>
          </div>

          {/* Secondary action: open the interactive digital visa pass demo */}
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={onOpenDemo}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#1a73e8]/15 bg-white/70 px-3.5 py-1.5 text-[13px] font-medium text-[#0b57d0] transition-colors hover:border-[#1a73e8]/30 hover:bg-white hover:text-[#1557b0] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/70"
            >
              <span className="material-icons text-base leading-none">touch_app</span>
              <span>Preview a live digital visa pass demo</span>
            </button>
          </div>

          <p className="mx-auto mt-7 max-w-lg text-[11.5px] leading-relaxed text-[#70757a]">
            VisaHOBe is an independent visa-support service and is not an embassy or government
            authority. Final decisions are made solely by consular officials.
          </p>
        </div>
      </div>
    </section>
  );
};
