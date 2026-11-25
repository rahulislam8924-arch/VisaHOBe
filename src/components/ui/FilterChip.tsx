import React from 'react';
import { cn } from '../../utils/cn';

/** Filter chip used by the country, service and article directories */
export const FilterChip: React.FC<{
  active?: boolean;
  onClick?: () => void;
  icon?: string;
  meta?: string | number;
  className?: string;
  children: React.ReactNode;
}> = ({ active, onClick, icon, meta, className, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={Boolean(active)}
    className={cn(
      'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap',
      'transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/70 focus-visible:ring-offset-1',
      active
        ? 'border-transparent bg-[#0b57d0] text-white shadow-xs'
        : 'border-black/[0.08] bg-white text-[#444746] hover:border-[#c2d7f5] hover:bg-[#f6f9fe] hover:text-[#0b57d0]',
      className
    )}
  >
    {icon && (
      <span className="material-icons text-[15px] leading-none">{icon}</span>
    )}
    <span>{children}</span>
    {meta !== undefined && (
      <span
        className={cn(
          'rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
          active ? 'bg-white/20 text-white' : 'bg-black/[0.06] text-[#5f6368]'
        )}
      >
        {meta}
      </span>
    )}
  </button>
);

/** Rounded search field with leading icon and a clear button */
export const SearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  className?: string;
}> = ({ value, onChange, placeholder, label, className }) => (
  <div className={cn('relative w-full', className)}>
    <label className="sr-only" htmlFor={`search-${label.replace(/\s+/g, '-').toLowerCase()}`}>
      {label}
    </label>
    <span className="material-icons pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] leading-none text-[#5f6368]">
      search
    </span>
    <input
      id={`search-${label.replace(/\s+/g, '-').toLowerCase()}`}
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-full border border-black/[0.10] bg-white py-2.5 pl-11 pr-11 text-sm text-[#202124] shadow-2xs transition-colors placeholder:text-[#80868b] hover:border-black/20 focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/25 [&::-webkit-search CancelButton]:hidden [&::-webkit-search-cancel-button]:hidden"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange('')}
        className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#5f6368] transition-colors hover:bg-black/[0.06] hover:text-[#202124] cursor-pointer"
        aria-label={`Clear ${label.toLowerCase()}`}
      >
        <span className="material-icons text-[18px] leading-none">close</span>
      </button>
    )}
  </div>
);
