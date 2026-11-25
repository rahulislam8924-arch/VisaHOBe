import React from 'react';
import { cn } from '../../utils/cn';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tonal'
  | 'outline'
  | 'ghost'
  | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap ' +
  'transition-all duration-200 cursor-pointer select-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f2f0ec] ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50';

/** Liquid-glass envelope shared by the translucent variants */
const glassy =
  'backdrop-blur-xl backdrop-saturate-150 ' +
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(255,255,255,0.4),0_10px_24px_-16px_rgba(32,33,36,0.35)]';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-b from-[#2b7ff0] to-[#1a6de0] text-white border border-[#1557b0]/60 ' +
    'shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_24px_-12px_rgba(21,87,176,0.6)] ' +
    'hover:from-[#3187f5] hover:to-[#1557b0] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_14px_30px_-12px_rgba(21,87,176,0.65)]',
  secondary:
    'text-[#0b57d0] border border-white/80 bg-white/65 hover:bg-white/85 hover:text-[#0a4bb0] ' + glassy,
  tonal:
    'text-[#0b57d0] border border-white/70 bg-[#e8f0fe]/75 hover:bg-[#e8f0fe]/95 ' +
    'backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]',
  outline:
    'text-[#3c4043] border border-white/70 bg-white/30 backdrop-blur-md ' +
    'shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] hover:bg-white/65 hover:text-[#202124]',
  ghost:
    'bg-transparent text-[#3c4043] hover:bg-white/55 hover:backdrop-blur-md',
  danger:
    'bg-white/60 text-[#c5221f] border border-white/70 backdrop-blur-md hover:bg-[#fce8e6]/90',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'text-[13px] px-4 py-2 gap-1.5',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-[15px] px-7 py-3',
};

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

export const buttonClass = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}) =>
  cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className);

/** Icon-only round button (modal close, drawer toggles, …) */
export const iconButtonClass = (className?: string) =>
  cn(
    'inline-flex items-center justify-center w-9 h-9 rounded-full text-[#5f6368] cursor-pointer',
    'bg-white/45 backdrop-blur-md border border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]',
    'transition-colors hover:bg-white/80 hover:text-[#202124]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/70',
    className
  );

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonStyleOptions {
  leadingIcon?: string;
  trailingIcon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  leadingIcon,
  trailingIcon,
  children,
  type = 'button',
  ...props
}) => (
  <button type={type} className={buttonClass({ variant, size, fullWidth, className })} {...props}>
    {leadingIcon && <span className="material-icons text-[1.15em] leading-none">{leadingIcon}</span>}
    {children}
    {trailingIcon && <span className="material-icons text-[1.15em] leading-none">{trailingIcon}</span>}
  </button>
);

export default Button;
