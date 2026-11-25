import React, { useState } from 'react';
import { CardItem } from './AddCardModal';
import { DashboardPassItem } from '../../data/dashboardMockData';
import { TransactionData } from './TransactionReceiptModal';
import {
  PortalBrandMark,
  WelcomeIllustration,
  PaymentShoppersIllustration,
  PassesIllustration,
  AutofillIllustration,
  SecurityIllustration,
} from './DashboardIllustrations';

interface DashboardHomeProps {
  cards: CardItem[];
  passes: DashboardPassItem[];
  transactions: TransactionData[];
  onNavigateTab: (tab: 'home' | 'paymentmethods' | 'passes' | 'transactions' | 'settings') => void;
  onOpenAddCard: () => void;
  onSelectPass: (pass: DashboardPassItem) => void;
  onSelectTransaction: (tx: TransactionData) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  cards,
  passes,
  transactions,
  onNavigateTab,
  onOpenAddCard,
  onSelectPass,
  onSelectTransaction,
}) => {
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

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
          <div className="space-y-2 max-w-xl pr-6">
            <h2 className="font-['Google_Sans',Roboto,sans-serif] text-2xl sm:text-[28px] font-normal text-[#1f1f1f] tracking-tight">
              Welcome to VisaHOBe Client Portal
            </h2>
            <p className="text-sm sm:text-[15px] text-[#444746] leading-relaxed">
              You can now manage your visa application payment methods & travel passes, update visa
              & document settings, and view recent consular transactions, all in one place
            </p>
          </div>

          {/* Right Visual: Soft blue circle with coffee, airplane, sparkles, wallet stacked cards */}
          <div className="self-center md:self-auto">
            <WelcomeIllustration />
          </div>
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
                  Add your payment card to pay embassy & consular visa fees
                </h3>
                <p className="text-sm sm:text-[14px] text-[#444746] leading-relaxed">
                  Skip typing your payment info when completing official visa applications online,
                  protect your card with bank-grade consular security, and use tap to pay at visa
                  application centers with your Android device
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

            {/* If user already has saved cards, show quick preview */}
            {cards.length > 0 && (
              <div className="mt-6 pt-5 border-t border-neutral-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Saved consular cards ({cards.length})
                  </span>
                  <button
                    onClick={() => onNavigateTab('paymentmethods')}
                    className="text-xs font-semibold text-[#0b57d0] hover:underline cursor-pointer"
                  >
                    View all payment methods →
                  </button>
                </div>
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
                        </p>
                        <p className="text-[10px] text-neutral-500">{card.nickname}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Visas & Passes */}
          <div className="glass-flat glass-sheen rounded-[28px] p-6 sm:p-8 shadow-xs  flex flex-col justify-between min-h-[260px]">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="space-y-2 max-w-sm">
                <h3 className="font-['Google_Sans',Roboto,sans-serif] text-2xl font-normal text-[#1f1f1f]">
                  Visas & Passes
                </h3>
                <p className="text-sm text-[#444746] leading-relaxed">
                  View approved e-Visas, consular appointment slips, travel authorizations, and more
                </p>
              </div>

              {/* Passes ticket graphic */}
              <div className="self-center sm:self-start">
                <PassesIllustration />
              </div>
            </div>

            {/* Passes quick preview list */}
            {passes.length > 0 && (
              <div className="mt-4 pt-3 border-t border-neutral-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {passes.slice(0, 2).map((pass) => (
                    <div
                      key={pass.id}
                      onClick={() => onSelectPass(pass)}
                      className="p-3 bg-neutral-50 hover:bg-neutral-100/90 rounded-2xl border border-neutral-200/80 cursor-pointer flex items-center justify-between transition-colors"
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
                      <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                        View
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Passes quick preview / View all button */}
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500">{passes.length} active visas & passes</span>
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-['Google_Sans',Roboto,sans-serif] text-xl font-normal text-[#1f1f1f]">
                  Recent transactions
                </h3>
                <p className="text-xs text-[#444746]">
                  Payments made for embassy fees, biometric capture, and consular processing
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('transactions')}
                className="text-xs font-semibold text-[#0b57d0] hover:underline cursor-pointer"
              >
                View all →
              </button>
            </div>

            <div className="divide-y divide-neutral-100">
              {transactions.slice(0, 3).map((tx) => (
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
                      -${Math.abs(tx.amount).toFixed(2)}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-medium">{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
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
