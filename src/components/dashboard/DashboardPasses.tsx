import React, { useState } from 'react';
import { DashboardPassItem } from '../../data/dashboardMockData';

interface DashboardPassesProps {
  passes: DashboardPassItem[];
  onSelectPass: (pass: DashboardPassItem) => void;
}

export const DashboardPasses: React.FC<DashboardPassesProps> = ({ passes, onSelectPass }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'boarding' | 'loyalty' | 'ticket' | 'offer'>('all');

  const filteredPasses = activeCategory === 'all'
    ? passes
    : passes.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-6 text-left max-w-5xl animate-in fade-in duration-300">
      {/* Title */}
      <div className="space-y-1 pb-2">
        <h2 className="font-['Google_Sans',Roboto,sans-serif] text-3xl sm:text-4xl font-normal text-[#1f1f1f]">
          Visas & Consular Passes
        </h2>
        <p className="text-sm text-[#444746] leading-relaxed max-w-xl">
          View your approved international travel visas, multiple-entry foils, and embassy
          appointment passes.
        </p>
      </div>

      {/* Category Filter Chips (Material 3 style) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: 'All Visas & Passes' },
          { id: 'boarding', label: 'Tourist & Business Visas' },
          { id: 'loyalty', label: 'Schengen & EU Visas' },
          { id: 'ticket', label: 'Embassy Appointment Slips' },
          { id: 'offer', label: 'e-Visas & Digital Status' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveCategory(tab.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-[#c2e7ff] text-[#001d35] font-semibold shadow-2xs'
                : 'bg-white text-[#444746] hover:bg-neutral-100 border border-neutral-200/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notice Callout */}
      <div className="bg-[#e8f0fe] border border-[#d2e3fc] rounded-2xl px-4 py-3 flex items-center gap-3 text-xs text-[#001d35]">
        <span className="material-icons text-[#0b57d0] text-lg">verified_user</span>
        <span>
          Approved travel visas, Schengen authorizations, and consular interview slips stored here
          can be presented directly to airline check-in staff, embassy security, and border control.
        </span>
      </div>

      {/* Passes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPasses.map((pass) => (
          <div
            key={pass.id}
            onClick={() => onSelectPass(pass)}
            className="bg-white rounded-[28px] border border-black/5 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            {/* Header banner */}
            <div
              className={`p-5 bg-gradient-to-r ${pass.bgColor} ${pass.textColor} flex items-center justify-between`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-icons text-xl">{pass.icon}</span>
                <span className="text-xs font-bold uppercase tracking-wider opacity-90 truncate max-w-[150px]">
                  {pass.issuer}
                </span>
              </div>
              {pass.badge && (
                <span className="text-[11px] font-bold bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                  {pass.badge}
                </span>
              )}
            </div>

            {/* Pass Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-['Google_Sans',Roboto,sans-serif] font-medium text-neutral-900 text-base mb-1">
                  {pass.title}
                </h4>
                <p className="text-xs text-neutral-600 font-medium">{pass.seatOrNumber}</p>
                <p className="text-xs text-[#444746] mt-1">{pass.expiryDate}</p>
              </div>

              {/* Show barcode button */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-xs text-neutral-500">
                  {pass.codeType === 'barcode' ? 'ICAO Barcode' : 'Consular Aztec QR'}
                </span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0b57d0] group-hover:underline cursor-pointer"
                >
                  <span className="material-icons text-base">
                    {pass.codeType === 'barcode' ? 'line_weight' : 'qr_code'}
                  </span>
                  <span>View visa code</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
