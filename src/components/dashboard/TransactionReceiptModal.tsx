import React from 'react';

export interface TransactionData {
  id: string;
  merchant: string;
  merchantLogo?: string;
  amount: number;
  date: string;
  time: string;
  cardName: string;
  lastFour: string;
  category: string;
  status: 'Completed' | 'Pending' | 'Declined';
  type: 'Contactless' | 'Online purchase' | 'In-app' | 'Subscription';
  location?: string;
  items?: { name: string; qty: number; price: number }[];
  deviceAccountNumber?: string;
}

interface TransactionReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionData | null;
}

export const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative border border-black/10 flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <use href="#close" />
          </svg>
        </button>

        {/* Merchant & Amount Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-xl font-bold text-neutral-700 shrink-0">
            {transaction.merchant.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900 leading-tight">
              {transaction.merchant}
            </h3>
            <p className="text-xs text-neutral-500">{transaction.category}</p>
          </div>
        </div>

        <div className="my-2 border-y border-neutral-100 py-4 flex items-baseline justify-between">
          <span className="text-sm font-medium text-neutral-500">Total amount</span>
          <span className="text-3xl font-bold text-neutral-900">
            ${Math.abs(transaction.amount).toFixed(2)}
          </span>
        </div>

        {/* Details List */}
        <div className="space-y-3.5 my-4 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Status</span>
            <span className="inline-flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              {transaction.status}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-500">Date & time</span>
            <span className="text-neutral-800 font-medium">
              {transaction.date} at {transaction.time}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-500">Payment method</span>
            <span className="text-neutral-800 font-medium flex items-center gap-1.5">
              <span className="material-icons text-base text-blue-600">credit_card</span>
              {transaction.cardName} •••• {transaction.lastFour}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-500">Type</span>
            <span className="text-neutral-800 font-medium flex items-center gap-1">
              <span className="material-icons text-sm text-neutral-600">contactless</span>
              {transaction.type}
            </span>
          </div>

          {transaction.location && (
            <div className="flex justify-between">
              <span className="text-neutral-500">Location</span>
              <span className="text-neutral-800 font-medium text-right">
                {transaction.location}
              </span>
            </div>
          )}

          {transaction.deviceAccountNumber && (
            <div className="flex justify-between">
              <span className="text-neutral-500">Virtual account</span>
              <span className="text-neutral-800 font-mono text-xs">
                •••• {transaction.deviceAccountNumber}
              </span>
            </div>
          )}
        </div>

        {/* Itemized breakdown if present */}
        {transaction.items && transaction.items.length > 0 && (
          <div className="mt-2 pt-3 border-t border-neutral-100">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Consular Fee Breakdown (from Embassy Confirmation)
            </p>
            <div className="space-y-1.5 text-xs">
              {transaction.items.map((item, i) => (
                <div key={i} className="flex justify-between text-neutral-700">
                  <span>
                    {item.qty}x {item.name}
                  </span>
                  <span className="font-medium">${(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => alert('Official consular fee receipt sent to your registered email address.')}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-icons text-sm">email</span>
            <span>Email consular receipt</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-full text-neutral-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
