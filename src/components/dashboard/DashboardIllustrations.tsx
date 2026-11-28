import React from 'react';

// VisaHOBe consular gateway word mark
export const PortalBrandMark: React.FC<{ className?: string }> = ({ className = 'h-6' }) => {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <div className="h-full aspect-square rounded-lg bg-gradient-to-br from-[#1a73e8] to-[#0d47a1] text-white flex items-center justify-center p-1 shadow-2xs">
        <span className="material-icons text-base">verified_user</span>
      </div>
      <div className="flex flex-col text-left">
        <span className="font-['Google_Sans',Roboto,sans-serif] font-bold text-sm text-[#1f1f1f] leading-none">
          VisaHOBe
        </span>
        <span className="text-[9px] font-semibold text-[#0b57d0] tracking-wider uppercase leading-none mt-0.5">
          Consular Gateway
        </span>
      </div>
    </div>
  );
};

// 1. Welcome Card Illustration: Passport with golden seal, approved visa stamp, airplane route, and consular badge
export const WelcomeIllustration: React.FC = () => {
  return (
    <div className="relative w-48 h-28 sm:w-60 sm:h-32 flex items-center justify-center shrink-0">
      {/* Background Soft Blue Circles */}
      <div className="absolute right-4 top-1 w-24 h-24 rounded-full bg-[#d3e3fd]/60" />
      <div className="absolute right-14 bottom-1 w-20 h-20 rounded-full bg-[#e8f0fe]" />

      {/* Passport Book (Navy Blue with Gold Crest) */}
      <div className="absolute left-3 top-4 w-16 h-22 bg-[#001d35] rounded-xl shadow-md border border-[#0b57d0]/30 p-2 flex flex-col justify-between text-white z-10 rotate-[-8deg]">
        <div className="flex justify-between items-center">
          <span className="text-[7px] font-bold tracking-widest text-[#fbbc04]">PASSPORT</span>
          <span className="material-icons text-[10px] text-[#fbbc04]">public</span>
        </div>
        {/* Gold Emblem */}
        <div className="self-center w-7 h-7 rounded-full border border-[#fbbc04]/80 flex items-center justify-center">
          <span className="material-icons text-sm text-[#fbbc04]">stars</span>
        </div>
        {/* Biometric symbol */}
        <div className="self-center w-5 h-2 border border-[#fbbc04]/70 rounded-xs flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#fbbc04]" />
        </div>
      </div>

      {/* Airplane Traveling Line */}
      <div className="absolute left-16 bottom-2 bg-[#d3e3fd] text-[#0b57d0] p-1.5 rounded-full flex items-center justify-center w-8 h-8 shadow-2xs z-20">
        <span className="material-icons text-base rotate-[-25deg]">flight</span>
      </div>

      {/* Approved Visa Stamp Badge */}
      <div className="absolute right-8 top-3 bg-white p-2.5 rounded-2xl shadow-md border border-emerald-100 flex flex-col items-center justify-center z-20">
        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
          <span className="material-icons text-lg">check_circle</span>
        </div>
        <span className="text-[8px] font-extrabold text-emerald-700 tracking-wider">VISA GRANTED</span>
      </div>

      {/* Gold Sparkles */}
      <div className="absolute right-28 top-2 text-[#fbbc04]">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
        </svg>
      </div>
      <div className="absolute right-2 bottom-5 w-3 h-3 rounded-full bg-[#fbbc04]" />
      <div className="absolute top-1 right-24 w-2.5 h-2.5 rounded-full bg-[#34a853]" />
    </div>
  );
};

