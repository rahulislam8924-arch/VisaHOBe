import React, { useState } from 'react';
import { CardItem } from './AddCardModal';
import { DashboardPassItem } from '../../data/dashboardMockData';
import { TransactionData } from './TransactionReceiptModal';
import type { PortalProfile } from '../../lib/portalStore';
import {
  formatUsd,
  getApplicationStatus,
  getPortalMetrics,
  holderLabel,
  personalizePasses,
  STATUS_LABEL,
} from '../../lib/portalMetrics';
import {
  PortalBrandMark,
  WelcomeIllustration,
  PaymentShoppersIllustration,
  PassesIllustration,
  AutofillIllustration,
  SecurityIllustration,
} from './DashboardIllustrations';

interface DashboardHomeProps {
  profile: PortalProfile;
  cards: CardItem[];
  passes: DashboardPassItem[];
  transactions: TransactionData[];
  onNavigateTab: (
    tab: 'home' | 'agent' | 'paymentmethods' | 'passes' | 'transactions' | 'settings'
  ) => void;
  onOpenAddCard: () => void;
  onSelectPass: (pass: DashboardPassItem) => void;
  onSelectTransaction: (tx: TransactionData) => void;
  isDemoData?: boolean;
  onClearDemoRecords?: () => void;
}

const statusChipClass: Record<string, string> = {
  approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  scheduled: 'bg-amber-50 text-amber-700 ring-amber-200',
  expired: 'bg-neutral-100 text-neutral-600 ring-neutral-200',
};

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  profile,
  cards,
  passes,
  transactions,
  onNavigateTab,
  onOpenAddCard,
  onSelectPass,
  onSelectTransaction,
  isDemoData = false,
  onClearDemoRecords,
}) => {
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

  // Everything below is derived from the client's own records
  const metrics = getPortalMetrics({ passes, transactions, cards });
  const applications = personalizePasses(passes, profile.name);
  const firstName = profile.name.trim().split(/\s+/)[0] || 'there';
  const recentTransactions = [...transactions].slice(0, 3);

  const summaryParts = [
    `${metrics.applications} ${metrics.applications === 1 ? 'application' : 'applications'}`,
    `${formatUsd(metrics.totalPaid)} paid across ${metrics.receipts} ${
      metrics.receipts === 1 ? 'receipt' : 'receipts'
    }`,
    `${metrics.savedCards} saved ${metrics.savedCards === 1 ? 'card' : 'cards'}`,
  ];

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* 1. Welcome banner */}
      {showWelcomeBanner && (
        <div className="glass-flat glass-sheen rounded-[28px] p-6 sm:p-8 shadow-xs  relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Close Banner Button */}
          <button
            type="button"
            onClick={() => setShowWelcomeBanner(false)}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
            aria-label="Dismiss welcome banner"
          >
            <span className="material-icons text-xl">close</span>
          </button>

          {/* Left Text */}
          <div className="space-y-3 max-w-xl pr-6">
            <h2 className="font-['Google_Sans',Roboto,sans-serif] text-2xl sm:text-[28px] font-normal text-[#1f1f1f] tracking-tight">
              Welcome back, {firstName}
            </h2>
            <p className="text-sm sm:text-[15px] text-[#444746] leading-relaxed">
              {summaryParts.join(' · ')}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onNavigateTab('agent')}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-[#0b57d0] ring-1 ring-black/[0.06] transition-colors hover:bg-white cursor-pointer"
              >
                <span className="material-icons text-sm">auto_awesome</span>
                Ask the AI visa agent
              </button>
              {metrics.expiringSoon > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
                  <span className="material-icons text-sm">schedule</span>
                  {metrics.expiringSoon} expiring within 6 months
                </span>
              )}
            </div>
          </div>

          {/* Right Visual: Soft blue circle with coffee, airplane, sparkles, wallet stacked cards */}
          <div className="self-center md:self-auto">
            <WelcomeIllustration />
          </div>
        </div>
      )}

      {/* 1b. Demo-records notice — only while the seeded samples are untouched */}
      {isDemoData && (
        <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-[#0b57d0]/20 bg-[#e8f0fe]/70 px-4 py-3 sm:flex-row sm:items-center">
          <p className="text-xs leading-relaxed text-[#001d35]">
            <span className="font-semibold">Demo records.</span> The applications, cards and receipts
            below are samples so you can explore the portal. Clear them any time to work with only
            your own data.
          </p>
          {onClearDemoRecords && (
            <button
              type="button"
              onClick={onClearDemoRecords}
              className="shrink-0 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0b57d0] ring-1 ring-[#0b57d0]/25 transition-colors hover:bg-[#f4f8ff] cursor-pointer"
            >
              Clear demo records
            </button>
          )}
        </div>
      )}

      {/* 2. Two-Column Layout (Matching Official Google Wallet / Google Pay Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Wider, ~7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Add payment card for embassy & consular visa fees */}
          <div className="glass-flat glass-sheen rounded-[28px] p-6 sm:p-8 shadow-xs  relative overflow-hidden flex flex-col justify-between min-h-[320px]">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="space-y-3 max-w-md">
                <h3 className="font-['Google_Sans',Roboto,sans-serif] text-2xl sm:text-[26px] font-normal text-[#1f1f1f] leading-snug">
                  {metrics.savedCards > 0
                    ? `${metrics.savedCards} ${
                        metrics.savedCards === 1 ? 'card' : 'cards'
                      } saved for embassy & consular fees`
                    : 'Add your payment card to pay embassy & consular visa fees'}
                </h3>
                <p className="text-sm sm:text-[14px] text-[#444746] leading-relaxed">
                  {metrics.savedCards > 0
                    ? 'Your saved cards are tokenized and reused for DS-160 MRV fees, Schengen visa charges and Visa Application Center appointments — no re-typing at checkout.'
                    : 'Skip typing your payment info when completing official visa applications online, protect your card with bank-grade consular security, and use tap to pay at visa application centers with your Android device.'}
                </p>
              </div>

              {/* Shoppers with smartphone illustration */}
              <div className="self-center sm:self-start">
                <PaymentShoppersIllustration />
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="mt-8 pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={onOpenAddCard}
                className="bg-[#0b57d0] hover:bg-[#0842a0] text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all shadow-xs active:scale-[0.98] cursor-pointer"
              >
                Add payment method
              </button>

              <PortalBrandMark className="h-6" />
            </div>

            {/* Saved cards preview (or an honest empty state) */}
            <div className="mt-6 pt-5 border-t border-neutral-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Saved consular cards ({metrics.savedCards})
                </span>
                <button
                  onClick={() => onNavigateTab('paymentmethods')}
                  className="text-xs font-semibold text-[#0b57d0] hover:underline cursor-pointer"
                >
                  View all payments →
                </button>
              </div>

              {cards.length === 0 ? (
                <div className="flex flex-col items-start gap-2 rounded-2xl border border-dashed border-neutral-300 bg-white/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[#444746]">
                    No payment card yet — add one to settle embassy fees in a single tap.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenAddCard}
                    className="shrink-0 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0b57d0] ring-1 ring-[#0b57d0]/25 transition-colors hover:bg-[#f4f8ff] cursor-pointer"
                  >
                    Add first card
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => onNavigateTab('paymentmethods')}
                      className="shrink-0 p-3 bg-neutral-50 hover:bg-neutral-100 rounded-2xl border border-neutral-200/80 cursor-pointer flex items-center gap-3 transition-colors"
                    >
                      <div
                        className={`w-10 h-6 rounded-md bg-gradient-to-br ${card.bgGradient} p-1 flex items-center justify-center text-white text-[8px] font-bold shadow-2xs`}
                      >
                        {card.network}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-neutral-800">
                          •••• {card.lastFour}
                          {card.isDefault && (
                            <span className="ml-1.5 text-[9px] font-medium text-[#0b57d0]">
                              default
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-neutral-500">{card.nickname}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Visas & Passes */}
          <div className="glass-flat glass-sheen rounded-[28px] p-6 sm:p-8 shadow-xs  flex flex-col justify-between min-h-[260px]">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="space-y-2 max-w-sm">
                <h3 className="font-['Google_Sans',Roboto,sans-serif] text-2xl font-normal text-[#1f1f1f]">
                  My Applications
                </h3>
                <p className="text-sm text-[#444746] leading-relaxed">
                  View approved e-Visas, consular appointment slips, travel authorizations, and more
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] text-[#444746]">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {metrics.approved} approved
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {metrics.scheduled} scheduled
                  </span>
                  {metrics.expired > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                      {metrics.expired} expired
                    </span>
                  )}
                </div>
              </div>

              {/* Passes ticket graphic */}
              <div className="self-center sm:self-start">
                <PassesIllustration holder={holderLabel(profile.name)} />
              </div>
            </div>

            {/* Passes quick preview list */}
            {applications.length === 0 ? (
              <div className="mt-5 flex flex-col items-start gap-2 rounded-2xl border border-dashed border-neutral-300 bg-white/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[#444746]">
                  No visa applications on file yet. Ask the AI agent which visa you need for your
                  destination.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigateTab('agent')}
                  className="shrink-0 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0b57d0] ring-1 ring-[#0b57d0]/25 transition-colors hover:bg-[#f4f8ff] cursor-pointer"
                >
                  Check my visa need
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-3 border-t border-neutral-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {applications.slice(0, 2).map((pass) => {
                    const status = getApplicationStatus(pass);
                    return (
                      <div
                        key={pass.id}
                        onClick={() => onSelectPass(pass)}
                        className="p-3 bg-neutral-50 hover:bg-neutral-100/90 rounded-2xl border border-neutral-200/80 cursor-pointer flex items-center justify-between gap-2 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="material-icons text-blue-600 text-lg">{pass.icon}</span>
                          <div className="truncate">
                            <p className="text-xs font-semibold text-neutral-800 truncate">
                              {pass.title}
                            </p>
                            <p className="text-[10px] text-neutral-500 truncate">{pass.issuer}</p>
                          </div>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${
                            statusChipClass[status]
                          }`}
                        >
                          {STATUS_LABEL[status]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Passes quick preview / View all button */}
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500">
                  {metrics.applications} active {metrics.applications === 1 ? 'record' : 'records'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('passes')}
                className="text-sm font-medium text-[#0b57d0] hover:underline cursor-pointer"
              >
                View all visas & passes
              </button>
            </div>
          </div>

          {/* Card 3: Recent Consular Transactions */}
          <div className="glass-flat glass-sheen rounded-[28px] p-6 sm:p-8 shadow-xs  space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-['Google_Sans',Roboto,sans-serif] text-xl font-normal text-[#1f1f1f]">
                  Recent transactions
                </h3>
                <p className="text-xs text-[#444746]">
                  {metrics.receipts > 0
                    ? `${formatUsd(metrics.totalPaid)} paid across ${metrics.receipts} ${
                        metrics.receipts === 1 ? 'receipt' : 'receipts'
                      }`
                    : 'Payments made for embassy fees, biometric capture, and consular processing'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('transactions')}
                className="shrink-0 text-xs font-semibold text-[#0b57d0] hover:underline cursor-pointer"
              >
                View all →
              </button>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/50 p-4 text-xs text-[#444746]">
                No consular payments yet. Receipts for embassy fees, biometrics and courier charges
                will appear here.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="py-3 flex items-center justify-between hover:bg-neutral-50 rounded-xl px-2 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-700 text-sm">
                        {tx.merchant.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{tx.merchant}</p>
                        <p className="text-xs text-neutral-500">
                          {tx.date} • {tx.cardName} •••• {tx.lastFour}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-neutral-900">
                        -{formatUsd(Math.abs(tx.amount))}
                      </p>
                      <span className="text-[10px] text-emerald-600 font-medium">{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Narrower, ~5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Check out faster with autofill */}
          <div className="glass-flat glass-sheen rounded-[28px] p-6 shadow-xs  flex flex-col justify-between space-y-4">
            {/* Top Yellow Graphic */}
            <AutofillIllustration />

            <div className="space-y-2">
              <h4 className="font-['Google_Sans',Roboto,sans-serif] text-lg font-medium text-[#1f1f1f]">
                Autofill visa applications in Chrome
              </h4>
              <p className="text-xs sm:text-sm text-[#444746] leading-relaxed">
                No need to keep re-typing passport and payment info across consular portals. Once
                saved, autofill your details into DS-160, ESTA, and Schengen application forms in a
                few clicks.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigateTab('settings')}
                className="text-sm font-medium text-[#0b57d0] hover:underline cursor-pointer"
              >
                See how it works
              </button>
            </div>
          </div>

          {/* Card 2: Consular-Grade Security */}
          <div className="glass-flat glass-sheen rounded-[28px] p-6 shadow-xs  flex flex-col justify-between space-y-4">
            {/* Top Light Blue Security Graphic */}
            <SecurityIllustration />

            <div className="space-y-2">
              <h4 className="font-['Google_Sans',Roboto,sans-serif] text-lg font-medium text-[#1f1f1f]">
                Government-grade security for visa fees
              </h4>
              <p className="text-xs sm:text-sm text-[#444746] leading-relaxed">
                Pay consular fees online or at authorized visa application center terminals. Your
                sensitive passport and card details are protected with 256-bit tokenized security.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="#legal"
                className="text-sm font-medium text-[#0b57d0] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Learn more about security</span>
                <span className="material-icons text-sm">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
