import { useState, useEffect } from 'react';
import { IconsMap } from './components/IconsMap';
import { Header, AppPage } from './components/Header';
import { Hero } from './components/Hero';
import { PopularDestinationsPicker } from './components/PopularDestinationsPicker';
import { JumplinksBar } from './components/JumplinksBar';
import { FeatureSection } from './components/FeatureSection';
import { AccessSection } from './components/AccessSection';
import { BottomPromo } from './components/BottomPromo';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { FloatingQRCode } from './components/FloatingQRCode';
import { DownloadModal } from './components/DownloadModal';
import { WalletSimulatorModal } from './components/WalletSimulatorModal';
import { GoogleWalletDashboard } from './components/dashboard/GoogleWalletDashboard';
import { FEATURE_SECTIONS } from './data/walletData';

// Pages that can be reached directly through the URL hash
const ROUTABLE_PAGES: AppPage[] = [
  'about',
  'services',
  'countries',
  'work-visa',
  'blog',
  'appointment',
  'contact',
  'business-network',
  'legal',
];

// Standalone pages
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { CountriesPage } from './pages/CountriesPage';
import { WorkVisaPage } from './pages/WorkVisaPage';
import { BlogPage } from './pages/BlogPage';
import { AppointmentPage } from './pages/AppointmentPage';
import { ContactPage } from './pages/ContactPage';
import { BusinessNetworkPage } from './pages/BusinessNetworkPage';
import { LegalPage } from './pages/LegalPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [isDashboardView, setIsDashboardView] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('payments');
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [selectedCountryForAppointment, setSelectedCountryForAppointment] = useState('United States');
  // Country guide to open directly when jumping from the home page destination picker
  const [countryGuideDeepLink, setCountryGuideDeepLink] = useState<string | undefined>(undefined);

  // Check URL params on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace('#', '');

    if (params.get('view') === 'dashboard' || hash === 'dashboard' || params.get('utm_source') === 'chrome') {
      setIsDashboardView(true);
    } else if (hash && (ROUTABLE_PAGES as string[]).includes(hash)) {
      setCurrentPage(hash as AppPage);
    }
  }, []);

  // Update document title dynamically
  useEffect(() => {
    if (isDashboardView) {
      document.title = 'VisaHOBe Client Portal';
    } else {
      switch (currentPage) {
        case 'about':
          document.title = 'About Us | VisaHOBe - Global Visa Support';
          break;
        case 'services':
          document.title = 'Visa Services & Document Checklists | VisaHOBe';
          break;
        case 'countries':
          document.title = 'Country Visa Guides (US, UK, Schengen) | VisaHOBe';
          break;
        case 'work-visa':
          document.title = 'Work Visa & Skilled Overseas Employment Info | VisaHOBe';
          break;
        case 'blog':
          document.title = 'Visa Guides, Checklists & Refusal Insights | VisaHOBe';
          break;
        case 'appointment':
          document.title = 'Book a Consultation | VisaHOBe';
          break;
        case 'contact':
          document.title = 'Contact & Support Desks | VisaHOBe';
          break;
        case 'business-network':
          document.title = 'B2B Partner Network & Corporate Portal | VisaHOBe';
          break;
        case 'legal':
          document.title = 'Policies, Terms & Consular Disclaimer | VisaHOBe';
          break;
        default:
          document.title = 'VisaHOBe - Your Trusted Partner for Global Visa Support';
      }
    }
  }, [isDashboardView, currentPage]);

  // Scroll spy to highlight active section in Jumplinks bar on Home page
  useEffect(() => {
    if (currentPage !== 'home' || isDashboardView) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220;

      for (let i = FEATURE_SECTIONS.length - 1; i >= 0; i--) {
        const sec = FEATURE_SECTIONS[i];
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sec.id);
            return;
          }
        }
      }

      if (window.scrollY < 600) {
        setActiveSection(FEATURE_SECTIONS[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, isDashboardView]);

  const handleSelectSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -140;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleNavigatePage = (page: AppPage) => {
    setIsDashboardView(false);
    setCurrentPage(page);
    // A country deep link only lives for the Countries page it was created for
    if (page !== 'countries') setCountryGuideDeepLink(undefined);
    window.history.pushState({ page }, '', `#${page === 'home' ? '' : page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCountryGuide = (countryName: string) => {
    setCountryGuideDeepLink(countryName);
    setIsDashboardView(false);
    setCurrentPage('countries');
    window.history.pushState({ page: 'countries' }, '', '#countries');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLogin = () => {
    setIsDashboardView(true);
    window.history.pushState({ view: 'dashboard' }, '', '#dashboard');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleExitDashboard = () => {
    setIsDashboardView(false);
    window.history.pushState({ page: currentPage }, '', `#${currentPage === 'home' ? '' : currentPage}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateFaq = () => {
    if (currentPage !== 'home') {
      handleNavigatePage('home');
    }
    window.setTimeout(() => {
      document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleOpenBooking = (countryName?: string) => {
    if (countryName) {
      setSelectedCountryForAppointment(countryName);
    }
    handleNavigatePage('appointment');
  };

  // Browser history popstate handler
  useEffect(() => {
    const syncRouteFromLocation = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'dashboard' || window.location.search.includes('view=dashboard')) {
        setIsDashboardView(true);
        return;
      }
      setIsDashboardView(false);
      if (!hash) {
        setCurrentPage('home');
        return;
      }
      // Leave in-page anchors (#faqs, #page-content, section ids) on the current route
      if ((ROUTABLE_PAGES as string[]).includes(hash)) {
        setCurrentPage(hash as AppPage);
      }
    };
    window.addEventListener('popstate', syncRouteFromLocation);
    // Makes plain <a href="#services"> links (feature section CTAs, dashboard links) work
    window.addEventListener('hashchange', syncRouteFromLocation);
    return () => {
      window.removeEventListener('popstate', syncRouteFromLocation);
      window.removeEventListener('hashchange', syncRouteFromLocation);
    };
  }, []);

  // View: Client Portal Dashboard
  if (isDashboardView) {
    return (
      <>
        <IconsMap />
        <GoogleWalletDashboard onExit={handleExitDashboard} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f0ec] text-[#3c4043] flex flex-col selection:bg-[#c2e7ff] relative">
      {/* SVG Symbols Definition */}
      <IconsMap />

      {/* Header */}
      <Header
        currentPage={currentPage}
        onNavigatePage={handleNavigatePage}
        onOpenPortal={handleOpenLogin}
        onOpenConsultation={() => handleOpenBooking()}
      />

      {/* Main Content Area */}
      <main id="page-content" className="flex-1">
        {currentPage === 'home' && (
          <>
            {/* Hero Section */}
            <Hero
              onBookConsultation={() => handleOpenBooking()}
              onOpenPortal={handleOpenLogin}
            />

            {/* Quick Popular Destinations Bar */}
            <PopularDestinationsPicker
              onSelectCountry={handleOpenCountryGuide}
              onViewAllCountries={() => handleNavigatePage('countries')}
            />

            {/* Floating / Sticky Jumplinks Bar */}
            <JumplinksBar
              activeSection={activeSection}
              onSelectSection={handleSelectSection}
            />

            {/* Feature stack intro */}
            <div className="mx-auto max-w-3xl px-4 pb-2 pt-4 text-center sm:pt-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/75 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.13em] text-[#5f6368] shadow-2xs backdrop-blur-sm">
                <span className="material-icons text-[14px] leading-none text-[#1a73e8]">explore</span>
                Inside the portal
              </span>
              <h2 className="mt-4 text-[26px] font-bold leading-tight tracking-tight text-[#202124] sm:text-4xl">
                Eight essentials, one clear visa journey
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-[#5f6368] sm:text-[15.5px]">
                From consular fee receipts to passport return — every step of your file, tracked
                and explained in plain language.
              </p>
            </div>

            {/* 8 Feature Sections */}
            <div className="space-y-4">
              {FEATURE_SECTIONS.map((section, idx) => (
                <FeatureSection
                  key={section.id}
                  section={section}
                  index={idx}
                />
              ))}
            </div>

            {/* Access Across Google Section */}
            <AccessSection />

            {/* Bottom Call to Action Promo */}
            <BottomPromo
              onBookConsultation={() => handleOpenBooking()}
              onOpenPortal={handleOpenLogin}
              onOpenDemo={() => setIsSimulatorOpen(true)}
            />

            {/* FAQ Section */}
            <FAQSection />
          </>
        )}

        {currentPage === 'about' && (
          <AboutPage
            onOpenConsultation={() => handleOpenBooking()}
            onOpenPortal={handleOpenLogin}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage onBookConsultation={() => handleOpenBooking()} />
        )}

        {currentPage === 'countries' && (
          <CountriesPage
            initialCountryName={countryGuideDeepLink}
            onBookConsultation={(country) => handleOpenBooking(country)}
            onOpenPortal={handleOpenLogin}
          />
        )}

        {currentPage === 'work-visa' && (
          <WorkVisaPage
            onBookConsultation={() => handleOpenBooking()}
          />
        )}

        {currentPage === 'blog' && (
          <BlogPage
            onBookConsultation={() => handleOpenBooking()}
          />
        )}

        {currentPage === 'appointment' && (
          <AppointmentPage
            initialCountry={selectedCountryForAppointment}
            onBookingSuccess={() => handleNavigatePage('home')}
          />
        )}

        {currentPage === 'contact' && <ContactPage />}

        {currentPage === 'business-network' && (
          <BusinessNetworkPage
            onOpenPortal={handleOpenLogin}
          />
        )}

        {currentPage === 'legal' && <LegalPage />}
      </main>

      {/* Footer */}
      <Footer
        onNavigatePage={handleNavigatePage}
        onNavigateFaq={handleNavigateFaq}
      />

      {/* Floating Bottom-Right QR Code Widget */}
      <FloatingQRCode onOpenDownloadModal={() => setIsDownloadModalOpen(true)} />

      {/* Floating Pill: Quick Launcher to Client Portal */}
      <div className="fixed bottom-6 left-6 z-40 hidden md:block">
        <button
          type="button"
          onClick={handleOpenLogin}
          className="bg-white/95 hover:bg-white text-neutral-800 text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg border border-black/10 flex items-center gap-2 hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
          title="Open VisaHOBe Client Portal"
        >
          <span className="material-icons text-[#1a73e8] text-base">dashboard</span>
          <span>Log into VisaHOBe Portal</span>
        </button>
      </div>

      {/* Download App QR Code Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      {/* Live VisaHOBe Terminal & Pass Simulator Modal */}
      <WalletSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />
    </div>
  );
}

export default App;
