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
  { icon: 'public', text: `${ALL_COUNTRIES.length}-country visa database` },
  { icon: 'receipt_long', text: 'Transparent, itemised embassy fees' },
  { icon: 'verified_user', text: 'No false promises or fabricated documents' },
];

export const Hero: React.FC<HeroProps> = ({ onBookConsultation, onOpenPortal }) => {
  return (
    <section
      className="relative isolate overflow-hidden bg-[#f2f0ec] pt-8 pb-14 sm:pt-12 sm:pb-20 md:pt-16 md:pb-24"
      aria-label="VisaHOBe Introduction"
    >
      {/* Ambient background: soft colour washes + dot grid, purely decorative */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[min(1000px,120vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(26,115,232,0.16),transparent)] blur-2xl" />
        <div className="absolute -right-32 top-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(16,185,129,0.14),transparent)] blur-3xl" />
        <div className="absolute -left-32 bottom-10 h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(251,188,4,0.12),transparent)] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-[460px] bg-[radial-gradient(#c8c4bc_1px,transparent_1px)] [background-size:22px_22px] opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
      </div>

      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white/75 px-3 py-1.5 shadow-[0_1px_2px_rgba(60,64,67,0.09)] backdrop-blur-md sm:gap-2.5 sm:px-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#3c4043] sm:text-[11.5px]">
              VisaHOBe · Dhaka
            </span>
            <span className="hidden h-3 w-px bg-black/10 sm:block" />
            <span className="hidden text-[11.5px] font-medium text-[#5f6368] sm:block">
              Independent consular advisory
            </span>
          </div>

          {/* Headline */}
          <h1 className="mt-6 max-w-[19ch] text-[38px] font-bold leading-[1.08] tracking-[-0.02em] text-[#202124] sm:max-w-none sm:text-6xl md:text-[68px] lg:text-[76px]">
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

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-[16px] leading-[1.75] text-[#5f6368] sm:text-[18px] md:text-[19px]">
            Visa guidance and application support, made clearer. Keep everything — your approved
            e-Visas, consular fee receipts, embassy appointment passes, and verified document
            checklists — in one safe place, no matter where you travel.
          </p>

          {/* Primary actions */}
          <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:items-center sm:gap-3.5">
            <Button
              variant="primary"
              size="lg"
              onClick={onBookConsultation}
              leadingIcon="calendar_month"
              className="shadow-[0_10px_24px_-10px_rgba(26,115,232,0.65)] hover:shadow-[0_14px_30px_-10px_rgba(26,115,232,0.7)]"
            >
              Book a Consultation
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={onOpenPortal}
              leadingIcon="dashboard"
              className="border-[#747775]/30 bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              Log into Client Portal
            </Button>
          </div>

          {/* Trust markers */}
          <ul className="mt-9 grid w-full max-w-3xl grid-cols-1 gap-2.5 sm:mt-11 sm:grid-cols-3">
            {TRUST_ITEMS.map((item) => (
              <li
                key={item.text}
                className="flex items-center gap-2.5 rounded-2xl border border-black/[0.06] bg-white/60 px-3.5 py-3 text-left backdrop-blur-sm transition-colors hover:border-[#c2d7f5] hover:bg-white/80"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#e8f0fe] text-[#1a73e8]">
                  <span className="material-icons text-[17px] leading-none">{item.icon}</span>
                </span>
                <span className="text-[12.5px] font-medium leading-snug text-[#3c4043]">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>

          {/* Legal microcopy */}
          <p className="mt-5 max-w-xl text-[11.5px] leading-relaxed text-[#80868b]">
            Visa decisions are made solely by the relevant embassy, consulate, or immigration
            authority. Our services do not guarantee visa approval.
          </p>
        </div>

        {/* Showcase stage around the hero animation */}
        <div className="relative mx-auto mt-9 w-full max-w-[900px] sm:mt-12">
          {/* Halo behind the frame */}
          <div
            aria-hidden="true"
            className="absolute inset-x-12 -top-3 bottom-10 rounded-[52px] bg-gradient-to-br from-[#1a73e8]/14 via-[#7ab7ff]/8 to-emerald-400/12 blur-2xl"
          />

          <div className="relative rounded-[28px] border border-white/70 bg-white/55 p-1.5 shadow-[0_30px_80px_-40px_rgba(60,64,67,0.55)] backdrop-blur-xl sm:rounded-[40px] sm:p-2.5">
            <div className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(155deg,#ffffff_0%,#f5f9ff_42%,#eef8f4_100%)] ring-1 ring-inset ring-white/80 sm:rounded-[32px]">
              {/* Fine texture inside the frame */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(#c8c4bc_0.9px,transparent_0.9px)] [background-size:18px_18px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
              />

              <LottiePlayer
                src="https://www.gstatic.com/marketing-cms/84/e0/4ea3d6ec422284df08def68fc0ef/gwallet-hero-en-us.json"
                className="relative mx-auto h-auto w-full min-h-[340px] max-w-[860px] sm:min-h-[420px] md:min-h-[460px]"
                autoplay={true}
                loop={true}
                trigger="autoplay"
                alt="VisaHOBe Digital Visa & Consular Application Showcase"
                badgeIcon="verified_user"
                fallback={<HeroVisual />}
              />
            </div>
          </div>

          {/* Blend into the next section */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -bottom-6 h-20 bg-gradient-to-b from-transparent to-[#f2f0ec]"
          />
        </div>
      </div>
    </section>
  );
};
