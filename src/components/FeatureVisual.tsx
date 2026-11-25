import React from 'react';
import { cn } from '../utils/cn';

/**
 * Function-specific visuals used where an animated Lottie cannot render
 * (offline previews, blocked CDNs). Every variant mirrors the section it sits
 * in, so the fallback still explains the feature instead of showing a generic
 * placeholder.
 */

const Chip: React.FC<{ children: React.ReactNode; tone?: 'blue' | 'green' | 'amber' | 'grey' }> = ({
  children,
  tone = 'blue',
}) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.06em]',
      tone === 'blue' && 'bg-[#e8f0fe] text-[#0b57d0]',
      tone === 'green' && 'bg-emerald-50 text-emerald-700',
      tone === 'amber' && 'bg-amber-50 text-amber-700',
      tone === 'grey' && 'bg-black/[0.05] text-[#5f6368]'
    )}
  >
    {children}
  </span>
);

const Bar: React.FC<{ width: string; tone?: string }> = ({ width, tone = '#202124' }) => (
  <span
    className="block h-1.5 rounded-full opacity-[0.13]"
    style={{ width, backgroundColor: tone }}
  />
);

const Head: React.FC<{ icon: string; title: string; caption: string; accent: string; chip?: React.ReactNode }> = ({
  icon,
  title,
  caption,
  accent,
  chip,
}) => (
  <div className="flex items-center gap-2.5">
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
      style={{ backgroundColor: accent }}
    >
      <span className="material-icons text-[19px] leading-none">{icon}</span>
    </span>
    <div className="min-w-0 flex-1">
      <p className="truncate text-[12.5px] font-bold leading-tight text-[#202124]">{title}</p>
      <p className="truncate text-[10.5px] leading-tight text-[#80868b]">{caption}</p>
    </div>
    {chip}
  </div>
);

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative w-full max-w-[332px]">
    <div aria-hidden="true" className="absolute inset-x-7 top-5 h-full rounded-3xl bg-white/45 ring-1 ring-white/60" />
    <div aria-hidden="true" className="absolute inset-x-4 top-2.5 h-full rounded-3xl bg-white/70 ring-1 ring-white/70" />
    <div className="relative rounded-[24px] border border-white bg-white p-4 shadow-[0_20px_50px_-30px_rgba(60,64,67,0.6)] ring-1 ring-black/[0.04]">
      {children}
    </div>
  </div>
);

const Line: React.FC<{ label: string; value: string; strong?: boolean }> = ({ label, value, strong }) => (
  <div className="flex items-baseline justify-between gap-3 py-[5px]">
    <span className="text-[10.5px] text-[#80868b]">{label}</span>
    <span
      className={cn(
        'text-[11px] text-right',
        strong ? 'font-bold text-[#202124]' : 'font-semibold text-[#3c4043]'
      )}
    >
      {value}
    </span>
  </div>
);

const Barcode: React.FC<{ accent?: string }> = ({ accent = '#202124' }) => (
  <div className="flex h-7 items-end gap-[2px] overflow-hidden" aria-hidden="true">
    {[3, 1, 2, 1, 4, 1, 2, 3, 1, 1, 3, 2, 1, 4, 1, 2, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3].map((w, i) => (
      <span
        key={i}
        className="h-full rounded-[1px] opacity-80"
        style={{ width: w, backgroundColor: accent }}
      />
    ))}
  </div>
);

const PaymentsVisual: React.FC<{ accent: string }> = ({ accent }) => (
  <Shell>
    <Head
      icon="payments"
      title="Consular fee receipt"
      caption="Official channel · itemised"
      accent={accent}
      chip={<Chip tone="green">Paid</Chip>}
    />
    <div className="mt-3 divide-y divide-black/[0.05]">
      <Line label="DS-160 MRV fee" value="$185.00" />
      <Line label="Schengen visa charge" value="€90.00" />
      <Line label="Advisory service" value="৳2,500" />
      <Line label="Total settled" value="৳29,860" strong />
    </div>
    <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f6f9fe] px-2.5 py-2">
      <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#0b57d0]">
        <span className="material-icons text-[13px] leading-none">verified</span>
        No hidden charges
      </span>
      <span className="font-mono text-[9.5px] text-[#80868b]">VH-2041</span>
    </div>
  </Shell>
);

