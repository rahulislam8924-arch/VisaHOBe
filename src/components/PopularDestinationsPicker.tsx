import React from 'react';
import { ALL_COUNTRIES } from '../data/allCountriesData';

interface PopularDestinationsPickerProps {
  onSelectCountry: (countryName: string) => void;
  onViewAllCountries: () => void;
}

export const PopularDestinationsPicker: React.FC<PopularDestinationsPickerProps> = ({
  onSelectCountry,
  onViewAllCountries,
}) => {
  const topCountries = ALL_COUNTRIES.filter((c) => c.popularDestination).slice(0, 10);

  return (
    <section className="py-6 px-4 sm:px-6 max-w-6xl mx-auto text-left" aria-label="Popular Visa Destinations">
      <div className="bg-white/80 rounded-3xl p-5 sm:p-6 border border-black/5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#202124] flex items-center gap-2">
              <span className="material-icons text-blue-600 text-xl">travel_explore</span>
              <span>Popular Visa Destinations from Bangladesh</span>
            </h2>
            <p className="text-xs text-neutral-500">
              Quick access to 29-point consular requirements, embassy fees, and checklists
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAllCountries}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Explore all {ALL_COUNTRIES.length} Countries Database</span>
            <span className="material-icons text-sm">arrow_forward</span>
          </button>
        </div>

        {/* Horizontal Scrollable Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1 pt-1">
          {topCountries.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectCountry(c.name)}
              className="px-3.5 py-2 rounded-2xl bg-neutral-50 hover:bg-blue-50/80 border border-neutral-200/80 hover:border-blue-300 text-xs font-medium text-neutral-800 flex items-center gap-2 shrink-0 transition-all cursor-pointer shadow-2xs group"
            >
              <span className="text-xl">{c.flag}</span>
              <span className="font-semibold group-hover:text-blue-700">{c.name}</span>
              <span className="text-[10px] text-neutral-400 font-mono">({c.continent})</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
