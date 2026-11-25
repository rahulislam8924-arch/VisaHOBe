import React, { useEffect, useRef, useState } from 'react';
import { ALL_COUNTRIES } from '../data/allCountriesData';
import { Button, iconButtonClass, cn } from './ui';

export type AppPage =
  | 'home'
  | 'about'
  | 'services'
  | 'countries'
  | 'work-visa'
  | 'blog'
  | 'appointment'
  | 'contact'
  | 'business-network'
  | 'legal';

interface HeaderProps {
  currentPage: AppPage;
  onNavigatePage: (page: AppPage) => void;
  onOpenPortal: () => void;
  onOpenConsultation: () => void;
}

type DropdownId = 'services' | 'company';

interface DropdownItem {
  label: string;
  description: string;
  icon: string;
  iconClassName: string;
  page: AppPage;
}

const SERVICES_ITEMS: DropdownItem[] = [
  {
    label: 'All Visa Services',
    description: 'Document checklists & form assistance',
    icon: 'room_service',
    iconClassName: 'bg-blue-50 text-[#1a73e8]',
    page: 'services',
  },
  {
    label: 'Work Visa & Employment',
    description: 'Skilled trades, Saudi Qiwa & BMET process',
    icon: 'engineering',
    iconClassName: 'bg-amber-50 text-amber-700',
    page: 'work-visa',
  },
  {
    label: 'E-Visa Processing',
    description: 'UAE, Turkey, Singapore & Malaysia e-visas',
    icon: 'airplane_ticket',
    iconClassName: 'bg-emerald-50 text-emerald-700',
    page: 'services',
  },
  {
    label: 'Document Attestation',
    description: 'Notary, MOFA & consular legalization chain',
    icon: 'verified',
    iconClassName: 'bg-purple-50 text-purple-700',
    page: 'services',
  },
];