const TrackingVisual: React.FC<{ accent: string }> = ({ accent }) => (
  <Shell>
    <Head
      icon="local_shipping"
      title="Application milestones"
      caption="Synced from your email"
      accent={accent}
      chip={<Chip tone="green">Live</Chip>}
    />
    <ol className="mt-3 space-y-2.5">
      {[
        { label: 'Documents screened & verified', meta: 'Completed · 04 Nov', done: true },
        { label: 'Submitted at embassy counter', meta: 'Completed · 07 Nov', done: true },
        { label: 'Passport courier out for delivery', meta: 'DHL 8841 2239 07', done: false },
      ].map((step) => (
        <li key={step.label} className="flex items-start gap-2.5">
          <span
            className={cn(
              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
              step.done ? 'bg-emerald-500 text-white' : 'bg-[#e8f0fe] text-[#0b57d0]'
            )}
          >
            <span className="material-icons text-[12px] leading-none">
              {step.done ? 'check' : 'local_shipping'}
            </span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold leading-tight text-[#202124]">
              {step.label}
            </span>
            <span className="mt-0.5 block font-mono text-[9.5px] text-[#80868b]">{step.meta}</span>
          </span>
        </li>
      ))}
    </ol>
  </Shell>
);

const TravelVisual: React.FC<{ accent: string }> = ({ accent }) => (
  <Shell>
    <Head
      icon="flight_takeoff"
      title="UAE tourist e-Visa"
      caption="Approved · multiple checks"
      accent={accent}
      chip={<Chip tone="green">Valid</Chip>}
    />
    <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#f8fafd] px-3 py-2.5">
      <div className="text-center">
        <p className="text-[13px] font-bold leading-none text-[#202124]">DAC</p>
        <p className="mt-1 text-[9px] text-[#80868b]">Dhaka</p>
      </div>
      <div className="flex-1 px-2">
        <div className="relative h-px bg-[#c7c9cc]">
          <span
            className="material-icons absolute -top-2 left-1/2 -translate-x-1/2 text-[14px] leading-none"
            style={{ color: accent }}
          >
            flight
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[13px] font-bold leading-none text-[#202124]">DXB</p>
        <p className="mt-1 text-[9px] text-[#80868b]">Dubai</p>
      </div>
    </div>
    <div className="mt-2 divide-y divide-black/[0.05]">
      <Line label="Validity" value="90 days" />
      <Line label="Entry" value="Single entry" />
      <Line label="Stay allowed" value="30 days" />
    </div>
    <div className="mt-2 rounded-xl bg-white px-1 pt-2">
      <Barcode accent="#3c4043" />
    </div>
  </Shell>
);

const WorkVisaVisual: React.FC<{ accent: string }> = ({ accent }) => (
  <Shell>
    <Head
      icon="engineering"
      title="Skilled worker file"
      caption="Saudi Arabia · Qiwa pathway"
      accent={accent}
      chip={<Chip tone="amber">Review</Chip>}
    />
    <div className="mt-3 space-y-1.5">
      {[
        { label: 'Passport & PCC verified', done: true },
        { label: 'Trade certificate attested', done: true },
        { label: 'Qiwa / Musaned contract', done: true },
        { label: 'Employer visa quota', done: false },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className={cn(
              'flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
              item.done ? 'bg-emerald-500 text-white' : 'border border-dashed border-[#c7c9cc]'
            )}
          >
            {item.done && <span className="material-icons text-[10px] leading-none">check</span>}
          </span>
          <span className="text-[10.5px] font-medium text-[#3c4043]">{item.label}</span>
        </div>
      ))}
    </div>
    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
      <span className="block h-full w-3/4 rounded-full" style={{ backgroundColor: accent }} />
    </div>
    <p className="mt-2 text-[9.5px] font-medium text-[#80868b]">3 of 4 steps complete · no fake offers</p>
  </Shell>
);

const AppointmentVisual: React.FC<{ accent: string }> = ({ accent }) => (
  <Shell>
    <Head
      icon="confirmation_number"
      title="Biometric appointment"
      caption="VFS Global · Dhaka centre"
      accent={accent}
      chip={<Chip>Confirmed</Chip>}
    />
    <div className="mt-3 flex items-center gap-3">
      <div
        className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl text-white"
        style={{ backgroundColor: accent }}
      >
        <span className="text-[17px] font-bold leading-none">12</span>
        <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide">Nov</span>
      </div>
      <div className="min-w-0">
        <p className="text-[11.5px] font-bold leading-tight text-[#202124]">09:30 AM · Counter 4</p>
        <p className="mt-0.5 text-[10px] text-[#80868b]">Arrive 15 min early · gate 2</p>
        <p className="mt-1 font-mono text-[9.5px] text-[#5f6368]">VH-APPT-88412</p>
      </div>
    </div>
    <div className="mt-3 rounded-xl bg-[#f8fafd] px-2 py-2">
      <Barcode accent="#3c4043" />
    </div>
  </Shell>
);

const IdentityVisual: React.FC<{ accent: string }> = ({ accent }) => (
  <Shell>
    <Head
      icon="assignment_ind"
      title="MRP travel identity"
      caption="Tokenised · ICAO 9303"
      accent={accent}
      chip={<Chip tone="grey">Encrypted</Chip>}
    />
    <div className="mt-3 flex items-center gap-2.5">
      <span className="flex h-11 w-9 items-center justify-center rounded-md bg-[#eef2f7] text-[#5f6368]">
        <span className="material-icons text-xl leading-none">person</span>
      </span>
      <div className="flex-1 space-y-1.5">
        <Bar width="70%" />
        <Bar width="45%" />
        <Bar width="58%" />
      </div>
    </div>
    <div className="mt-3 divide-y divide-black/[0.05]">
      <Line label="Passport" value="MRP · e-Passport" />
      <Line label="Travel history" value="14 verified visas" />
      <Line label="Police clearance" value="Matched" />
    </div>
  </Shell>
);

const EgateVisual: React.FC<{ accent: string }> = ({ accent }) => (
  <Shell>
    <Head
      icon="lock_open"
      title="e-Gate clearance"
      caption="Fast-track transit pass"
      accent={accent}
      chip={<Chip tone="green">Active</Chip>}
    />
    <div className="relative mt-3 flex h-[92px] items-center justify-center">
      {[0, 1, 2].map((ring) => (
        <span
          key={ring}
          className="absolute rounded-full border"
          style={{
            width: 60 + ring * 26,
            height: 60 + ring * 26,
            borderColor: `${accent}${ring === 0 ? '55' : '22'}`,
          }}
        />
      ))}
      <span
        className="relative flex h-11 w-11 items-center justify-center rounded-full text-white shadow-md"
        style={{ backgroundColor: accent }}
      >
        <span className="material-icons text-[22px] leading-none">nfc</span>
      </span>
    </div>
    <p className="mt-1 text-center text-[11px] font-bold text-[#202124]">Tap to clear immigration</p>
    <p className="mt-0.5 text-center text-[9.5px] text-[#80868b]">Gate B12 · eligible airports only</p>
    <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f6f9fe] px-2.5 py-2">
      <span className="text-[9.5px] font-semibold text-[#0b57d0]">NFC credential stored</span>
      <span className="material-icons text-[13px] leading-none text-[#0b57d0]">verified_user</span>
    </div>
  </Shell>
);

