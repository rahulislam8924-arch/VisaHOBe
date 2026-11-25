import React, { useEffect, useState } from 'react';
import { iconButtonClass, cn } from '../ui';

export interface CardItem {
  id: string;
  cardholderName: string;
  cardNumber: string;
  network: 'Visa' | 'Mastercard' | 'Amex' | 'Discover';
  lastFour: string;
  expMonth: string;
  expYear: string;
  nickname: string;
  isDefault: boolean;
  bgGradient: string;
}

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: CardItem) => void;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  onClose,
  onAddCard,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [nickname, setNickname] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState('');

  // Start from a clean form every time the dialog is opened
  useEffect(() => {
    if (!isOpen) return;
    setCardNumber('');
    setExpDate('');
    setCvc('');
    setName('');
    setBillingZip('');
    setNickname('');
    setIsDefault(false);
    setError('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setExpDate(raw);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = cardNumber.replace(/\s/g, '');

    if (cleanNumber.length < 15) {
      setError('Please enter a valid card number');
      return;
    }
    if (!expDate.includes('/') || expDate.length < 5) {
      setError('Please enter a valid expiration date (MM/YY)');
      return;
    }
    const [expMonthRaw, expYearRaw] = expDate.split('/');
    const monthNumber = Number(expMonthRaw);
    if (monthNumber < 1 || monthNumber > 12) {
      setError('Expiry month must be between 01 and 12');
      return;
    }
    const expiry = new Date(2000 + Number(expYearRaw), monthNumber, 0, 23, 59, 59);
    if (expiry.getTime() < Date.now()) {
      setError('This card has expired — please use a valid card');
      return;
    }
    if (cvc.length < 3) {
      setError('Please enter a valid security code (CVC)');
      return;
    }
    if (!name.trim()) {
      setError('Please enter the cardholder name');
      return;
    }

    const month = expMonthRaw;
    const year = expYearRaw;

    // Detect network
    let network: 'Visa' | 'Mastercard' | 'Amex' | 'Discover' = 'Visa';
    if (cleanNumber.startsWith('4')) network = 'Visa';
    else if (cleanNumber.startsWith('5')) network = 'Mastercard';
    else if (cleanNumber.startsWith('3')) network = 'Amex';
    else if (cleanNumber.startsWith('6')) network = 'Discover';

    const lastFour = cleanNumber.slice(-4);

    const newCard: CardItem = {
      id: `card-${Date.now()}`,
      cardholderName: name.trim(),
      cardNumber: cleanNumber,
      network,
      lastFour,
      expMonth: month,
      expYear: year,
      nickname: nickname.trim() || `${network} •••• ${lastFour}`,
      isDefault,
      bgGradient:
        network === 'Amex'
          ? 'from-slate-700 to-neutral-900'
          : network === 'Mastercard'
          ? 'from-orange-700 via-rose-800 to-amber-900'
          : 'from-blue-800 via-indigo-900 to-slate-900',
    };

    onAddCard(newCard);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-black/10 flex flex-col text-left max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className={cn(iconButtonClass(), 'absolute right-3 top-3')}
          aria-label="Close"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <use href="#close" />
          </svg>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <span className="material-icons text-xl">credit_card</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900">Add a consular payment method</h3>
            <p className="text-xs text-neutral-500">
              Card info is encrypted and tokenized for official consular fee processing.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Card number
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm tracking-wider"
                required
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <span className="material-icons text-base leading-none">lock</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Expiration (MM/YY)
              </label>
              <input
                type="text"
                value={expDate}
                onChange={handleExpChange}
                placeholder="MM/YY"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Security code (CVC)
              </label>
              <input
                type="password"
                maxLength={4}
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                placeholder="CVC"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Cardholder name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name as on card"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Billing postal code
              </label>
              <input
                type="text"
                value={billingZip}
                onChange={(e) => setBillingZip(e.target.value)}
                placeholder="ZIP / Postal code"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Nickname (optional)
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Travel card"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-300 cursor-pointer"
              />
              <span className="text-sm text-neutral-700 font-medium">
                Make this the default payment method for embassy fees and consular applications
              </span>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-colors shadow-sm active:scale-[0.98] cursor-pointer"
            >
              Save card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
