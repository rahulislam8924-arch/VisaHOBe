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

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[#1a73e8] text-white shadow-sm hover:bg-[#1557b0] hover:shadow-md',
  secondary:
    'bg-white text-[#0b57d0] border border-[#dadce0] shadow-2xs hover:bg-[#f6f9fe] hover:border-[#c2d7f5] hover:shadow-xs',
  tonal:
    'bg-[#e8f0fe] text-[#0b57d0] hover:bg-[#d7e6fd] border border-transparent hover:border-[#c2e7ff]',
  outline:
    'bg-transparent text-[#3c4043] border border-[#747775]/50 hover:bg-neutral-300/40 hover:border-[#3c4043]',
  ghost:
    'bg-transparent text-[#3c4043] hover:bg-black/[0.06]',
  danger:
    'bg-transparent text-[#c5221f] hover:bg-[#fce8e6]',
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
    'transition-colors hover:bg-black/[0.06] hover:text-[#202124]',
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