const SecurityVisual: React.FC<{ accent: string }> = ({ accent }) => (
  <Shell>
    <Head
      icon="security"
      title="Data protection"
      caption="256-bit SSL · ethical docs"
      accent={accent}
      chip={<Chip tone="green">On</Chip>}
    />
    <div className="mt-3 space-y-1.5">
      {[
        { label: 'Personal data encrypted at rest', icon: 'lock' },
        { label: 'No fabricated bank statements', icon: 'block' },
        { label: 'No false hotel or ticket bookings', icon: 'block' },
        { label: 'Consent-based document sharing', icon: 'visibility' },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-2 rounded-lg bg-[#f8fafd] px-2 py-1.5">
          <span className="material-icons text-[13px] leading-none text-emerald-600">{item.icon}</span>
          <span className="text-[10.5px] font-medium text-[#3c4043]">{item.label}</span>
        </div>
      ))}
    </div>
    <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200/70 bg-emerald-50/70 px-2.5 py-2">
      <span className="material-icons text-[14px] leading-none text-emerald-700">verified_user</span>
      <span className="text-[9.5px] font-semibold text-emerald-800">
        Embassy-grade document ethics
      </span>
    </div>
  </Shell>
);

const VARIANTS: Record<string, React.FC<{ accent: string }>> = {
  payments: PaymentsVisual,
  receipts: TrackingVisual,
  travel: TravelVisual,
  loyalty: WorkVisaVisual,
  tickets: AppointmentVisual,
  identity: IdentityVisual,
  keys: EgateVisual,
  security: SecurityVisual,
};

