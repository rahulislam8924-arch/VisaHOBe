import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface CardImageProps {
  src?: string;
  alt: string;
  /** Material icon shown when the photo cannot be loaded */
  icon?: string;
  /** Applied to the <img> element (sizing / hover transform) */
  className?: string;
}

/**
 * Card header photo with a branded gradient fallback, so a blocked or missing
 * file never leaves an empty grey box in the grid.
 */
export const CardImage: React.FC<CardImageProps> = ({ src, alt, icon = 'description', className }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        aria-hidden="true"
        className="flex h-full w-full items-center justify-center bg-[linear-gradient(150deg,#e8f0fe_0%,#f7fbff_55%,#eefaf4_100%)]"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-[#1a73e8] shadow-sm">
          <span className="material-icons text-[26px] leading-none">{icon}</span>
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(className)}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
};
