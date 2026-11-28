import React, { useEffect, useRef, useState } from 'react';
import { useToast } from './PortalToast';
import type { PortalProfile } from '../../lib/portalStore';

export type DashboardTab =
  | 'home'
  | 'agent'
  | 'passes'
  | 'paymentmethods'
  | 'transactions'
  | 'settings';

interface DashboardLayoutProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onExitDashboard: () => void;
  profile: PortalProfile;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  onSelectTab,
  onExitDashboard,
  profile,
  children,
}) => {
  const { notify } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const headerMenusRef = useRef<HTMLDivElement>(null);

  // Header dropdowns close on outside click / Escape like a real portal
  useEffect(() => {
    const closeMenus = () => {
      setIsProfileMenuOpen(false);
      setIsHelpMenuOpen(false);
    };
    const handlePointerDown = (event: MouseEvent) => {
      if (headerMenusRef.current && !headerMenusRef.current.contains(event.target as Node)) {
        closeMenus();
      }
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

  // Final client-facing navigation. Payment history stays reachable from the
  // Payments view and the dashboard cards.
  const navItems: { id: DashboardTab; label: string; icon: string; path: string }[] = [
    { id: 'home', label: 'Dashboard', icon: 'dashboard', path: '/portal/dashboard' },
    { id: 'agent', label: 'AI Visa Agent', icon: 'auto_awesome', path: '/portal/ai-visa-agent' },
    { id: 'passes', label: 'My Applications', icon: 'folder_shared', path: '/portal/applications' },
    { id: 'paymentmethods', label: 'Payments', icon: 'payments', path: '/portal/payments' },
    { id: 'settings', label: 'My Profile', icon: 'person', path: '/portal/profile' },
  ];

  const currentPath = navItems.find((n) => n.id === currentTab)?.path || '/portal/home';

  return (
    <div className="ambient-wash flex min-h-screen flex-col bg-[#f0f4f9] text-[#1f1f1f] font-['Google_Sans_Text',Roboto,sans-serif]">
      {/* 1. Chrome Browser URL Bar Simulation */}
      <div className="glass-bar sticky top-0 z-50 flex select-none items-center justify-between px-3 py-1.5 text-xs text-[#444746]">
        <div className="flex items-center gap-2 overflow-hidden flex-1 max-w-4xl">
          <button
            onClick={onExitDashboard}
            className="p-1 hover:bg-[#d3e3fd] rounded-full text-neutral-600 transition-colors cursor-pointer"
            title="Back to VisaHOBe overview site"
          >
            <span className="material-icons text-base">arrow_back</span>
          </button>
          <button
            onClick={() => window.location.reload()}
            className="p-1 hover:bg-[#d3e3fd] rounded-full text-neutral-600 transition-colors hidden sm:block cursor-pointer"
            title="Reload"
          >
            <span className="material-icons text-base">refresh</span>
          </button>

          <div className="glass-thin flex flex-1 items-center gap-2 truncate rounded-full px-3.5 py-1">
            <span className="material-icons text-neutral-600 text-sm">lock</span>
            <span className="font-mono text-[11px] sm:text-xs text-[#1f1f1f] truncate">
              https://visahobe.com{currentPath}?utm_medium=settings&utm_campaign=paymentmethods&utm_source=chrome
            </span>
          </div>
        </div>

        <button
          onClick={onExitDashboard}
          className="ml-3 px-3 py-1 text-xs font-semibold text-[#0b57d0] hover:bg-[#d3e3fd] rounded-full transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          title="Exit to VisaHOBe public overview"
        >
          <span className="material-icons text-sm">open_in_new</span>
          <span className="hidden sm:inline">Exit to visahobe.com</span>
        </button>
      </div>

      {/* 2. Top Header (Material 3 style) */}
      <header className="h-16 px-4 sm:px-6 bg-[#f0f4f9] flex items-center justify-between sticky top-[37px] z-40">
        {/* Left: Hamburger & Brand Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (window.matchMedia('(min-width: 768px)').matches) {
                setIsSidebarOpen(!isSidebarOpen);
              } else {
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }
            }}
            className="p-2.5 text-[#444746] hover:text-[#1f1f1f] hover:bg-[#001d35]/5 rounded-full transition-colors cursor-pointer"
            aria-label="Toggle navigation drawer"
            aria-expanded={isMobileMenuOpen || isSidebarOpen}
          >
            <span className="material-icons text-2xl">menu</span>
          </button>

          {/* VisaHOBe Brand Mark in Header */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none pl-1"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1a73e8] to-[#0d47a1] text-white flex items-center justify-center shadow-2xs">
              <span className="material-icons text-lg">verified_user</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-['Google_Sans',Roboto,sans-serif] text-[21px] font-bold text-[#1f1f1f] tracking-tight">
                Visa<span className="text-[#1a73e8]">HOBe</span>
              </span>
              <span className="text-xs text-[#5f6368] font-medium hidden sm:inline">
                Client Portal
              </span>
            </div>
          </div>
        </div>

        {/* Right: Help, Apps, Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3" ref={headerMenusRef}>
          {/* Help button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
              className="p-2.5 text-[#444746] hover:text-[#1f1f1f] hover:bg-[#001d35]/5 rounded-full transition-colors cursor-pointer"
              title="Help and consular support"
            >
              <span className="material-icons text-xl">help_outline</span>
            </button>

            {isHelpMenuOpen && (
              <div className="glass-panel absolute right-0 z-50 mt-2 w-64 rounded-2xl py-2 text-left">
                <a
                  href="mailto:support@visahobe.com?subject=VisaHOBe%20portal%20support"
                  className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  VisaHOBe Help Center
                </a>
                <button
                  onClick={() => {
                    setIsHelpMenuOpen(false);
                    const reference = `VH-${Date.now().toString().slice(-6)}`;
                    notify(`Support ticket ${reference} created — our consular team replies within 24 hours.`);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  Submit Support Ticket
                </button>
              </div>
            )}
          </div>

          {/* Consular tools 9-dots button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsProfileMenuOpen(false);
                setIsHelpMenuOpen((open) => !open);
              }}
              className="p-2.5 text-[#444746] hover:text-[#1f1f1f] hover:bg-[#001d35]/5 rounded-full transition-colors cursor-pointer"
              title="VisaHOBe services"
              aria-label="VisaHOBe services"
              aria-expanded={isHelpMenuOpen}
            >
              <span className="material-icons text-xl">apps</span>
            </button>
          </div>

          {/* Green User Profile Avatar */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1e8e3e] text-white font-medium text-sm flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-xs ml-1"
              title={`Applicant account: ${profile.name} (${profile.email})`}
            >
              A
            </button>

            {isProfileMenuOpen && (
              <div
                className="glass-panel absolute right-0 z-50 mt-2 w-72 animate-in rounded-3xl p-4 text-center fade-in"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col items-center pb-3 border-b border-neutral-100">
                  <div className="w-16 h-16 rounded-full bg-[#1e8e3e] text-white font-bold text-2xl flex items-center justify-center mb-2 shadow-sm">
                    {(profile.name.trim().charAt(0) || 'A').toUpperCase()}
                  </div>
                  <p className="font-bold text-neutral-900 text-base">{profile.name}</p>
                  <p className="text-xs text-neutral-500">{profile.email}</p>
                  <span className="mt-2 text-[11px] bg-emerald-50 text-emerald-700 font-medium px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Verified Applicant Account
                  </span>
                </div>

                <div className="py-3 space-y-2 text-left">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onSelectTab('settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 rounded-xl cursor-pointer"
                  >
                    <span className="material-icons text-base text-neutral-500">manage_accounts</span>
                    <span>Manage your applicant profile</span>
                  </button>

                  <button
                    onClick={onExitDashboard}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-xl cursor-pointer"
                  >
                    <span className="material-icons text-base text-blue-600">arrow_back</span>
                    <span>Back to public VisaHOBe website</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-neutral-100">
                  <button
                    onClick={onExitDashboard}
                    className="w-full py-2 px-3 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 3. Main Body with Exact Material 3 Sidebar & Cards */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col justify-between transition-all duration-200 shrink-0 ${
            isSidebarOpen ? 'w-64 px-3 py-2' : 'w-20 px-2 py-2 items-center'
          }`}
        >
          {/* Main Navigation Pill List */}
          <nav className="space-y-1 w-full" aria-label="Dashboard navigation">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                      : 'text-[#444746] hover:bg-[#001d35]/5'
                  } ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
                  title={item.label}
                >
                  <span
                    className={`material-icons text-xl ${
                      isActive ? 'text-[#001d35]' : 'text-[#444746]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {isSidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}

            {/* Separator / Margin */}
            <div className="my-3 border-t border-[#c4c7c5]/30 mx-2" />

            {/* Help & support */}
            <a
              href="mailto:support@visahobe.com?subject=VisaHOBe%20portal%20support"
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-full text-sm font-medium text-[#444746] hover:bg-[#001d35]/5 transition-colors ${
                !isSidebarOpen ? 'justify-center px-0' : ''
              }`}
              title="Help & support"
            >
              <span className="material-icons text-xl">help_outline</span>
              {isSidebarOpen && <span>Consular support</span>}
            </a>

            {/* Feedback */}
            <button
              type="button"
              onClick={() => notify('Thanks — your feedback was sent to the VisaHOBe service team.', 'info')}
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-full text-sm font-medium text-[#444746] hover:bg-[#001d35]/5 transition-colors cursor-pointer ${
                !isSidebarOpen ? 'justify-center px-0' : ''
              }`}
              title="Feedback"
            >
              <span className="material-icons text-xl">feedback</span>
              {isSidebarOpen && <span>Feedback</span>}
            </button>
          </nav>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 md:hidden bg-black/40 backdrop-blur-xs flex"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="w-72 bg-[#f0f4f9] h-full p-4 flex flex-col justify-between shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#c4c7c5]/40">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-blue-600">verified_user</span>
                    <span className="font-['Google_Sans',Roboto,sans-serif] text-xl font-bold text-[#1f1f1f]">
                      Visa<span className="text-[#1a73e8]">HOBe</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 text-neutral-500 hover:text-black rounded-full"
                  >
                    <span className="material-icons text-xl">close</span>
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-full text-sm font-medium ${
                          isActive
                            ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                            : 'text-[#444746] hover:bg-neutral-200/50'
                        }`}
                      >
                        <span className="material-icons text-xl">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-[#c4c7c5]/40 text-xs text-neutral-500">
                <button
                  onClick={onExitDashboard}
                  className="w-full py-2 text-blue-600 font-medium text-left flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-icons text-sm">arrow_back</span>
                  <span>Exit to VisaHOBe public site</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
