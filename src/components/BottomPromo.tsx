import React from 'react';

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

        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onBookConsultation}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium text-[15px] transition-all shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
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

        {/* Secondary action: open the interactive digital visa pass demo */}
        <div className="mt-5">
          <button
            type="button"
            onClick={onOpenDemo}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1a73e8] hover:text-[#1557b0] hover:underline underline-offset-4 cursor-pointer"
          >
            <span className="material-icons text-base">touch_app</span>
            <span>Preview a live digital visa pass demo</span>
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
