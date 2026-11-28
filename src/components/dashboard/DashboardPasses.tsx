import React, { useState } from 'react';
import { DashboardPassItem } from '../../data/dashboardMockData';
import {
  getApplicationStatus,
  parsePassDate,
  STATUS_LABEL,
} from '../../lib/portalMetrics';

interface DashboardPassesProps {
  passes: DashboardPassItem[];
  onSelectPass: (pass: DashboardPassItem) => void;
}

export const DashboardPasses: React.FC<DashboardPassesProps> = ({ passes, onSelectPass }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'boarding' | 'loyalty' | 'ticket' | 'offer'>('all');

  const filteredPasses = activeCategory === 'all'
    ? passes
    : passes.filter((p) => p.category === activeCategory);

  const countFor = (id: string) =>
    id === 'all' ? passes.length : passes.filter((p) => p.category === id).length;

  const soonCutoff = new Date(Date.now() + 1000 * 60 * 60 * 24 * 180);

  return (
    <div className="space-y-6 text-left max-w-5xl animate-in fade-in duration-300">
      {/* Title */}
      <div className="space-y-1 pb-2">
        <h2 className="font-['Google_Sans',Roboto,sans-serif] text-3xl sm:text-4xl font-normal text-[#1f1f1f]">
          My Applications
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
            <span
              className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                activeCategory === tab.id
                  ? 'bg-white/70 text-[#001d35]'
                  : 'bg-neutral-100 text-[#5f6368]'
              }`}
            >
              {countFor(tab.id)}
            </span>
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
      {filteredPasses.length === 0 && (
        <div className="glass-flat glass-sheen rounded-[28px] p-10 text-center shadow-xs">
          <span className="material-icons text-4xl text-neutral-300">folder_off</span>
          <p className="mt-2 text-sm text-[#444746]">
            {passes.length === 0
              ? 'No visa applications on file yet.'
              : 'No records in this category — try another filter.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPasses.map((pass) => (
          <div
            key={pass.id}
            onClick={() => onSelectPass(pass)}
            className="glass-flat glass-sheen rounded-[28px]  overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
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
                {(() => {
                  const status = getApplicationStatus(pass);
                  const expiry = parsePassDate(pass.expiryDate);
                  const soon = Boolean(expiry && expiry > new Date() && expiry <= soonCutoff);
                  const tone =
                    status === 'expired'
                      ? 'bg-neutral-100 text-neutral-600'
                      : soon
                      ? 'bg-amber-50 text-amber-700'
                      : status === 'scheduled'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-emerald-50 text-emerald-700';
                  return (
                    <span
                      className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${tone}`}
                    >
                      <span className="material-icons text-[11px]">
                        {status === 'expired' ? 'event_busy' : soon ? 'schedule' : 'verified'}
                      </span>
                      {status === 'expired' ? 'Expired' : soon ? 'Expires soon' : STATUS_LABEL[status]}
                    </span>
                  );
                })()}
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
