import React, { useState, useMemo, useEffect } from 'react';
import {
  ALL_COUNTRIES,
  ComprehensiveCountryData,
  generate29PointCountryReport,
} from '../data/allCountriesData';

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
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-10 animate-in fade-in duration-300">
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

      {/* Control Bar: Search & Quick Type Filters */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-black/5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by country, capital, or visa type..."
              className="w-full bg-[#f8fafd] pl-11 pr-4 py-3 rounded-full border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8] shadow-inner"
            />
            <div className="absolute left-4 top-3.5 text-neutral-400">
              <span className="material-icons text-lg">search</span>
            </div>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-3 text-neutral-400 hover:text-black cursor-pointer"
              >
                <span className="material-icons text-base">close</span>
              </button>
            )}
          </div>

          {/* Quick Visa Type Badges */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
            {[
              { id: 'all', label: 'All Entry Regimes' },
              { id: 'eVisa', label: 'E-Visa Available' },
              { id: 'voa', label: 'Visa on Arrival' },
              { id: 'sticker', label: 'Consular Sticker Visa' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterType(f.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterType === f.id
                    ? 'bg-[#1a73e8] text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Continents Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-neutral-100">
          {continents.map((cont) => (
            <button
              key={cont.id}
              type="button"
              onClick={() => setSelectedContinent(cont.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedContinent === cont.id
                  ? 'bg-[#001d35] text-white font-bold shadow-xs'
                  : 'text-[#444746] hover:bg-neutral-100'
              }`}
            >
              {cont.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
        <span>Showing <strong>{filteredCountries.length}</strong> countries</span>
        <span>Click any country to view the complete 29-point consular profile</span>
      </div>

      {/* Countries Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredCountries.map((c) => (
          <div
            key={c.id}
            onClick={() => {
              setReportTab('all');
              setActiveCountry(c);
            }}
            className="bg-white rounded-3xl p-5 border border-black/5 shadow-xs hover:shadow-md hover:border-blue-400/60 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{c.flag}</span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase">
                  {c.continent}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#202124] group-hover:text-[#1a73e8] transition-colors leading-snug">
                  {c.name}
                </h3>
                <p className="text-xs text-neutral-500">Capital: {c.capital}</p>
              </div>

              {/* Status Pills */}
              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex items-center justify-between text-neutral-600">
                  <span className="text-[11px] text-neutral-400">Entry Regime:</span>
                  <span className="font-semibold text-neutral-800 text-[11px] text-right truncate max-w-[130px]">
                    {c.visaTypeSummary}
                  </span>
                </div>

                <div className="flex items-center justify-between text-neutral-600">
                  <span className="text-[11px] text-neutral-400">Submission:</span>
                  <span className="font-medium text-[11px] text-neutral-700 truncate max-w-[130px]">
                    {c.submissionLocation}
                  </span>
                </div>

                <div className="flex items-center justify-between text-neutral-600">
                  <span className="text-[11px] text-neutral-400">Processing:</span>
                  <span className="font-medium text-[11px] text-neutral-700">
                    {c.processingTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span className="group-hover:underline">29-Point Guide</span>
              <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 29-Point Complete Official Country Modal */}
      {activeCountry && activeReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setActiveCountry(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-[32px] max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl relative border border-black/10 flex flex-col text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar with Thematic Visual */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#001d35] via-[#0b57d0] to-[#1a73e8] text-white p-6 sm:p-7">
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner border border-white/20 shrink-0">
                    {activeCountry.flag}
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

            {/* Sub-Tabs Inside Modal */}
            <div className="px-6 py-2.5 bg-white border-b border-neutral-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'Full 29-Point Report' },
                { id: 'checklist', label: 'Document Checklist' },
                { id: 'process', label: 'Application Steps & Fees' },
                { id: 'faqs', label: 'Refusals & FAQs' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setReportTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    reportTab === tab.id
                      ? 'bg-[#1a73e8] text-white shadow-2xs'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable Modal Body: Full 29-Point Structure */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-sm text-[#3c4043] leading-relaxed">
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

            {/* Modal Sticky Footer Action Bar (Points 26 & 27: CTAs) */}
            <div className="p-4 sm:p-5 bg-[#f8fafd] border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-neutral-500">
                <span>{activeReport.latestUpdateDate}</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Open the client portal */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveCountry(null);
                    onOpenPortal();
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 font-medium text-xs cursor-pointer shadow-xs"
                >
                  Open Client Portal
                </button>

                {/* Book a consultation for this country */}
                <button
                  type="button"
                  onClick={() => {
                    const countryName = activeCountry.name;
                    setActiveCountry(null);
                    onBookConsultation(countryName);
                  }}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium text-xs cursor-pointer shadow-sm"
                >
                  Book Consultation for {activeCountry.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
