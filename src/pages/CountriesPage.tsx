import React, { useState, useMemo, useEffect } from 'react';
import {
  ALL_COUNTRIES,
  ComprehensiveCountryData,
  generate29PointCountryReport,
} from '../data/allCountriesData';
import { Button, CountryFlag, FilterChip, SearchInput } from '../components/ui';

interface CountriesPageProps {
  /** Country name to open straight away (used by the home page destination picker) */
  initialCountryName?: string;
  onBookConsultation: (country?: string) => void;
  onOpenPortal: () => void;
}

export const CountriesPage: React.FC<CountriesPageProps> = ({
  initialCountryName,
  onBookConsultation,
  onOpenPortal,
}) => {
  const [search, setSearch] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'eVisa' | 'voa' | 'sticker'>('all');
  const [activeCountry, setActiveCountry] = useState<ComprehensiveCountryData | null>(() => {
    if (!initialCountryName) return null;
    const match = ALL_COUNTRIES.find(
      (c) => c.name.toLowerCase() === initialCountryName.toLowerCase()
    );
    return match ?? null;
  });
  const [reportTab, setReportTab] = useState<'all' | 'checklist' | 'process' | 'faqs'>('all');

  // Counts are derived from the dataset so the labels can never drift again
  const countByContinent = ALL_COUNTRIES.reduce<Record<string, number>>((acc, country) => {
    acc[country.continent] = (acc[country.continent] ?? 0) + 1;
    return acc;
  }, {});

  const continents = [
    { id: 'all', label: `All Countries (${ALL_COUNTRIES.length})` },
    ...(['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania'] as const).map(
      (continent) => ({
        id: continent,
        label: `${continent} (${countByContinent[continent] ?? 0})`,
      })
    ),
  ];

  const filteredCountries = useMemo(() => {
    return ALL_COUNTRIES.filter((c) => {
      const query = search.toLowerCase().trim();
      const matchesSearch =
        c.name.toLowerCase().includes(query) ||
        c.capital.toLowerCase().includes(query) ||
        c.visaTypeSummary.toLowerCase().includes(query);

      const matchesContinent =
        selectedContinent === 'all' || c.continent === selectedContinent;

      let matchesType = true;
      if (filterType === 'eVisa') matchesType = c.eVisaAvailable;
      if (filterType === 'voa') matchesType = c.visaOnArrival;
      if (filterType === 'sticker') matchesType = !c.eVisaAvailable && !c.visaOnArrival;

      return matchesSearch && matchesContinent && matchesType;
    });
  }, [search, selectedContinent, filterType]);

  const activeReport = useMemo(() => {
    if (!activeCountry) return null;
    return generate29PointCountryReport(activeCountry);
  }, [activeCountry]);

  // Close the country report with Escape and lock background scrolling while it is open
  useEffect(() => {
    if (!activeCountry) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveCountry(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeCountry]);

  // The report sub-tabs now actually filter which point groups are rendered
  const showProcess = reportTab === 'all' || reportTab === 'process';
  const showChecklist = reportTab === 'all' || reportTab === 'checklist';
  const showFaqs = reportTab === 'all' || reportTab === 'faqs';

  return (
    <div className="ambient-wash mx-auto max-w-7xl animate-in space-y-10 px-4 py-10 text-left fade-in duration-300 sm:px-6 sm:py-16 lg:px-8">
      {/* Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 shadow-2xs">
          <span className="material-icons text-blue-600 text-sm">public</span>
          <span className="text-xs font-semibold text-[#1f1f1f] tracking-wide">
            {ALL_COUNTRIES.length} Countries Global Visa Database for Bangladeshi Citizens
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#202124] tracking-tight">
          Global Visa Guides from Bangladesh
        </h1>
        <p className="text-base sm:text-lg text-[#5f6368] leading-relaxed">
          Comprehensive 29-point consular requirements, official embassy fees, verified document
          checklists, e-visa routes, and interview guidelines for Bangladeshi passport holders.
        </p>
      </div>

      {/* Dataset snapshot */}
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[
          { icon: 'public', value: `${ALL_COUNTRIES.length}`, label: 'Countries covered' },
          {
            icon: 'newspaper',
            value: `${new Set(ALL_COUNTRIES.map((c) => c.continent)).size}`,
            label: 'Continents',
          },
          {
            icon: 'bolt',
            value: `${ALL_COUNTRIES.filter((c) => c.eVisaAvailable).length}`,
            label: 'E-visa routes',
          },
          {
            icon: 'flight_land',
            value: `${ALL_COUNTRIES.filter((c) => c.visaOnArrival).length}`,
            label: 'Visa on arrival',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-thin flex items-center gap-2.5 rounded-2xl px-3 py-2.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#e8f0fe] text-[#1a73e8]">
              <span className="material-icons text-[16px] leading-none">{stat.icon}</span>
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-bold leading-none text-[#202124]">
                {stat.value}
              </span>
              <span className="mt-1 block truncate text-[10px] font-semibold uppercase tracking-[0.06em] text-[#80868b]">
                {stat.label}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* Control Bar: Search & Quick Type Filters */}
      <div className="glass glass-sheen rounded-3xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by country, capital, or visa type…"
            label="Country search"
            className="md:w-96"
          />

          {/* Quick visa type filters */}
          <div className="flex w-full items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 md:w-auto">
            {([
              { id: 'all', label: 'All entry regimes' },
              { id: 'eVisa', label: 'E-Visa available' },
              { id: 'voa', label: 'Visa on arrival' },
              { id: 'sticker', label: 'Consular sticker' },
            ] as const).map((f) => (
              <FilterChip
                key={f.id}
                active={filterType === f.id}
                onClick={() => setFilterType(f.id)}
              >
                {f.label}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* Continent filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-black/[0.06] pt-3">
          {continents.map((cont) => (
            <FilterChip
              key={cont.id}
              active={selectedContinent === cont.id}
              onClick={() => setSelectedContinent(cont.id)}
            >
              {cont.label}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
        <span>Showing <strong>{filteredCountries.length}</strong> countries</span>
        <span>Click any country to view the complete 29-point consular profile</span>
      </div>

      {/* Countries Cards Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:gap-5">
        {filteredCountries.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setReportTab('all');
              setActiveCountry(c);
            }}
            className="glass glass-sheen group flex h-full cursor-pointer flex-col rounded-2xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_22px_44px_-26px_rgba(32,33,36,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/60"
            aria-label={`Open the 29-point ${c.name} visa report`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <CountryFlag flag={c.flag} name={c.name} size="lg" />
                <div className="min-w-0">
                  <h3 className="truncate text-[14.5px] font-bold leading-tight text-[#202124] transition-colors group-hover:text-[#0b57d0]">
                    {c.name}
                  </h3>
                  <p className="mt-0.5 truncate text-[11px] text-[#80868b]">{c.capital}</p>
                </div>
              </div>

              <span className="shrink-0 rounded-full bg-[#f1f4f9] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-[#5f6368]">
                {c.continent}
              </span>
            </div>

            <dl className="mt-3 space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-[10.5px] uppercase tracking-[0.04em] text-[#9aa0a6]">Entry</dt>
                <dd className="max-w-[9.5rem] truncate text-right text-[11px] font-semibold text-[#3c4043]">
                  {c.visaTypeSummary}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-[10.5px] uppercase tracking-[0.04em] text-[#9aa0a6]">Apply at</dt>
                <dd className="max-w-[9.5rem] truncate text-right text-[11px] font-medium text-[#5f6368]">
                  {c.submissionLocation}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-[10.5px] uppercase tracking-[0.04em] text-[#9aa0a6]">Takes</dt>
                <dd className="text-right text-[11px] font-medium text-[#5f6368]">{c.processingTime}</dd>
              </div>
            </dl>

            <div className="mt-3 flex items-center justify-between border-t border-black/[0.05] pt-2.5 text-[11px] font-semibold text-[#0b57d0]">
              <span>29-point guide</span>
              <span className="material-icons text-[15px] leading-none transition-transform duration-200 group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* 29-Point Complete Official Country Modal */}
      {activeCountry && activeReport && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 backdrop-blur-md animate-in fade-in sm:items-center sm:p-5"
          onClick={() => setActiveCountry(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="glass-panel relative flex h-[100dvh] w-full max-w-4xl animate-in slide-in-from-bottom-4 flex-col overflow-hidden rounded-t-[24px] text-left sm:h-auto sm:max-h-[92vh] sm:rounded-[32px] sm:slide-in-from-bottom-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar with Thematic Visual */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#001d35] via-[#0b57d0] to-[#1a73e8] text-white p-6 sm:p-7">
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/10 shadow-inner backdrop-blur-md">
                    <CountryFlag flag={activeCountry.flag} name={activeCountry.name} size="lg" className="!h-11 !w-[60px] !rounded-md ring-white/40" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {activeCountry.name}
                      </h2>
                      <span className="text-xs bg-white/20 text-white font-semibold px-3 py-0.5 rounded-full border border-white/25 backdrop-blur-xs">
                        {activeCountry.continent}
                      </span>
                      <span className="text-xs bg-emerald-500/90 text-white font-semibold px-2.5 py-0.5 rounded-full">
                        {activeCountry.visaTypeSummary}
                      </span>
                    </div>
                    <p className="text-xs text-blue-100 font-medium mt-1">
                      Capital: {activeCountry.capital} • Currency: {activeCountry.currency} • {activeReport.latestUpdateDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full cursor-pointer hidden sm:block transition-colors"
                    title="Print official report"
                  >
                    <span className="material-icons text-xl">print</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCountry(null)}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full cursor-pointer transition-colors"
                    aria-label="Close"
                  >
                    <span className="material-icons text-2xl">close</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Report tabs */}
            <div className="border-b border-black/[0.06] bg-white/95 px-4 py-2.5 backdrop-blur sm:px-6">
              <div
                className="flex items-center gap-1.5 overflow-x-auto no-scrollbar"
                role="tablist"
                aria-label="Report sections"
              >
                {[
                  { id: 'all', label: 'Full 29-point report', icon: 'description' },
                  { id: 'checklist', label: 'Document Checklist', icon: 'checklist' },
                  { id: 'process', label: 'Steps & fees', icon: 'timeline' },
                  { id: 'faqs', label: 'Refusals & FAQs', icon: 'help_outline' },
                ].map((tab) => {
                  const isActive = reportTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setReportTab(tab.id as typeof reportTab)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold whitespace-nowrap transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/60 ${
                        isActive
                          ? 'bg-[#0b57d0] text-white shadow-xs'
                          : 'text-[#5f6368] hover:bg-black/[0.05] hover:text-[#202124]'
                      }`}
                    >
                      <span className="material-icons text-[15px] leading-none">{tab.icon}</span>
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Modal Body: Full 29-Point Structure */}
            <div className="flex-1 space-y-8 overflow-y-auto p-5 text-sm leading-relaxed text-[#3c4043] sm:p-8">
              {showProcess && (
                <>
                  {/* Point 1: Country Overview */}
              <section className="space-y-2">
                <h3 className="font-bold text-base text-[#202124] flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">1</span>
                  <span>Country Overview</span>
                </h3>
                <p className="text-neutral-600 pl-6">{activeReport.countryOverview}</p>
              </section>
                </>
              )}

              {showProcess && (
                <>
                  {/* Point 2: Do Bangladeshi Citizens Need a Visa? */}
              <section className="space-y-2">
                <h3 className="font-bold text-base text-[#202124] flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">2</span>
                  <span>Do Bangladeshi Citizens Need a Visa?</span>
                </h3>
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 ml-6 text-xs text-blue-950 font-medium">
                  {activeReport.doBDBitizensNeedVisa}
                </div>
              </section>
                </>
              )}

              {showProcess && (
                <>
                  {/* Point 3 & 4: Visa Types & Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-6">
                <div className="space-y-2 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                    3. Official Visa Types
                  </h4>
                  <ul className="space-y-1 text-xs text-neutral-600">
                    {activeReport.visaTypes.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="material-icons text-blue-600 text-xs mt-0.5">check</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                    4. Visa Categories & Entries
                  </h4>
                  <ul className="space-y-1 text-xs text-neutral-600">
                    {activeReport.visaCategories.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="material-icons text-blue-600 text-xs mt-0.5">check</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
                </>
              )}

              {showProcess && (
                <>
                  {/* Point 5, 6, 7, 8, 9: Clearance & Submission Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-6 text-xs">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <p className="text-neutral-400 font-semibold">5. E-Visa Availability</p>
                  <p className="font-semibold text-neutral-800 mt-0.5">{activeReport.eVisaAvailability}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <p className="text-neutral-400 font-semibold">6. Visa on Arrival</p>
                  <p className="font-semibold text-neutral-800 mt-0.5">{activeReport.visaOnArrivalAvailability}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <p className="text-neutral-400 font-semibold">7. Submission Channel</p>
                  <p className="font-semibold text-neutral-800 mt-0.5">{activeReport.submissionRequirement}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <p className="text-neutral-400 font-semibold">8. Biometric Mandate</p>
                  <p className="font-semibold text-neutral-800 mt-0.5">{activeReport.biometricRequirement}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <p className="text-neutral-400 font-semibold">9. Consular Interview</p>
                  <p className="font-semibold text-neutral-800 mt-0.5">{activeReport.interviewRequirement}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <p className="text-neutral-400 font-semibold">10. Passport Validity</p>
                  <p className="font-semibold text-neutral-800 mt-0.5">{activeReport.passportValidity}</p>
                </div>
              </div>
                </>
              )}

              {showProcess && (
                <>
                  {/* Point 11, 12, 13: Photo, Bank & Travel History */}
              <div className="space-y-4 pl-6">
                <div className="p-4 bg-white rounded-2xl border border-neutral-200 space-y-1">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                    11. Photograph Specifications
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">{activeReport.photoRequirements}</p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-neutral-200 space-y-1">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                    12. Bank Statement & Solvency Rules
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">{activeReport.bankStatementRequirements}</p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-neutral-200 space-y-1">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                    13. Travel History Guidance
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">{activeReport.travelHistoryRequirements}</p>
                </div>
              </div>
                </>
              )}

              {showProcess && (
                <>
                  {/* Point 14 & 15: Invitation & Sponsor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 text-xs">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
                  <h4 className="font-bold text-neutral-800">14. Invitation Letter Protocol</h4>
                  <p className="text-neutral-600 leading-relaxed">{activeReport.invitationLetterRequirements}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
                  <h4 className="font-bold text-neutral-800">15. Sponsor Requirements</h4>
                  <p className="text-neutral-600 leading-relaxed">{activeReport.sponsorRequirements}</p>
                </div>
              </div>
                </>
              )}

              {showChecklist && (
                <>
                  {/* Point 16 & 17: Employment & Educational Documents */}
              <div className="space-y-4 pl-6">
                <div className="p-4 bg-white rounded-2xl border border-neutral-200 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                    16. Employment Documents by Profession
                  </h4>
                  <ul className="space-y-1.5 text-xs text-neutral-600">
                    {activeReport.employmentDocuments.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="material-icons text-blue-600 text-xs mt-0.5">badge</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-neutral-200 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                    17. Educational Documents
                  </h4>
                  <ul className="space-y-1.5 text-xs text-neutral-600">
                    {activeReport.educationalDocuments.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="material-icons text-blue-600 text-xs mt-0.5">school</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
                </>
              )}

              {showProcess && (
                <>
                  {/* Point 18 & 19: Application Process & Appointment */}
              <div className="p-5 bg-[#f0f4f9] rounded-2xl border border-neutral-200 space-y-3 pl-6">
                <h4 className="font-bold text-sm text-[#001d35]">
                  18. Step-by-Step Application Process
                </h4>
                <div className="space-y-2 text-xs text-[#001d35]">
                  {activeReport.applicationProcess.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-neutral-200/80 text-xs">
                  <strong>19. Appointment Procedure:</strong> {activeReport.appointmentProcess}
                </div>
              </div>
                </>
              )}

              {showProcess && (
                <>
                  {/* Point 20, 21, 22: Processing, Fees & Separation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-6 text-xs">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="font-bold text-amber-900">20. Processing Time</p>
                  <p className="text-amber-800 mt-0.5">{activeReport.processingTime}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="font-bold text-blue-900">21. Embassy / VFS Fee</p>
                  <p className="text-blue-800 mt-0.5">{activeReport.embassyFee}</p>
                </div>
                <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-200">
                  <p className="font-bold text-neutral-900">22. Agency Service Fee</p>
                  <p className="text-neutral-700 mt-0.5">{activeReport.agencyServiceFee}</p>
                </div>
              </div>
                </>
              )}

              {showFaqs && (
                <>
                  {/* Point 23: Common Refusal Reasons */}
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2 pl-6">
                <h4 className="font-bold text-xs uppercase tracking-wider text-rose-900">
                  23. Common Refusal Reasons to Avoid
                </h4>
                <ul className="space-y-1.5 text-xs text-rose-950">
                  {activeReport.commonRefusalReasons.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="material-icons text-rose-600 text-xs mt-0.5">warning</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
                </>
              )}

              {showChecklist && (
                <>
                  {/* Point 24: Required Documents Checklist */}
              <div className="p-5 bg-white rounded-2xl border-2 border-blue-200 space-y-2 pl-6 shadow-xs">
                <h4 className="font-bold text-sm text-[#202124] uppercase tracking-wider flex items-center gap-2">
                  <span className="material-icons text-blue-600">checklist</span>
                  <span>24. Master Document Checklist</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700 pt-1">
                  {activeReport.documentsChecklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="material-icons text-emerald-600 text-sm mt-0.5">check_circle</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
                </>
              )}

              {showFaqs && (
                <>
                  {/* Point 28: FAQs */}
              <div className="space-y-3 pl-6">
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                  28. Frequently Asked Questions
                </h4>
                <div className="space-y-2">
                  {activeReport.faqs.map((f, idx) => (
                    <div key={idx} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1 text-xs">
                      <p className="font-bold text-neutral-900">{f.question}</p>
                      <p className="text-neutral-600">{f.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
                </>
              )}

              {showFaqs && (
                <>
                  {/* Point 29: Disclaimer */}
                  <div className="p-4 rounded-2xl bg-neutral-100 text-xs text-neutral-500 pl-6 leading-relaxed border border-neutral-200">
                    <strong>29. Statutory Disclaimer:</strong> {activeReport.disclaimer}
                  </div>
                </>
              )}
            </div>

            {/* Modal sticky action bar */}
            <div className="flex flex-col gap-3 border-t border-neutral-200 bg-[#f8fafd] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                <span className="material-icons text-sm leading-none text-emerald-600">verified</span>
                <span>{activeReport.latestUpdateDate}</span>
              </div>

              <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setActiveCountry(null);
                    onOpenPortal();
                  }}
                  className="w-full sm:w-auto"
                  aria-label="Open the client portal"
                >
                  Open Client Portal
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  leadingIcon="calendar_month"
                  onClick={() => {
                    const countryName = activeCountry.name;
                    setActiveCountry(null);
                    onBookConsultation(countryName);
                  }}
                  className="w-full sm:w-auto"
                >
                  Book for {activeCountry.name}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