// 2. Visa Applicant & Consular Officer Illustration
export const PaymentShoppersIllustration: React.FC = () => {
  return (
    <div className="relative w-40 h-32 sm:w-48 sm:h-36 shrink-0 flex items-center justify-center">
      {/* Background Soft Blob */}
      <div className="absolute inset-0 bg-[#e8f0fe] rounded-full scale-90 opacity-70" />

      {/* Consular Desk & Figures */}
      <svg className="w-full h-full relative z-10" viewBox="0 0 150 120" fill="none">
        {/* Consular Officer (Left, Blue Suit) */}
        <circle cx="45" cy="36" r="11" fill="#ea8600" />
        <path
          d="M32 52 C32 48 37 46 45 46 C53 46 58 48 58 52 L58 92 L32 92 Z"
          fill="#0b57d0"
        />

        {/* Consular Window Shield Frame */}
        <rect x="68" y="22" width="6" height="70" rx="3" fill="#c2e7ff" />

        {/* Applicant (Right, Amber/White) */}
        <circle cx="98" cy="38" r="10" fill="#795548" />
        <path
          d="M86 54 C86 50 90 48 98 48 C106 48 110 50 110 54 L110 92 L86 92 Z"
          fill="#fbbc04"
        />

        {/* Handing over passport with visa */}
        <rect x="60" y="52" width="22" height="15" rx="3" fill="#001d35" />
        <rect x="64" y="55" width="14" height="9" rx="1" fill="#4285f4" />
        <circle cx="71" cy="59" r="2" fill="#fbbc04" />

        {/* Verified green badge */}
        <circle cx="120" cy="40" r="10" fill="#34a853" />
        <path
          d="M116 40 L119 43 L125 37"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// 3. Approved Visa & Digital Passes Illustration
export const PassesIllustration: React.FC<{ holder?: string }> = ({ holder = 'A. MORGAN' }) => {
  return (
    <div className="relative w-44 h-28 sm:w-52 sm:h-32 shrink-0 flex items-center justify-center">
      {/* Background Soft Shape */}
      <div className="absolute inset-0 bg-[#e8f0fe] rounded-3xl scale-95" />

      {/* Official e-Visa Foil Card Graphic */}
      <div className="relative z-10 w-36 h-22 bg-white rounded-xl shadow-md border border-neutral-200/90 p-2.5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-icons text-[#0b57d0] text-sm">verified_user</span>
            <span className="text-[10px] font-bold text-neutral-800 tracking-tight">
              B1/B2 e-VISA
            </span>
          </div>
          <span className="text-[8px] font-extrabold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-200">
            ISSUED
          </span>
        </div>

        {/* Passport holder thumbnail & data row */}
        <div className="flex items-center gap-2 my-1">
          <div className="w-5 h-6 bg-neutral-200 rounded-xs flex items-center justify-center text-neutral-500">
            <span className="material-icons text-xs">person</span>
          </div>
          <div className="text-[8px] text-neutral-600 leading-tight">
            <p className="font-bold text-neutral-900">{holder}</p>
            <p className="font-mono text-[7px]">MULT ENTRY • 10Y</p>
          </div>
        </div>

        {/* Barcode / MRZ lines */}
        <div className="flex items-end justify-between h-4 pt-1 border-t border-dashed border-neutral-200">
          <div className="flex gap-[2px] items-stretch h-3">
            <span className="w-[1.5px] bg-black" />
            <span className="w-[2.5px] bg-black" />
            <span className="w-[1px] bg-black" />
            <span className="w-[3px] bg-black" />
            <span className="w-[1.5px] bg-black" />
            <span className="w-[2px] bg-black" />
            <span className="w-[1px] bg-black" />
            <span className="w-[2.5px] bg-black" />
          </div>
          <span className="text-[7px] font-mono text-neutral-500 tracking-tighter">
            V94820194USA&lt;&lt;
          </span>
        </div>
      </div>
    </div>
  );
};

// 4. Visa Application Form Autofill in Chrome Illustration
export const AutofillIllustration: React.FC = () => {
  return (
    <div className="w-full h-36 bg-[#fef7e0] rounded-2xl relative overflow-hidden flex items-center justify-center p-4">
      {/* Official Visa Application Form Box */}
      <div className="w-52 bg-white rounded-xl shadow-md border border-[#fce8b2] p-2.5 space-y-1.5 relative z-10">
        <div className="flex items-center gap-1.5 pb-1 border-b border-neutral-100">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-[8px] font-bold text-neutral-500 ml-1">DS-160 Online Form</span>
        </div>

        {/* Passport / Visa autofill prompt */}
        <div className="bg-[#e8f0fe] p-1.5 rounded-lg flex items-center justify-between border border-[#c2e7ff]">
          <div className="flex items-center gap-1.5">
            <span className="material-icons text-blue-600 text-xs">badge</span>
            <span className="text-[9px] font-mono font-bold text-neutral-800">P9842104 (USA)</span>
          </div>
          <span className="text-[8px] font-bold text-blue-700 bg-white px-1.5 py-0.5 rounded shadow-2xs">
            Autofill
          </span>
        </div>

        <div className="flex items-center gap-2 pt-0.5 text-[8px] text-neutral-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Biometric passport data verified</span>
        </div>
      </div>

      {/* World Map / Passport Stamp Icon on right */}
      <div className="absolute right-4 bottom-2 text-[#f29900]/80">
        <span className="material-icons text-5xl">flight_takeoff</span>
      </div>
    </div>
  );
};

// 5. Consular Security & ICAO Biometric Compliance Illustration
export const SecurityIllustration: React.FC = () => {
  return (
    <div className="w-full h-36 bg-[#e8f0fe] rounded-2xl relative overflow-hidden flex items-center justify-center p-4">
      {/* Consular Card with Chip */}
      <div className="relative w-48 h-24 bg-gradient-to-r from-[#001d35] via-[#0b57d0] to-[#1a73e8] rounded-xl shadow-lg p-2.5 flex flex-col justify-between text-white z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className="material-icons text-xs text-[#fbbc04]">verified_user</span>
            <span className="text-[9px] font-bold tracking-wider text-[#fbbc04]">CONSULAR PASS</span>
          </div>
          <span className="material-icons text-sm">contactless</span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-[9px] font-mono tracking-widest opacity-90">•••• 4242</span>
          <span className="text-[8px] opacity-80">256-BIT SSL</span>
        </div>
      </div>

      {/* Security Padlock Shield on right */}
      <div className="absolute right-7 top-4 z-20 bg-white p-2.5 rounded-2xl shadow-xl border border-blue-100 flex items-center justify-center">
        <span className="material-icons text-[#0b57d0] text-3xl">shield</span>
      </div>
    </div>
  );
};
