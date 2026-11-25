import React, { useState, useRef, useEffect } from 'react';
import { ALL_COUNTRIES } from '../data/allCountriesData';

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

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigatePage,
  onOpenPortal,
  onOpenConsultation,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'services' | 'company' | null>(null);

  const servicesMenuRef = useRef<HTMLDivElement>(null);
  const companyMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        servicesMenuRef.current &&
        !servicesMenuRef.current.contains(event.target as Node) &&
        companyMenuRef.current &&
        !companyMenuRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (page: AppPage) => {
    onNavigatePage(page);
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isServicesActive = currentPage === 'services' || currentPage === 'work-visa';
  const isCompanyActive =
    currentPage === 'about' ||
    currentPage === 'business-network' ||
    currentPage === 'contact' ||
    currentPage === 'legal';

  return (
    <>
      {/* Accessibility jump link */}
      <a
        href="#page-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-blue-600 focus:shadow-md focus:rounded-md font-medium text-sm"
      >
        Jump to Content
      </a>

      {/* Main Header Container */}
      <header
        className="sticky top-0 z-50 bg-[#f2f0ec]/95 backdrop-blur-md border-b border-black/8 transition-all"
        aria-label="site header"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Left Brand Lock-up */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile Hamburger Drawer Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-neutral-700 hover:text-black hover:bg-black/5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              aria-label="Open mobile navigation menu"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <use href="#menu" />
              </svg>
            </button>

            {/* VisaHOBe Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('home');
              }}
              className="flex items-center gap-2.5 group py-1 select-none"
              title="VisaHOBe - Your Trusted Partner for Global Visa Support"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#1a73e8] via-[#1557b0] to-[#0d47a1] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <span className="material-icons text-xl sm:text-2xl">verified_user</span>
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-['Google_Sans',Roboto,sans-serif] text-xl sm:text-[22px] font-bold text-[#202124] tracking-tight leading-none">
                    Visa<span className="text-[#1a73e8]">HOBe</span>
                  </span>
                  <span className="hidden xl:inline-block px-2 py-0.5 text-[9px] font-bold bg-[#e8f0fe] text-[#1967d2] rounded-full border border-[#c2e7ff]">
                    GLOBAL
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium tracking-normal text-[#5f6368] leading-tight mt-0.5 truncate max-w-[170px] sm:max-w-none">
                  Your Trusted Partner for Global Visa Support
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Merged Navigation Bar (Clean & uncluttered 5 main items) */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3 mx-auto">
            {/* 1. Home */}
            <button
              type="button"
              onClick={() => handleLinkClick('home')}
              className={`text-[14px] px-3.5 py-2 rounded-full transition-all duration-150 cursor-pointer whitespace-nowrap ${
                currentPage === 'home'
                  ? 'bg-white text-[#1a73e8] font-bold shadow-2xs border border-blue-200/80'
                  : 'text-[#444746] hover:text-[#1f1f1f] hover:bg-neutral-200/50 font-medium'
              }`}
            >
              Home
            </button>

            {/* 2. Visa Services (Consolidated Dropdown) */}
            <div
              className="relative"
              ref={servicesMenuRef}
              onMouseEnter={() => setOpenDropdown('services')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() => handleLinkClick('services')}
                className={`text-[14px] px-3.5 py-2 rounded-full transition-all duration-150 cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  isServicesActive
                    ? 'bg-white text-[#1a73e8] font-bold shadow-2xs border border-blue-200/80'
                    : 'text-[#444746] hover:text-[#1f1f1f] hover:bg-neutral-200/50 font-medium'
                }`}
              >
                <span>Visa Services</span>
                <span className={`material-icons text-sm transition-transform ${openDropdown === 'services' ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {openDropdown === 'services' && (
                <div className="absolute left-0 mt-1 w-72 bg-white rounded-2xl shadow-xl border border-neutral-200/80 py-2 z-50 text-left animate-in fade-in">
                  <button
                    onClick={() => handleLinkClick('services')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 text-left transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <span className="material-icons text-base">room_service</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">All Visa Services</p>
                      <p className="text-[10px] text-neutral-500">Document checklists & form assistance</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleLinkClick('work-visa')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 text-left transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                      <span className="material-icons text-base">engineering</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Work Visa & Employment Info</p>
                      <p className="text-[10px] text-neutral-500">Skilled trades, Saudi Qiwa & BMET process</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleLinkClick('services')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 text-left transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <span className="material-icons text-base">airplane_ticket</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">E-Visa Processing</p>
                      <p className="text-[10px] text-neutral-500">UAE, Turkey, Singapore & Malaysia e-visas</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleLinkClick('services')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 text-left transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                      <span className="material-icons text-base">verified</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Document Attestation</p>
                      <p className="text-[10px] text-neutral-500">Notary, MOFA & consular legalization chain</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Country Guides */}
            <button
              type="button"
              onClick={() => handleLinkClick('countries')}
              className={`text-[14px] px-3.5 py-2 rounded-full transition-all duration-150 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                currentPage === 'countries'
                  ? 'bg-white text-[#1a73e8] font-bold shadow-2xs border border-blue-200/80'
                  : 'text-[#444746] hover:text-[#1f1f1f] hover:bg-neutral-200/50 font-medium'
              }`}
            >
              <span className="material-icons text-base text-blue-600">public</span>
              <span>Countries (190)</span>
            </button>

            {/* 4. Guides & Blog */}
            <button
              type="button"
              onClick={() => handleLinkClick('blog')}
              className={`text-[14px] px-3.5 py-2 rounded-full transition-all duration-150 cursor-pointer whitespace-nowrap ${
                currentPage === 'blog'
                  ? 'bg-white text-[#1a73e8] font-bold shadow-2xs border border-blue-200/80'
                  : 'text-[#444746] hover:text-[#1f1f1f] hover:bg-neutral-200/50 font-medium'
              }`}
            >
              Guides & Research
            </button>

            {/* 5. Company & Network (Consolidated Dropdown) */}
            <div
              className="relative"
              ref={companyMenuRef}
              onMouseEnter={() => setOpenDropdown('company')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className={`text-[14px] px-3.5 py-2 rounded-full transition-all duration-150 cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  isCompanyActive
                    ? 'bg-white text-[#1a73e8] font-bold shadow-2xs border border-blue-200/80'
                    : 'text-[#444746] hover:text-[#1f1f1f] hover:bg-neutral-200/50 font-medium'
                }`}
              >
                <span>Company</span>
                <span className={`material-icons text-sm transition-transform ${openDropdown === 'company' ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {openDropdown === 'company' && (
                <div className="absolute right-0 mt-1 w-72 bg-white rounded-2xl shadow-xl border border-neutral-200/80 py-2 z-50 text-left animate-in fade-in">
                  <button
                    onClick={() => handleLinkClick('about')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 text-left transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <span className="material-icons text-base">info</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">About VisaHOBe</p>
                      <p className="text-[10px] text-neutral-500">Mission, ethics & safe wording standards</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleLinkClick('business-network')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 text-left transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                      <span className="material-icons text-base">hub</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">B2B Partner Network</p>
                      <p className="text-[10px] text-neutral-500">Travel agents & corporate travel portal</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleLinkClick('contact')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 text-left transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <span className="material-icons text-base">call</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Contact & Support Desks</p>
                      <p className="text-[10px] text-neutral-500">Dhaka advisory desk & WhatsApp hotline</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleLinkClick('legal')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 text-left transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0">
                      <span className="material-icons text-base">policy</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Policies & Compliance</p>
                      <p className="text-[10px] text-neutral-500">Consular disclaimer, refund & anti-fraud</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Client Portal Button */}
            <button
              type="button"
              onClick={onOpenPortal}
              className="text-[13px] sm:text-[14px] font-semibold text-[#1a73e8] hover:bg-[#e8f0fe] border border-[#dadce0] px-4 py-2 rounded-full transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center gap-1.5 shadow-2xs"
              aria-label="Client Portal Login"
            >
              <span className="material-icons text-base">dashboard</span>
              <span className="hidden sm:inline">Client Portal</span>
              <span className="sm:hidden">Portal</span>
            </button>

            {/* Book Consultation Button */}
            <button
              type="button"
              onClick={onOpenConsultation}
              className="bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[13px] sm:text-[14px] font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] inline-flex items-center gap-1.5 cursor-pointer"
              aria-label="Book a Consultation"
            >
              <span className="material-icons text-base">calendar_month</span>
              <span className="hidden md:inline">Book Consultation</span>
              <span className="md:hidden">Book</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Menu Content */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isMobileMenuOpen}
        inert={!isMobileMenuOpen}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1a73e8] text-white flex items-center justify-center shadow-xs">
              <span className="material-icons text-lg">verified_user</span>
            </div>
            <span className="font-['Google_Sans',Roboto,sans-serif] font-bold text-neutral-800 text-lg">
              Visa<span className="text-[#1a73e8]">HOBe</span>
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-neutral-500 hover:text-black rounded-full"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <use href="#close" />
            </svg>
          </button>
        </div>

        <div className="flex-1 py-4 px-6 flex flex-col gap-3 overflow-y-auto text-left">
          <button
            onClick={() => handleLinkClick('home')}
            className={`text-left text-sm font-semibold py-2 px-3 rounded-xl transition-colors flex items-center gap-3 ${
              currentPage === 'home' ? 'bg-blue-50 text-[#1a73e8]' : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <span className="material-icons text-lg">home</span>
            <span>Home</span>
          </button>

          <button
            onClick={() => handleLinkClick('services')}
            className={`text-left text-sm font-semibold py-2 px-3 rounded-xl transition-colors flex items-center gap-3 ${
              currentPage === 'services' ? 'bg-blue-50 text-[#1a73e8]' : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <span className="material-icons text-lg">room_service</span>
            <span>Visa Services & Checklists</span>
          </button>

          <button
            onClick={() => handleLinkClick('countries')}
            className={`text-left text-sm font-semibold py-2 px-3 rounded-xl transition-colors flex items-center gap-3 ${
              currentPage === 'countries' ? 'bg-blue-50 text-[#1a73e8]' : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <span className="material-icons text-lg">public</span>
            <span>Country Visa Guides ({ALL_COUNTRIES.length})</span>
          </button>

          <button
            onClick={() => handleLinkClick('work-visa')}
            className={`text-left text-sm font-semibold py-2 px-3 rounded-xl transition-colors flex items-center gap-3 ${
              currentPage === 'work-visa' ? 'bg-blue-50 text-[#1a73e8]' : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <span className="material-icons text-lg">engineering</span>
            <span>Work Visa & Skilled Occupations</span>
          </button>

          <button
            onClick={() => handleLinkClick('blog')}
            className={`text-left text-sm font-semibold py-2 px-3 rounded-xl transition-colors flex items-center gap-3 ${
              currentPage === 'blog' ? 'bg-blue-50 text-[#1a73e8]' : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <span className="material-icons text-lg">menu_book</span>
            <span>Visa Guides & Research</span>
          </button>

          <button
            onClick={() => handleLinkClick('about')}
            className={`text-left text-sm font-semibold py-2 px-3 rounded-xl transition-colors flex items-center gap-3 ${
              currentPage === 'about' ? 'bg-blue-50 text-[#1a73e8]' : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <span className="material-icons text-lg">info</span>
            <span>About VisaHOBe & Ethics</span>
          </button>

          <button
            onClick={() => handleLinkClick('business-network')}
            className={`text-left text-sm font-semibold py-2 px-3 rounded-xl transition-colors flex items-center gap-3 ${
              currentPage === 'business-network' ? 'bg-blue-50 text-[#1a73e8]' : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <span className="material-icons text-lg">hub</span>
            <span>B2B Partner Network</span>
          </button>

          <button
            onClick={() => handleLinkClick('contact')}
            className={`text-left text-sm font-semibold py-2 px-3 rounded-xl transition-colors flex items-center gap-3 ${
              currentPage === 'contact' ? 'bg-blue-50 text-[#1a73e8]' : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <span className="material-icons text-lg">call</span>
            <span>Contact & Support Desks</span>
          </button>

          <button
            onClick={() => handleLinkClick('legal')}
            className={`text-left text-sm font-semibold py-2 px-3 rounded-xl transition-colors flex items-center gap-3 ${
              currentPage === 'legal' ? 'bg-blue-50 text-[#1a73e8]' : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <span className="material-icons text-lg">policy</span>
            <span>Policies & Compliance</span>
          </button>

          <hr className="border-gray-100 my-1" />

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenPortal();
              }}
              className="w-full text-center text-sm font-semibold text-[#1a73e8] border border-[#dadce0] py-2.5 rounded-full hover:bg-blue-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-icons text-base">dashboard</span>
              <span>Open Client Portal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full text-center text-sm font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] py-2.5 rounded-full flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span className="material-icons text-base">calendar_month</span>
              <span>Book a Consultation</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 text-xs text-neutral-500 text-center border-t border-gray-100">
          VisaHOBe • Your Trusted Partner for Global Visa Support
        </div>
      </div>
    </>
  );
};
