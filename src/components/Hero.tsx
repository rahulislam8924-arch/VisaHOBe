import React from 'react';
import { LottiePlayer } from './LottiePlayer';
import { ALL_COUNTRIES } from '../data/allCountriesData';
import { Button } from './ui';
import { HeroVisual } from './FeatureVisual';

interface HeroProps {
  onBookConsultation: () => void;
  onOpenPortal: () => void;
}

const TRUST_ITEMS = [
  { icon: 'public', text: `${ALL_COUNTRIES.length} countries` },
  { icon: 'receipt_long', text: 'Itemised embassy fees' },
  { icon: 'verified_user', text: 'No false promises' },
];

export const Hero: React.FC<HeroProps> = ({ onBookConsultation, onOpenPortal }) => {
  return (
    <section
      className="relative isolate overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20"
      aria-label="VisaHOBe Introduction"
    >
      {/* Ambient colour field — gives the glass surfaces something to refract */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-64 left-1/2 h-[680px] w-[min(1150px,135vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(26,115,232,0.16),transparent)] blur-3xl" />
        <div className="absolute -right-48 top-0 h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.14),transparent)] blur-3xl" />
        <div className="absolute -left-48 bottom-0 h-[480px] w-[480px] rounded-full bg-[radial-gradient(closest-side,rgba(16,185,129,0.10),transparent)] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(#cdc9c1_1px,transparent_1px)] [background-size:22px_22px] opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
      </div>

      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-14 lg:px-8">
        {/* Copy */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="glass-thin inline-flex items-center gap-2 rounded-full px-3 py-1.5 sm:gap-2.5 sm:px-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-[#3c4043] sm:text-[11px]">
              VisaHOBe · Dhaka
            </span>
            <span className="hidden h-3 w-px bg-black/10 sm:block" />
            <span className="hidden text-[11px] font-medium text-[#5f6368] sm:block">
              Independent consular advisory
            </span>
          </div>

          <h1 className="mt-5 text-[34px] font-bold leading-[1.08] tracking-[-0.025em] text-[#202124] sm:mt-6 sm:text-[46px] lg:text-[54px] xl:text-[60px]">
            <span>Tap into m</span>
            <span className="material-icons hero-inline-title-icon" aria-hidden="true">
              contactless
            </span>
            <span>re</span>
            <br />
            <span className="bg-gradient-to-r from-[#1a73e8] via-[#1967d2] to-[#0d47a1] bg-clip-text text-transparent">
              with VisaHOBe
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-[15px] leading-[1.7] text-[#5f6368] sm:mt-5 sm:text-[16.5px]">
            Visa guidance and application support, made clearer. Your approved e-Visas, consular fee
            receipts, embassy appointment passes and verified checklists — in one safe place,
            wherever you travel.
          </p>

          <div className="mt-7 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3.5">
            <Button
              variant="primary"
              size="lg"
              onClick={onBookConsultation}
              leadingIcon="calendar_month"
            >
              Book a Consultation
            </Button>

            <Button variant="secondary" size="lg" onClick={onOpenPortal} leadingIcon="dashboard">
              Log into Client Portal
            </Button>
          </div>

          <ul className="mt-7 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            {TRUST_ITEMS.map((item) => (
              <li
                key={item.text}
                className="glass-thin inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5"
              >
                <span className="material-icons text-[14px] leading-none text-[#1a73e8]">
                  {item.icon}
                </span>
                <span className="text-[11.5px] font-medium text-[#3c4043]">{item.text}</span>
              </li>
            ))}
          </ul>

          <p className="mt-5 max-w-md text-[11px] leading-relaxed text-[#80868b]">
            Visa decisions are made solely by the relevant embassy, consulate or immigration
            authority. Our services do not guarantee visa approval.
          </p>
        </div>

        {/* Glass showcase with the animation */}
        <div className="relative mx-auto w-full max-w-[560px] lg:mx-0">
          <div
            aria-hidden="true"
            className="absolute -inset-5 rounded-[46px] bg-gradient-to-br from-[#1a73e8]/25 via-[#7ab7ff]/12 to-emerald-400/20 blur-2xl"
          />

          <div className="glass glass-sheen relative overflow-hidden rounded-[30px] p-2 sm:rounded-[34px] sm:p-2.5">
            <div className="relative overflow-hidden rounded-[24px] bg-white/25 ring-1 ring-inset ring-white/60 sm:rounded-[28px]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_0.9px,transparent_0.9px)] [background-size:20px_20px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]"
              />

              <div className="relative flex h-[300px] w-full items-center justify-center overflow-hidden sm:h-[360px] lg:h-[404px]">
                <LottiePlayer
                  src="https://www.gstatic.com/marketing-cms/84/e0/4ea3d6ec422284df08def68fc0ef/gwallet-hero-en-us.json"
                  className="h-full w-full max-w-[520px]"
                  autoplay={true}
                  loop={true}
                  trigger="autoplay"
                  alt="VisaHOBe Digital Visa & Consular Application Showcase"
                  badgeIcon="verified_user"
                  fallback={<HeroVisual />}
                />
              </div>
            </div>
          </div>

          {/* Floating glass labels */}
          <div
            aria-hidden="true"
            className="glass-thin absolute -left-3 top-8 hidden items-center gap-2 rounded-2xl px-3 py-2 sm:flex"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e8f0fe] text-[#1a73e8]">
              <span className="material-icons text-[15px] leading-none">fact_check</span>
            </span>
            <span>
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-[#80868b]">
                29-point
              </span>
              <span className="block text-[11.5px] font-bold leading-none text-[#202124]">
                Country reports
              </span>
            </span>
          </div>

          <div
            aria-hidden="true"
            className="glass-thin absolute -right-2 bottom-10 hidden items-center gap-2 rounded-2xl px-3 py-2 sm:flex"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <span className="material-icons text-[15px] leading-none">verified</span>
            </span>
            <span>
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-[#80868b]">
                Checklist
              </span>
              <span className="block text-[11.5px] font-bold leading-none text-emerald-700">
                Verified
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
