import React, { useEffect, useState } from 'react';
import { LANGUAGES } from '../data/walletData';
import { Button } from './ui';
import { AppPage } from './Header';

interface FooterProps {
  onNavigatePage: (page: AppPage) => void;
  onNavigateFaq: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigatePage, onNavigateFaq }) => {
  const [selectedLang, setSelectedLang] = useState('en_us');
  const [col1Expanded, setCol1Expanded] = useState(true);
  const [col2Expanded, setCol2Expanded] = useState(true);
  const [cookieConsentOpen, setCookieConsentOpen] = useState(false);

  // Reflect a locale that was set by the browser or a previous visit
  useEffect(() => {
    const current = document.documentElement.lang.replace('-', '_');
    if (LANGUAGES.some((lang) => lang.code === current)) setSelectedLang(current);
  }, []);

  const handleLink = (page: AppPage) => {
    onNavigatePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="glue-footer bg-[#f2f0ec] text-[#5f6368] pt-12 pb-16 border-t border-black/10" data-cy="page-footer">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {/* Social Module: Follow us */}
        <section className="pb-10 border-b border-black/10">
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-sm font-medium text-[#202124]">Follow VisaHOBe</span>
            <ul className="flex items-center gap-4" role="list">
              <li>
                <a
                  href="https://www.youtube.com/@visahobe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[#5f6368] hover:text-[#ea4335] hover:bg-black/5 transition-colors"
                  aria-label="Follow VisaHOBe on YouTube"
                  title="Follow VisaHOBe on YouTube"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <use href="#video-youtube" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/visahobe/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[#5f6368] hover:text-[#d62976] hover:bg-black/5 transition-colors"
                  aria-label="Follow VisaHOBe on Instagram"
                  title="Follow VisaHOBe on Instagram"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <use href="#instagram" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* Site Links Columns */}
        <nav className="py-10 border-b border-black/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: Services & Guides */}
            <div>
              <div
                className="flex items-center justify-between cursor-pointer md:cursor-default"
                onClick={() => setCol1Expanded(!col1Expanded)}
              >
                <h3 className="text-sm font-semibold text-[#202124] tracking-wider uppercase mb-3">
                  Visa Services
                </h3>
                <span className="md:hidden text-neutral-500">
                  <svg className={`w-4 h-4 fill-current transition-transform ${col1Expanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24">
                    <use href="#expand-more" />
                  </svg>
                </span>
              </div>
              <ul className={`space-y-3 text-sm ${col1Expanded ? 'block' : 'hidden md:block'}`}>
                <li>
                  <button
                    onClick={() => handleLink('services')}
                    className="text-[#5f6368] hover:text-[#202124] hover:underline cursor-pointer"
                  >
                    All Visa Services & Checklist
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink('countries')}
                    className="text-[#5f6368] hover:text-[#202124] hover:underline cursor-pointer"
                  >
                    Country Visa Guides (US, UK, Schengen)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink('work-visa')}
                    className="text-[#5f6368] hover:text-[#202124] hover:underline cursor-pointer"
                  >
                    Skilled Worker & Overseas Employment Info
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink('appointment')}
                    className="text-[#5f6368] hover:text-[#202124] hover:underline cursor-pointer"
                  >
                    Book a Professional Consultation
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Learn more & Company */}
            <div>
              <div
                className="flex items-center justify-between cursor-pointer md:cursor-default"
                onClick={() => setCol2Expanded(!col2Expanded)}
              >
                <h3 className="text-sm font-semibold text-[#202124] tracking-wider uppercase mb-3">
                  Company & Knowledge
                </h3>
                <span className="md:hidden text-neutral-500">
                  <svg className={`w-4 h-4 fill-current transition-transform ${col2Expanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24">
                    <use href="#expand-more" />
                  </svg>
                </span>
              </div>
              <ul className={`space-y-3 text-sm ${col2Expanded ? 'block' : 'hidden md:block'}`}>
                <li>
                  <button
                    onClick={() => handleLink('about')}
                    className="text-[#5f6368] hover:text-[#202124] hover:underline cursor-pointer"
                  >
                    About VisaHOBe & Ethics
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink('blog')}
                    className="text-[#5f6368] hover:text-[#202124] hover:underline cursor-pointer"
                  >
                    Visa Guides & Application Research
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink('business-network')}
                    className="text-[#5f6368] hover:text-[#202124] hover:underline cursor-pointer"
                  >
                    Partner Network & Corporate Portal
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink('contact')}
                    className="text-[#5f6368] hover:text-[#202124] hover:underline cursor-pointer"
                  >
                    Contact & Advisory Offices
                  </button>
                </li>
                <li>
                  <button
                    onClick={onNavigateFaq}
                    className="text-[#5f6368] hover:text-[#202124] hover:underline text-left cursor-pointer"
                  >
                    Frequently Asked Questions (FAQs)
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal & Ethics */}
            <div>
              <h3 className="text-sm font-semibold text-[#202124] tracking-wider uppercase mb-3">
                Policies & Compliance
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <button
                    onClick={() => handleLink('legal')}
                    className="text-[#5f6368] hover:text-[#202124] hover:underline cursor-pointer"
                  >
                    Consular Legal Disclaimer
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink('legal')}
                    className="text-[#5f6368] hover:text-[#202124] hover:underline cursor-pointer"
                  >
                    Refund & Cancellation Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink('legal')}
                    className="text-[#5f6368] hover:text-[#202124] hover:underline cursor-pointer"
                  >
                    Privacy & Data Protection Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink('legal')}
                    className="text-[#5f6368] hover:text-[#202124] hover:underline cursor-pointer"
                  >
                    Zero-Tolerance Anti-Fraud Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Quick Contacts */}
            <div>
              <h3 className="text-sm font-semibold text-[#202124] tracking-wider uppercase mb-3">
                Operating Desks
              </h3>
              <div className="space-y-2 text-xs text-neutral-600">
                <p><strong>Dhaka Desk:</strong> Gulshan-1 / Banani, Dhaka, Bangladesh</p>
                <p><strong>Hotline:</strong> +880 1700-000000</p>
                <p><strong>Inquiries:</strong> support@visahobe.com</p>
                <p className="pt-2 text-[11px] text-neutral-500">Sat - Thu: 9:30 AM - 6:30 PM</p>
              </div>
            </div>
          </div>
        </nav>

        {/* Global Footer */}
        <section className="pt-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 text-[13px] text-[#5f6368]">
          {/* Logo & Corporate Links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div
              onClick={() => handleLink('home')}
              className="flex items-center gap-1.5 font-bold text-neutral-900 text-base cursor-pointer"
            >
              <span className="material-icons text-[#1a73e8] text-lg">verified_user</span>
              <span>Visa<span className="text-[#1a73e8]">HOBe</span></span>
            </div>

            <button
              onClick={() => handleLink('about')}
              className="hover:text-[#202124] transition-colors cursor-pointer"
            >
              About VisaHOBe
            </button>

            <button
              onClick={() => handleLink('services')}
              className="hover:text-[#202124] transition-colors cursor-pointer"
            >
              Visa Services
            </button>

            <button
              onClick={() => handleLink('legal')}
              className="hover:text-[#202124] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>

            <button
              onClick={() => handleLink('legal')}
              className="hover:text-[#202124] transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>

            <button
              type="button"
              onClick={() => setCookieConsentOpen(true)}
              className="hover:text-[#202124] text-left transition-colors cursor-pointer"
            >
              Cookies management controls
            </button>
          </div>

          {/* Right Area: Help & Language Switcher */}
          <div className="flex flex-wrap items-center gap-5 w-full lg:w-auto justify-between lg:justify-end">
            <button
              onClick={() => handleLink('contact')}
              className="flex items-center gap-1.5 hover:text-[#202124] transition-colors cursor-pointer"
              aria-label="VisaHOBe Help"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <use href="#help" />
              </svg>
              <span>Contact & Support</span>
            </button>

            <div className="flex items-center gap-2">
              <label htmlFor="lang-selector" className="sr-only">
                Change language or region
              </label>
              <div className="relative">
                <select
                  id="lang-selector"
                  value={selectedLang}
                  onChange={(e) => {
                    const next = e.target.value;
                    setSelectedLang(next);
                    document.documentElement.lang = next.replace('_', '-');
                  }}
                  className="appearance-none bg-white/70 hover:bg-white text-xs text-[#3c4043] font-medium py-2 pl-3 pr-8 rounded-lg border border-black/10 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <use href="#arrow-drop-down" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {selectedLang !== 'en_us' && (
          <p role="status" className="mt-4 text-[11px] text-[#5f6368] text-right">
            {LANGUAGES.find((lang) => lang.code === selectedLang)?.label.split(' (')[0]} translation
            preview — the full localised site is launching soon, English content is shown meanwhile.
          </p>
        )}

        {/* Legal Disclaimer Footer Text */}
        <div className="mt-8 pt-6 border-t border-black/5 text-[11px] text-[#70757a] text-center leading-relaxed">
          <p>
            VisaHOBe (proposed legal display: VisaHOBe PTE. LTD.) is an independent visa-support service and is not an embassy, consulate, or government authority. Unless expressly stated and verified, VisaHOBe is not affiliated with or endorsed by any embassy or visa application centre. Visa decisions are made solely by the relevant immigration authorities. Our services do not guarantee visa approval.
          </p>
        </div>
      </div>

      {/* Cookies Management Dialog */}
      {cookieConsentOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setCookieConsentOpen(false)}
        >
          <div
            className="glass-panel w-full max-w-md rounded-2xl p-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-lg font-bold text-[#202124] mb-2">Privacy & Cookie Settings</h4>
            <p className="text-sm text-[#5f6368] mb-4">
              VisaHOBe uses secure data controls to deliver visa support services, maintain application security, and protect your identity in compliance with data privacy regulations.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setCookieConsentOpen(false)}>
                Customize
              </Button>
              <Button variant="primary" size="sm" onClick={() => setCookieConsentOpen(false)}>
                Accept all
              </Button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