const COMPANY_ITEMS: DropdownItem[] = [
  {
    label: 'About VisaHOBe',
    description: 'Mission, ethics & safe wording standards',
    icon: 'info',
    iconClassName: 'bg-blue-50 text-[#1a73e8]',
    page: 'about',
  },
  {
    label: 'B2B Partner Network',
    description: 'Travel agents & corporate travel portal',
    icon: 'hub',
    iconClassName: 'bg-indigo-50 text-indigo-700',
    page: 'business-network',
  },
  {
    label: 'Contact & Support Desks',
    description: 'Dhaka advisory desk & WhatsApp hotline',
    icon: 'call',
    iconClassName: 'bg-emerald-50 text-emerald-700',
    page: 'contact',
  },
  {
    label: 'Policies & Compliance',
    description: 'Consular disclaimer, refund & anti-fraud',
    icon: 'policy',
    iconClassName: 'bg-neutral-100 text-neutral-700',
    page: 'legal',
  },
];

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigatePage,
  onOpenPortal,
  onOpenConsultation,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);

  const closeMenus = () => setOpenDropdown(null);

  // Outside click / Escape close the desktop dropdowns
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) closeMenus();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenus();
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Elevate the bar once the page scrolls
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile drawer: lock body scroll, close on Escape, return focus to the toggle
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    drawerCloseRef.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      hamburgerRef.current?.focus({ preventScroll: true });
    };
  }, [isMobileMenuOpen]);

  // Keep keyboard focus inside the open drawer
  const handleDrawerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !drawerRef.current) return;
    const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleLinkClick = (page: AppPage) => {
    onNavigatePage(page);
    setIsMobileMenuOpen(false);
    closeMenus();
  };

  const isServicesActive = currentPage === 'services' || currentPage === 'work-visa';
  const isCompanyActive =
    currentPage === 'about' ||
    currentPage === 'business-network' ||
    currentPage === 'contact' ||
    currentPage === 'legal';

  const navItemClass = (isActive: boolean) =>
    cn(
      'inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[14px] leading-none whitespace-nowrap',
      'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/70 cursor-pointer',
      isActive
        ? 'bg-white text-[#0b57d0] font-semibold shadow-[0_1px_3px_rgba(60,64,67,0.18)] ring-1 ring-[#d2e3fc]'
        : 'text-[#444746] font-medium hover:bg-black/[0.05] hover:text-[#202124]'
    );

  const renderDropdown = (id: DropdownId, items: DropdownItem[], align: 'left' | 'right') => {
    if (openDropdown !== id) return null;
    return (
      <div
        className={cn(
          'absolute top-full pt-2 z-50',
          align === 'right' ? 'right-0' : 'left-0'
        )}
      >
        <div
          role="menu"
          aria-label={id === 'services' ? 'Visa services' : 'Company'}
          className="w-[19rem] rounded-2xl border border-black/[0.06] bg-white p-1.5 shadow-[0_12px_32px_-8px_rgba(60,64,67,0.35)] animate-in fade-in zoom-in-95 duration-150"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => handleLinkClick(item.page)}
              className="group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[#f6f9fe] focus-visible:bg-[#f6f9fe] focus-visible:outline-none cursor-pointer"
            >
              <span
                className={cn(
                  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  item.iconClassName
                )}
              >
                <span className="material-icons text-[18px] leading-none">{item.icon}</span>
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold leading-tight text-[#202124] group-hover:text-[#0b57d0]">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-[#5f6368]">
                  {item.description}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Accessibility jump link */}
      <a
        href="#page-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#0b57d0] focus:shadow-lg"
      >
        Jump to content
      </a>

      <header
        className={cn(
          'sticky top-0 z-50 border-b transition-all duration-200',
          'bg-[#f2f0ec]/90 backdrop-blur-xl',
          isScrolled
            ? 'border-black/[0.08] shadow-[0_1px_16px_rgba(60,64,67,0.10)]'
            : 'border-transparent'
        )}
        aria-label="Site header"
      >
        <div className="mx-auto flex h-18 max-w-[1440px] items-center gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
          {/* Mobile drawer toggle */}
          <button
            ref={hamburgerRef}
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className={cn(iconButtonClass(), 'xl:hidden -ml-1.5')}
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <span className="material-icons text-2xl">menu</span>
          </button>

          {/* Brand */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('home');
            }}
            className="group flex shrink-0 select-none items-center gap-2.5 rounded-xl py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/70"
            title="VisaHOBe — Your Trusted Partner for Global Visa Support"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1a73e8] via-[#1557b0] to-[#0d47a1] text-white shadow-xs transition-transform duration-200 group-hover:scale-105 sm:h-10 sm:w-10">
              <span className="material-icons text-xl leading-none sm:text-[22px]">verified_user</span>
            </span>
            <span className="flex flex-col text-left leading-none">
              <span className="flex items-center gap-1.5">
                <span className="font-['Google_Sans',Roboto,sans-serif] text-[19px] font-bold tracking-tight text-[#202124] sm:text-[21px]">
                  Visa<span className="text-[#1a73e8]">HOBe</span>
                </span>
                <span className="hidden rounded-full border border-[#c2e7ff] bg-[#e8f0fe] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#1967d2] xl:inline-block">
                  Global
                </span>
              </span>
              <span className="mt-1 hidden text-[11px] font-medium text-[#5f6368] sm:block">
                Your Trusted Partner for Global Visa Support
              </span>
            </span>
          </a>

          {/* Desktop navigation */}
          <nav
            ref={navRef}
            className="mx-auto hidden items-center gap-1 rounded-full border border-black/[0.05] bg-white/40 p-1 xl:flex"
            aria-label="Main navigation"
          >
            <button
              type="button"
              onClick={() => handleLinkClick('home')}
              className={navItemClass(currentPage === 'home')}
              aria-current={currentPage === 'home' ? 'page' : undefined}
            >
              Home
            </button>

            {/* Visa services */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('services')}
              onMouseLeave={closeMenus}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown(openDropdown === 'services' ? null : 'services')
                }
                className={navItemClass(isServicesActive)}
                aria-haspopup="menu"
                aria-expanded={openDropdown === 'services'}
              >
                Visa Services
                <span
                  className={cn(
                    'material-icons text-[16px] leading-none transition-transform duration-200',
                    openDropdown === 'services' && 'rotate-180'
                  )}
                >
                  expand_more
                </span>
              </button>
              {renderDropdown('services', SERVICES_ITEMS, 'left')}
            </div>

            <button
              type="button"
              onClick={() => handleLinkClick('countries')}
              className={navItemClass(currentPage === 'countries')}
              aria-current={currentPage === 'countries' ? 'page' : undefined}
            >
              Countries
              <span className="rounded-full bg-black/[0.05] px-1.5 py-0.5 text-[10px] font-semibold text-[#5f6368]">
                {ALL_COUNTRIES.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('blog')}
              className={navItemClass(currentPage === 'blog')}
              aria-current={currentPage === 'blog' ? 'page' : undefined}
            >
              Guides &amp; Research
            </button>

            {/* Company */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('company')}
              onMouseLeave={closeMenus}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'company' ? null : 'company')}
                className={navItemClass(isCompanyActive)}
                aria-haspopup="menu"
                aria-expanded={openDropdown === 'company'}
              >
                Company
                <span
                  className={cn(
                    'material-icons text-[16px] leading-none transition-transform duration-200',
                    openDropdown === 'company' && 'rotate-180'
                  )}
                >
                  expand_more
                </span>
              </button>
              {renderDropdown('company', COMPANY_ITEMS, 'right')}
            </div>
          </nav>

          {/* Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenPortal}
              leadingIcon="dashboard"
              className="px-3 sm:px-4"
              aria-label="Open the VisaHOBe client portal"
            >
              <span className="hidden sm:inline">Client Portal</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={onOpenConsultation}
              leadingIcon="calendar_month"
              className="px-3 sm:px-4"
              aria-label="Book a consultation"
            >
              <span className="hidden md:inline">Book Consultation</span>
              <span className="md:hidden">Book</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile drawer backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[55] bg-[#001d35]/45 backdrop-blur-[2px] transition-opacity duration-300 xl:hidden',
          isMobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div
        ref={drawerRef}
        onKeyDown={handleDrawerKeyDown}
        id="mobile-navigation"
        className={cn(
          'fixed inset-y-0 left-0 z-[60] flex w-[min(21rem,88vw)] flex-col bg-[#f7f5f1] shadow-2xl transition-transform duration-300 ease-out xl:hidden',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-hidden={!isMobileMenuOpen}
        inert={!isMobileMenuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between border-b border-black/[0.06] bg-white/70 px-4 py-3.5">
          <span className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#1a73e8] to-[#0d47a1] text-white">
              <span className="material-icons text-lg leading-none">verified_user</span>
            </span>
            <span className="font-['Google_Sans',Roboto,sans-serif] text-lg font-bold text-[#202124]">
              Visa<span className="text-[#1a73e8]">HOBe</span>
            </span>
          </span>
          <button
            ref={drawerCloseRef}
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className={iconButtonClass()}
            aria-label="Close navigation menu"
          >
            <span className="material-icons text-xl">close</span>
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          <DrawerSection title="Explore">
            <DrawerLink page="home" label="Home" icon="home" currentPage={currentPage} onSelect={handleLinkClick} />
            <DrawerLink page="services" label="Visa Services" icon="room_service" currentPage={currentPage} onSelect={handleLinkClick} />
            <DrawerLink
              page="countries"
              label="Country Visa Guides"
              icon="public"
              currentPage={currentPage}
              onSelect={handleLinkClick}
              meta={`${ALL_COUNTRIES.length}`}
            />
            <DrawerLink page="work-visa" label="Work Visa" icon="engineering" currentPage={currentPage} onSelect={handleLinkClick} />
            <DrawerLink page="blog" label="Guides & Research" icon="menu_book" currentPage={currentPage} onSelect={handleLinkClick} />
          </DrawerSection>

          <DrawerSection title="Company">
            <DrawerLink page="about" label="About VisaHOBe" icon="info" currentPage={currentPage} onSelect={handleLinkClick} />
            <DrawerLink page="business-network" label="B2B Partner Network" icon="hub" currentPage={currentPage} onSelect={handleLinkClick} />
            <DrawerLink page="contact" label="Contact & Support" icon="call" currentPage={currentPage} onSelect={handleLinkClick} />
            <DrawerLink page="legal" label="Policies & Compliance" icon="policy" currentPage={currentPage} onSelect={handleLinkClick} />
          </DrawerSection>
        </div>

        <div className="space-y-2 border-t border-black/[0.06] bg-white/70 p-3">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            leadingIcon="dashboard"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenPortal();
            }}
          >
            Open Client Portal
          </Button>
          <Button
            variant="primary"
            size="md"
            fullWidth
            leadingIcon="calendar_month"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenConsultation();
            }}
          >
            Book a Consultation
          </Button>
          <p className="pt-1 text-center text-[11px] text-[#70757a]">
            VisaHOBe • Independent visa support, not an embassy
          </p>
        </div>
      </div>
    </>
  );
};

const DrawerSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div>
    <p className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-[0.09em] text-[#70757a]">
      {title}
    </p>
    <div className="space-y-0.5">{children}</div>
  </div>
);

const DrawerLink: React.FC<{
  page: AppPage;
  label: string;
  icon: string;
  currentPage: AppPage;
  onSelect: (page: AppPage) => void;
  meta?: string;
}> = ({ page, label, icon, currentPage, onSelect, meta }) => {
  const isActive = currentPage === page;
  return (
    <button
      type="button"
      onClick={() => onSelect(page)}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/70',
        isActive
          ? 'bg-[#e8f0fe] font-semibold text-[#0b57d0]'
          : 'font-medium text-[#3c4043] hover:bg-black/[0.05]'
      )}
    >
      <span
        className={cn(
          'material-icons text-[20px] leading-none',
          isActive ? 'text-[#0b57d0]' : 'text-[#5f6368]'
        )}
      >
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {meta && (
        <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-[10px] font-semibold text-[#5f6368]">
          {meta}
        </span>
      )}
      {isActive && <span className="material-icons text-[16px] text-[#0b57d0]">check</span>}
    </button>
  );
};
