import React, { useState } from 'react';
import { cn } from '../../utils/cn';

/**
 * Convert a regional-indicator emoji flag (🇧🇩) into an ISO 3166-1 alpha-2 code ("bd").
 * The dataset stores flags as emoji, and Windows/Chrome does not render flag emoji at
 * all — so every card falls back to these bundled SVG flags instead.
 */
export const flagCode = (emoji: string): string | null => {
  if (!emoji) return null;
  const chars = [...emoji];
  if (chars.length !== 2) return null;
  const code = chars
    .map((char) => {
      const point = char.codePointAt(0) ?? 0;
      if (point < 0x1f1e6 || point > 0x1f1ff) return '';
      return String.fromCharCode(point - 0x1f1e6 + 97);
    })
    .join('');
  return code.length === 2 ? code : null;
};

const SIZES = {
  xs: 'h-3.5 w-[18px] rounded-[2px]',
  sm: 'h-4 w-[21px] rounded-[3px]',
  md: 'h-6 w-8 rounded-[4px]',
  lg: 'h-8 w-[42px] rounded-[6px]',
  xl: 'h-12 w-16 rounded-lg',
} as const;

interface CountryFlagProps {
  /** Emoji flag from the country dataset */
  flag: string;
  /** Country name, used for the image title/alt context */
  name?: string;
  size?: keyof typeof SIZES;
  className?: string;
}

/** Bundled SVG country flag with a graceful emoji fallback */
export const CountryFlag: React.FC<CountryFlagProps> = ({
  flag,
  name,
  size = 'sm',
  className,
}) => {
  const [failed, setFailed] = useState(false);
  const code = flagCode(flag);

  if (!code || failed) {
    return (
      <span
        aria-hidden="true"
        title={name}
        className={cn('inline-flex items-center justify-center leading-none', className)}
        style={{ fontSize: size === 'xl' ? 34 : size === 'lg' ? 24 : size === 'md' ? 18 : 14 }}
      >
        {flag}
      </span>
    );
  }

  return (
    <img
      src={`/flags/${code}.svg`}
      alt=""
      aria-hidden="true"
      title={name}
      loading="lazy"
      decoding="async"
      width={size === 'xl' ? 64 : size === 'lg' ? 42 : size === 'md' ? 32 : 21}
      height={size === 'xl' ? 48 : size === 'lg' ? 32 : size === 'md' ? 24 : 16}
      onError={() => setFailed(true)}
      className={cn(
        'inline-block shrink-0 object-cover ring-1 ring-inset ring-black/10 shadow-[0_1px_2px_rgba(60,64,67,0.18)]',
        SIZES[size],
        className
      )}
    />
  );
};