/** Hero showcase: a digital visa pass phone mock */
export const HeroVisual: React.FC = () => (
  <div className="relative w-full max-w-[340px]">
    <div className="relative overflow-hidden rounded-[30px] border-[6px] border-[#202124] bg-white shadow-[0_26px_60px_-30px_rgba(60,64,67,0.65)]">
      <div className="flex items-center justify-between bg-[#0b57d0] px-4 py-2.5">
        <span className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-white/90">
          <span className="material-icons text-[13px] leading-none">verified_user</span>
          VisaHOBe pass
        </span>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wide text-white">
          Approved
        </span>
      </div>

      <div className="space-y-2.5 p-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f0fe] text-[#1a73e8]">
            <span className="material-icons text-[19px] leading-none">public</span>
          </span>
          <div className="flex-1">
            <p className="text-[11.5px] font-bold leading-tight text-[#202124]">UAE tourist e-Visa</p>
            <p className="text-[9.5px] text-[#80868b]">Valid 90 days · single entry</p>
          </div>
          <span className="material-icons text-[16px] leading-none text-emerald-500">check_circle</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {[
            { icon: 'fact_check', label: 'Checklist' },
            { icon: 'receipt_long', label: 'Receipt' },
            { icon: 'event_available', label: 'Appointment' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-[#f8fafd] px-1.5 py-2 text-center">
              <span className="material-icons text-[15px] leading-none text-[#0b57d0]">{item.icon}</span>
              <p className="mt-1 text-[8.5px] font-semibold text-[#5f6368]">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2.5 rounded-2xl border border-black/[0.06] bg-white p-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f1f3f4]">
            <span className="material-icons text-[26px] leading-none text-[#3c4043]">qr_code_2</span>
          </span>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-[#202124]">Scan at consular terminal</p>
            <p className="mt-0.5 font-mono text-[9px] text-[#80868b]">VH · DAC · 4429 8812</p>
            <div className="mt-1.5 flex gap-[2px]">
              {[2, 1, 3, 1, 2, 1, 2, 3, 1, 1, 2].map((w, i) => (
                <span key={i} className="h-3 rounded-[1px] bg-[#3c4043]/70" style={{ width: w }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Floating accent chips */}
    <div className="absolute -right-3 top-16 hidden rounded-xl border border-white/80 bg-white/95 px-2.5 py-1.5 shadow-md backdrop-blur-sm sm:block">
      <p className="text-[9px] font-bold uppercase tracking-wide text-[#80868b]">Countries</p>
      <p className="text-[12px] font-bold leading-none text-[#202124]">190</p>
    </div>
    <div className="absolute -left-3 bottom-12 hidden rounded-xl border border-white/80 bg-white/95 px-2.5 py-1.5 shadow-md backdrop-blur-sm sm:block">
      <p className="text-[9px] font-bold uppercase tracking-wide text-[#80868b]">Checklist</p>
      <p className="text-[12px] font-bold leading-none text-emerald-600">Verified</p>
    </div>
  </div>
);

export const FeatureVisual: React.FC<{
  variant?: string;
  accent?: string;
}> = ({ variant, accent = '#1a73e8' }) => {
  const Visual = (variant && VARIANTS[variant]) || SecurityVisual;
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Visual accent={accent} />
    </div>
  );
};
