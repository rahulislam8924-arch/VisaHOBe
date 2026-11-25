import React, { useState } from 'react';
import { TransactionData } from './TransactionReceiptModal';

interface DashboardTransactionsProps {
  transactions: TransactionData[];
  onSelectTransaction: (tx: TransactionData) => void;
}

export const DashboardTransactions: React.FC<DashboardTransactionsProps> = ({
  transactions,
  onSelectTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.cardName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === 'all' ||
      (selectedType === 'mrv' && (tx.category.toLowerCase().includes('fee') || tx.merchant.toLowerCase().includes('state') || tx.merchant.toLowerCase().includes('immigration'))) ||
      (selectedType === 'biometrics' && (tx.category.toLowerCase().includes('biometric') || tx.merchant.toLowerCase().includes('vfs'))) ||
      (selectedType === 'courier' && (tx.category.toLowerCase().includes('courier') || tx.merchant.toLowerCase().includes('fedex') || tx.category.toLowerCase().includes('delivery')));

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 text-left max-w-4xl animate-in fade-in duration-300">
      {/* Title */}
      <div className="space-y-1 pb-2">
        <h2 className="font-['Google_Sans',Roboto,sans-serif] text-3xl sm:text-4xl font-normal text-[#1f1f1f]">
          Consular Transactions & Fee History
        </h2>
        <p className="text-sm text-[#444746] leading-relaxed max-w-xl">
          Official embassy visa application fees, biometric appointments, and passport courier
          charges settled through the VisaHOBe Portal.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search bar */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search embassy fees, case numbers..."
            className="w-full bg-white pl-10 pr-4 py-2.5 rounded-full border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b57d0] shadow-2xs"
          />
          <div className="absolute left-3.5 top-3 text-neutral-400">
            <span className="material-icons text-lg">search</span>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-neutral-400 hover:text-black cursor-pointer"
            >
              <span className="material-icons text-base">close</span>
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Transactions' },
            { id: 'mrv', label: 'Embassy MRV Fees' },
            { id: 'biometrics', label: 'Biometrics & VAC' },
            { id: 'courier', label: 'Courier & Logistics' },
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelectedType(type.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedType === type.id
                  ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                  : 'bg-white text-[#444746] hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="glass glass-sheen rounded-[28px]  shadow-xs divide-y divide-neutral-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            <span className="material-icons text-4xl text-neutral-300 mb-2">receipt_long</span>
            <p className="text-sm">No consular transactions found</p>
          </div>
        ) : (
          filtered.map((tx) => (
            <div
              key={tx.id}
              onClick={() => onSelectTransaction(tx)}
              className="p-4 sm:p-5 hover:bg-neutral-50/80 transition-colors cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-full bg-blue-50 text-[#0b57d0] flex items-center justify-center font-bold shrink-0 border border-blue-100">
                  <span className="material-icons text-lg">account_balance</span>
                </div>
                <div className="min-w-0">
                  <p className="font-['Google_Sans',Roboto,sans-serif] text-sm sm:text-base font-medium text-neutral-900 truncate">
                    {tx.merchant}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#444746] mt-0.5">
                    <span>
                      {tx.date} • {tx.time}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-xs text-neutral-500">credit_card</span>
                      {tx.cardName} •••• {tx.lastFour}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-[#0b57d0]">{tx.category}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm sm:text-base font-bold text-neutral-900">
                  -${Math.abs(tx.amount).toFixed(2)}
                </p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-medium text-emerald-600">
                    {tx.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-white/70 rounded-2xl text-xs text-[#444746] leading-relaxed border border-black/5">
        Consular transactions include official embassy application charges (such as DS-160 MRV fees,
        Schengen visa processing charges), biometric appointments at Visa Application Centers
        (VAC/VFS), and certified tamper-evident passport courier return services.
      </div>
    </div>
  );
};
