import React, { useState } from 'react';
import { Button } from '../components/ui';

interface BusinessNetworkPageProps {
  onOpenPortal: () => void;
  onBookConsultation?: () => void;
}

export const BusinessNetworkPage: React.FC<BusinessNetworkPageProps> = ({
  onOpenPortal,
}) => {
  const [partnerType, setPartnerType] = useState('travel-agency');
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-left space-y-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 shadow-2xs">
          <span className="material-icons text-blue-600 text-sm">hub</span>
          <span className="text-xs font-semibold text-[#1f1f1f] tracking-wide">
            B2B Partner Network & Corporate Portal
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#202124] tracking-tight">
          VisaHOBe Business Network
        </h1>
        <p className="text-base sm:text-lg text-[#5f6368] leading-relaxed">
          Empowering travel agencies, corporate HR departments, and educational consultants with
          streamlined visa documentation, bulk tracking, and transparent administrative execution.
        </p>
      </div>

      {/* Partner Pillars with Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="w-full h-40 overflow-hidden relative">
            <img
              src="https://images.pexels.com/photos/16453351/pexels-photo-16453351.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
              alt="Travel Agencies B2B"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/95 text-blue-600 flex items-center justify-center shadow-md">
              <span className="material-icons text-xl">travel_explore</span>
            </div>
          </div>
          <div className="p-6 space-y-2">
            <h2 className="text-lg font-bold text-[#202124]">Travel Agencies (B2B)</h2>
            <p className="text-xs sm:text-sm text-[#5f6368] leading-relaxed">
              Expand your agency's offerings by partnering with VisaHOBe for professional visa form
              filling, appointment monitoring, and document pre-screening for your tour groups.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="w-full h-40 overflow-hidden relative">
            <img
              src="https://images.pexels.com/photos/20752572/pexels-photo-20752572.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
              alt="Corporate Accounts"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/95 text-emerald-700 flex items-center justify-center shadow-md">
              <span className="material-icons text-xl">business</span>
            </div>
          </div>
          <div className="p-6 space-y-2">
            <h2 className="text-lg font-bold text-[#202124]">Corporate Accounts</h2>
            <p className="text-xs sm:text-sm text-[#5f6368] leading-relaxed">
              Centralized management of corporate executive visas, business travel clearances, and
              conference delegations with dedicated account management and monthly billing.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="w-full h-40 overflow-hidden relative">
            <img
              src="https://images.pexels.com/photos/4922356/pexels-photo-4922356.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
              alt="Education Advisors"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/95 text-purple-700 flex items-center justify-center shadow-md">
              <span className="material-icons text-xl">school</span>
            </div>
          </div>
          <div className="p-6 space-y-2">
            <h2 className="text-lg font-bold text-[#202124]">Education Advisors</h2>
            <p className="text-xs sm:text-sm text-[#5f6368] leading-relaxed">
              Comprehensive student visa file coordination, document attestation chains, and
              compliance reviews for higher study in the UK, USA, Canada, Australia, and Europe.
            </p>
          </div>
        </div>
      </div>

      {/* Corporate Features List */}
      <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-xs space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#202124]">Corporate Travel Portal Capabilities</h2>
          <p className="text-sm text-[#5f6368] mt-1">
            Built specifically to reduce travel administrative overhead for growing organizations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-700">
          <div className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
            <span className="material-icons text-blue-600 text-lg">calendar_month</span>
            <div>
              <p className="font-bold text-neutral-900 text-sm">Travel Calendar & Reminders</p>
              <p className="text-neutral-500 mt-0.5">Automated notifications for passport expiries and business visa validity renewals.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
            <span className="material-icons text-emerald-600 text-lg">receipt</span>
            <div>
              <p className="font-bold text-neutral-900 text-sm">Itemized Monthly Invoicing</p>
              <p className="text-neutral-500 mt-0.5">Transparent accounting with strict separation of consular fees and corporate service rates.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
            <span className="material-icons text-purple-600 text-lg">folder_shared</span>
            <div>
              <p className="font-bold text-neutral-900 text-sm">Secure Document Repository</p>
              <p className="text-neutral-500 mt-0.5">Encrypted storage for corporate registration docs, trade licenses, and invitation templates.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
            <span className="material-icons text-amber-600 text-lg">support_agent</span>
            <div>
              <p className="font-bold text-neutral-900 text-sm">Dedicated Account Officer</p>
              <p className="text-neutral-500 mt-0.5">Direct contact with senior consular specialists for urgent executive itineraries.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Registration Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-black/5 shadow-xs">
        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <span className="material-icons text-3xl">check</span>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900">Partner Inquiry Received</h3>
            <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
              Thank you, {contactPerson}. Our B2B partnership coordinator will review{' '}
              <strong>{companyName}</strong>'s profile and contact you at <strong>{email}</strong>{' '}
              to set up an onboarding briefing.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={onOpenPortal}
              leadingIcon="dashboard"
              trailingIcon="arrow_forward"
            >
              Explore Partner Dashboard Demo
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <h2 className="text-xl font-bold text-[#202124]">Apply to Join the VisaHOBe Partner Network</h2>
            <p className="text-xs text-neutral-500 mb-4">
              Partners must be officially registered entities with valid trade licenses. We conduct
              due diligence to ensure strict compliance with anti-fraud guidelines.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Company / Agency Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Skyline Travel & Tours Ltd."
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Partner Type
                </label>
                <select
                  value={partnerType}
                  onChange={(e) => setPartnerType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8] bg-white cursor-pointer"
                >
                  <option value="travel-agency">Travel Agency / Tour Operator</option>
                  <option value="corporate-client">Corporate Account / Enterprise</option>
                  <option value="education-consultant">Education Consultant</option>
                  <option value="recruiting-partner">Licensed Recruiting Partner (RL Holder)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Contact Person & Title
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Managing Director / HR Head"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Official Business Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="corporate@company.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                  required
                />
              </div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-500">
              Joining the network does not grant "official embassy agent" status. Partners must
              not promise guaranteed visa approvals or collect unauthorized fees from clients.
            </div>

            <div className="flex flex-col-reverse items-stretch justify-end gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center">
              <p className="flex-1 text-[11px] leading-relaxed text-neutral-500">
                Applications are reviewed within 3 business days after trade-licence verification.
              </p>
              <Button type="submit" variant="primary" size="lg" leadingIcon="send">
                Submit Partner Application
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
