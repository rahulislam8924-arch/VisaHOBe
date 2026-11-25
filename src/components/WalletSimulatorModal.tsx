import React, { useState, useEffect } from 'react';
import { DEMO_CARDS } from '../data/walletData';
import { WalletCard } from '../types';

interface WalletSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletSimulatorModal: React.FC<WalletSimulatorModalProps> = ({ isOpen, onClose }) => {
  const [selectedCard, setSelectedCard] = useState<WalletCard>(DEMO_CARDS[0]);
  const [isTapping, setIsTapping] = useState(false);
  const [tapSuccess, setTapSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState<
    'all' | WalletCard['type']
  >('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleTapToPay = () => {
    setIsTapping(true);
    setTapSuccess(false);

    setTimeout(() => {
      setIsTapping(false);
      setTapSuccess(true);

      setTimeout(() => {
        setTapSuccess(false);
      }, 3500);
    }, 1200);
  };

  if (!isOpen) return null;

  const filteredCards = activeCategory === 'all'
    ? DEMO_CARDS
    : DEMO_CARDS.filter((c) => c.type === activeCategory);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[#f8f9fa] rounded-[36px] max-w-xl w-full max-h-[92vh] overflow-hidden shadow-2xl relative border border-black/10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Phone Frame Header */}
        <div className="bg-white px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1a73e8] text-white flex items-center justify-center shadow-xs">
              <span className="material-icons text-lg">verified_user</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 leading-tight">
                Visa<span className="text-[#1a73e8]">HOBe</span> Portal
              </h3>
              <p className="text-xs text-neutral-500">Your Trusted Partner for Global Visa Support</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ICAO e-Gate Active
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full cursor-pointer"
              aria-label="Close"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <use href="#close" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Active Card Showcase */}
          <div className="relative">
            <div
              className={`w-full aspect-[1.58/1] rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between text-left transition-all duration-300 bg-gradient-to-br ${selectedCard.bgColor} ${selectedCard.textColor}`}
            >
              {/* Card Top */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-85">
                    {selectedCard.brand}
                  </p>
                  <p className="text-lg sm:text-xl font-bold">{selectedCard.title}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-black/10 backdrop-blur-xs flex items-center justify-center">
                  <span className="material-icons text-xl">{selectedCard.iconName}</span>
                </div>
              </div>

              {/* Card Middle info */}
              <div className="my-auto">
                {selectedCard.cardNumber && (
                  <p className="font-mono text-xl sm:text-2xl tracking-widest font-semibold">
                    {selectedCard.cardNumber}
                  </p>
                )}
                {selectedCard.balanceOrSeat && (
                  <p className="text-base sm:text-lg font-medium opacity-90">
                    {selectedCard.balanceOrSeat}
                  </p>
                )}
              </div>

              {/* Card Bottom */}
              <div className="flex items-center justify-between text-xs sm:text-sm opacity-90 font-medium">
                <span>{selectedCard.subtitle}</span>
                <span>{selectedCard.expiry || selectedCard.status}</span>
              </div>
            </div>

            {/* Tap To Pay / Clear Terminal Overlay */}
            {isTapping && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center text-white animate-in fade-in">
                <div className="w-16 h-16 rounded-full border-4 border-blue-400 border-t-white animate-spin mb-3" />
                <p className="font-medium text-sm tracking-wide">Connecting to consular terminal or e-gate...</p>
              </div>
            )}

            {tapSuccess && (
              <div className="absolute inset-0 bg-[#0b57d0] rounded-3xl flex flex-col items-center justify-center text-white animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-white text-[#0b57d0] flex items-center justify-center mb-3 shadow-lg animate-bounce">
                  <span className="material-icons text-3xl font-bold">check</span>
                </div>
                <p className="font-bold text-lg">Consular Clearance Verified</p>
                <p className="text-xs text-blue-100 mt-1">Receipt & digital authorization saved in VisaHOBe</p>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleTapToPay}
              disabled={isTapping || tapSuccess}
              className="flex-1 bg-[#1a73e8] hover:bg-[#1557b0] disabled:bg-neutral-400 text-white font-medium py-3 px-4 rounded-2xl transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-icons text-xl">contactless</span>
              <span>Tap at Consular Terminal or e-Gate</span>
            </button>

            <button
              type="button"
              onClick={() => alert('New visas and travel documents can be linked via application reference number or consular confirmation.')}
              className="bg-white hover:bg-neutral-100 text-neutral-800 border border-black/10 font-medium py-3 px-4 rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer"
              title="Add Document"
            >
              <span className="material-icons text-lg">add</span>
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'payment', label: 'Fee Cards' },
              { id: 'id', label: 'e-Visas & IDs' },
              { id: 'transit', label: 'Schengen & Travel' },
              { id: 'ticket', label: 'Interview Slips' },
              { id: 'loyalty', label: 'Work Visa Status' },
              { id: 'key', label: 'e-Gates' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as 'all' | WalletCard['type'])}
                className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#202124] text-white shadow-xs'
                    : 'bg-white text-neutral-600 hover:bg-neutral-200 border border-black/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Cards Carousel Grid */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Saved in your VisaHOBe Account ({filteredCards.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredCards.map((card) => {
                const isCurrent = selectedCard.id === card.id;
                return (
                  <div
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-left ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-black/5 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${card.bgColor} ${card.textColor}`}
                      >
                        <span className="material-icons text-base">{card.iconName}</span>
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-neutral-900 truncate">
                          {card.title}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">{card.subtitle}</p>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 ml-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-1.5">
            <span className="material-icons text-sm text-blue-600">security</span>
            <span>Protected by 256-bit encryption • ICAO Doc 9303 Compliant</span>
          </div>
          <button
            onClick={onClose}
            className="text-blue-600 hover:underline font-medium cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
