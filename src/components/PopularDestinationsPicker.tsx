import React from 'react';
import { ALL_COUNTRIES } from '../data/allCountriesData';
import { Button, CountryFlag } from './ui';

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
    <section
      className="relative px-4 py-4 sm:px-6 sm:py-8 max-w-6xl mx-auto text-left"
      aria-label="Popular Visa Destinations"
    >
      <div className="relative overflow-hidden rounded-3xl border border-black/[0.06] bg-white/85 shadow-[0_10px_30px_-24px_rgba(60,64,67,0.5)] backdrop-blur-sm">
        {/* Top accent line */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#1a73e8] via-[#4a9bff] to-emerald-400"
        />

        <div className="space-y-4 p-5 pt-6 sm:p-6 sm:pt-7">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e8f0fe] text-[#1a73e8]">
                <span className="material-icons text-[21px] leading-none">travel_explore</span>
              </span>
              <div>
                <h2 className="text-[15px] font-bold leading-tight text-[#202124] sm:text-[17px]">
                  Popular visa destinations from Bangladesh
                </h2>
                <p className="mt-1 text-[12px] leading-snug text-[#5f6368]">
                  29-point consular requirements, embassy fees and checklists — one tap away
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={onViewAllCountries}
              trailingIcon="arrow_forward"
              className="w-full shrink-0 sm:w-auto"
            >
              All {ALL_COUNTRIES.length} countries
            </Button>
          </div>

          {/* Scrollable destination cards */}
          <div className="-mx-1 flex snap-x snap-mandatory items-stretch gap-2.5 overflow-x-auto no-scrollbar px-1 pb-1 pt-1">
            {topCountries.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCountry(c.name)}
                className="group flex shrink-0 snap-start items-center gap-2.5 rounded-2xl border border-black/[0.07] bg-white px-3 py-2 text-left shadow-2xs transition-all duration-150 hover:-translate-y-0.5 hover:border-[#c2d7f5] hover:bg-[#f8fbff] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/60 cursor-pointer"
                aria-label={`Open the ${c.name} visa guide`}
              >
                <span className="flex h-9 w-[42px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f6f9fe] transition-colors group-hover:bg-white">
                  <CountryFlag flag={c.flag} name={c.name} size="md" />
                </span>
                <span className="flex flex-col">
                  <span className="text-[12.5px] font-semibold leading-tight text-[#202124] group-hover:text-[#0b57d0]">
                    {c.name}
                  </span>
                  <span className="mt-0.5 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#80868b]">
                    {c.continent}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
