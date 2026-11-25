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
    <section className="py-20 sm:py-28 text-center bg-[#f2f0ec] border-t border-black/5" aria-label="Get VisaHOBe Support">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#202124] leading-tight tracking-tight">
          <span>Tap into m</span>
          <span className="material-icons footer-inline-title-icon align-middle">
            contactless
          </span>
          <span>re</span>
          <br />
          <span>with VisaHOBe</span>
        </h2>

        <p className="mt-4 text-base sm:text-lg text-[#5f6368] max-w-xl mx-auto">
          Start your global travel, study, or work visa journey with transparent guidance, clear
          checklists, and zero false promises.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={onBookConsultation}
            leadingIcon="calendar_month"
            className="shadow-md hover:shadow-lg"
          >
            Book a Consultation
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={onOpenPortal}
            leadingIcon="dashboard"
            className="border-[#747775]/40 bg-white/70 backdrop-blur-xs hover:bg-white"
          >
            Log into Client Portal
          </Button>
        </div>

        {/* Secondary action: open the interactive digital visa pass demo */}
        <div className="mt-5">
          <button
            type="button"
            onClick={onOpenDemo}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-[#0b57d0] transition-colors hover:bg-[#e8f0fe] hover:text-[#1557b0] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/70"
          >
            <span className="material-icons text-base leading-none">touch_app</span>
            <span className="underline decoration-[#0b57d0]/30 underline-offset-4">
              Preview a live digital visa pass demo
            </span>
          </button>
        </div>

        <div className="mt-6 text-xs text-[#70757a] max-w-lg mx-auto">
          VisaHOBe is an independent visa-support service and is not an embassy or government
          authority. Final decisions are made solely by consular officials.
        </div>
      </div>
    </section>
  );
};
