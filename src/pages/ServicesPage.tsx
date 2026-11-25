import React, { useState } from 'react';
import { VISAHOBE_SERVICES, ServiceItem } from '../data/visahobeData';
import { Button, FilterChip, iconButtonClass, cn } from '../components/ui';

interface ServicesPageProps {
  onBookConsultation: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onBookConsultation }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'specialized' | 'corporate'>('all');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const filtered = activeCategory === 'all'
    ? VISAHOBE_SERVICES
    : VISAHOBE_SERVICES.filter((s) => s.category === activeCategory);

  return (
    <div className="ambient-wash mx-auto max-w-6xl space-y-16 animate-in fade-in px-4 py-10 text-left duration-300 sm:px-6 sm:py-16 lg:px-8">
      {/* Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 shadow-2xs">
          <span className="material-icons text-blue-600 text-sm">room_service</span>
          <span className="text-xs font-semibold text-[#1f1f1f] tracking-wide">
            Official Directory of Visa Support Services
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#202124] tracking-tight">
          VisaHOBe Services & Solutions
        </h1>
        <p className="text-base sm:text-lg text-[#5f6368] leading-relaxed">
          From first-time tourist applications to complex consular document attestation, explore
          our structured, transparent administrative services with strictly separated government and service fees.
        </p>
      </div>

      {/* Mandatory Fee Transparency Banner */}
      <div className="bg-[#e8f0fe] rounded-3xl p-6 sm:p-8 border border-[#d2e3fc] space-y-2">
        <div className="flex items-center gap-2 text-[#001d35]">
          <span className="material-icons text-[#0b57d0]">payments</span>
          <h2 className="text-lg font-bold">Strict Principle of Fee Segregation</h2>
        </div>
        <p className="text-xs sm:text-sm text-[#3c4043] leading-relaxed">
          VisaHOBe maintains total financial transparency: official government, embassy, and visa application center
          fees (e.g. U.S. MRV fee, Schengen processing fee, VFS biometric charge) are separate from VisaHOBe administrative
          consultancy fees. Embassy fees are collected directly via authorized consular channels and are accompanied by official receipts.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: 'All services', meta: VISAHOBE_SERVICES.length },
          {
            id: 'core',
            label: 'Core visa services',
            meta: VISAHOBE_SERVICES.filter((svc) => svc.category === 'core').length,
          },
          {
            id: 'specialized',
            label: 'Specialized & legalization',
            meta: VISAHOBE_SERVICES.filter((svc) => svc.category === 'specialized').length,
          },
          {
            id: 'corporate',
            label: 'Corporate & B2B',
            meta: VISAHOBE_SERVICES.filter((svc) => svc.category === 'corporate').length,
          },
        ].map((tab) => (
          <FilterChip
            key={tab.id}
            active={activeCategory === tab.id}
            onClick={() => setActiveCategory(tab.id as typeof activeCategory)}
            meta={tab.meta}
          >
            {tab.label}
          </FilterChip>
        ))}
      </div>

      {/* Services Grid with Contextual Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((service) => (
          <div
            key={service.id}
            onClick={() => setSelectedService(service)}
            className="glass glass-sheen group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_22px_44px_-26px_rgba(32,33,36,0.4)]"
          >
            {/* Card Image Header */}
            {service.imageUrl && (
              <div className="w-full h-44 overflow-hidden relative bg-neutral-100">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-[#001d35] px-2.5 py-1 rounded-full shadow-2xs">
                  {service.category}
                </span>
                <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-xs text-[#1a73e8] flex items-center justify-center shadow-md">
                  <span className="material-icons text-xl">{service.icon}</span>
                </div>
              </div>
            )}

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#202124] group-hover:text-[#1a73e8] transition-colors leading-snug">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5f6368] leading-relaxed line-clamp-3">
                  {service.shortDesc}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-medium">
                <span className="text-neutral-500 truncate max-w-[140px]">{service.turnaroundEstimate.split('(')[0]}</span>
                <span className="text-blue-600 font-semibold group-hover:underline flex items-center gap-1 shrink-0">
                  <span>View Full Scope</span>
                  <span className="material-icons text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comprehensive Service Standards & Quality Checklist */}
      <div className="glass glass-sheen rounded-3xl p-8 sm:p-10 space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#202124]">Our Document Pre-Screening Protocol</h2>
          <p className="text-sm text-[#5f6368] mt-1">Every application dossier undergoes our 4-point administrative quality check</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
            <span className="font-mono text-sm font-bold text-blue-600">Audit 01</span>
            <p className="font-bold text-neutral-900 text-sm">Identity & Validity</p>
            <p className="text-neutral-500">Checking 6-month validity, blank visa pages, and alignment with birth records and national IDs.</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
            <span className="font-mono text-sm font-bold text-blue-600">Audit 02</span>
            <p className="font-bold text-neutral-900 text-sm">Financial Consistency</p>
            <p className="text-neutral-500">Ensuring 6-month bank statements align seamlessly with salary slips, tax returns, and travel budgets.</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
            <span className="font-mono text-sm font-bold text-blue-600">Audit 03</span>
            <p className="font-bold text-neutral-900 text-sm">Itinerary Verifiability</p>
            <p className="text-neutral-500">Confirming hotel reservations, return flights, and local transit dates match day-by-day travel plans.</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
            <span className="font-mono text-sm font-bold text-blue-600">Audit 04</span>
            <p className="font-bold text-neutral-900 text-sm">Applicant Review Copy</p>
            <p className="text-neutral-500">Full PDF draft delivered to the applicant for explicit sign-off prior to official portal transmission.</p>
          </div>
        </div>
      </div>

      {/* Document attestation chain explanation */}
      <div className="glass glass-sheen rounded-3xl p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#202124]">Document Attestation Chain Guidance</h2>
        <p className="text-xs sm:text-sm text-[#5f6368] leading-relaxed">
          For educational degrees, marriage certificates, police clearances, and corporate documents destined for foreign embassies (e.g. UAE, Saudi Arabia, Kuwait, Qatar), documents must follow an authenticated statutory chain:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-2">
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
            <span className="font-bold text-blue-700">1. Notarization</span>
            <p className="text-neutral-500 mt-0.5">Certified by authorized Notary Public</p>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
            <span className="font-bold text-blue-700">2. Relevant Ministry</span>
            <p className="text-neutral-500 mt-0.5">Ministry of Education / Law</p>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
            <span className="font-bold text-blue-700">3. MOFA Bangladesh</span>
            <p className="text-neutral-500 mt-0.5">Consular Section Attestation</p>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
            <span className="font-bold text-blue-700">4. Target Embassy</span>
            <p className="text-neutral-500 mt-0.5">Final Consular Legalization Stamp</p>
          </div>
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="bg-white rounded-[32px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-black/10 max-h-[90vh] overflow-y-auto space-y-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedService(null)}
              className={cn(iconButtonClass(), 'absolute right-4 top-4 bg-white/85 backdrop-blur-xs shadow-xs')}
              aria-label="Close service details"
            >
              <span className="material-icons text-xl">close</span>
            </button>

            {/* Banner Image in Modal */}
            {selectedService.imageUrl && (
              <div className="w-full h-44 rounded-2xl overflow-hidden relative">
                <img
                  src={selectedService.imageUrl}
                  alt={selectedService.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-bold text-white bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
                  {selectedService.category.toUpperCase()} SERVICE
                </span>
              </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-3 pr-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-icons text-2xl">{selectedService.icon}</span>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#202124]">
                  {selectedService.title}
                </h3>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                  {selectedService.category} Service Scope
                </p>
              </div>
            </div>

            <p className="text-sm text-[#5f6368] leading-relaxed">
              {selectedService.shortDesc}
            </p>

            {/* Included & Excluded Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  What is Included
                </p>
                <ul className="space-y-1.5 text-xs text-emerald-950">
                  {selectedService.included.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="material-icons text-emerald-600 text-sm mt-0.5">check</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-2">
                <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                  What is Excluded
                </p>
                <ul className="space-y-1.5 text-xs text-rose-950">
                  {selectedService.excluded.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="material-icons text-rose-600 text-sm mt-0.5">close</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Customer Responsibilities */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
              <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Applicant Responsibilities & Undertakings
              </p>
              <ul className="space-y-1 text-xs text-neutral-600">
                {selectedService.customerResponsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="material-icons text-neutral-400 text-xs mt-0.5">circle</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fees and Timelines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                <p className="font-semibold text-blue-900">Estimated Turnaround</p>
                <p className="text-blue-700 mt-0.5">{selectedService.turnaroundEstimate}</p>
              </div>
              <div className="p-3 bg-neutral-100/70 rounded-xl border border-neutral-200">
                <p className="font-semibold text-neutral-800">Fee Structure Note</p>
                <p className="text-neutral-600 mt-0.5">{selectedService.officialFeeNote}</p>
              </div>
            </div>

            {/* Disclaimer & Action */}
            <div className="flex flex-col gap-4 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-[11px] leading-relaxed text-[#70757a]">
                {selectedService.disclaimer}
              </p>
              <Button
                variant="primary"
                size="lg"
                leadingIcon="calendar_month"
                onClick={() => {
                  setSelectedService(null);
                  onBookConsultation();
                }}
                className="w-full sm:w-auto"
              >
                Book This Service
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
