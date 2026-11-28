import React, { useState } from 'react';

export const LegalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'disclaimer' | 'refund' | 'privacy' | 'terms' | 'fraud'>('disclaimer');

  return (
    <div className="ambient-wash mx-auto max-w-4xl space-y-12 animate-in fade-in px-4 py-10 text-left duration-300 sm:px-6 sm:py-16 lg:px-8">
      {/* Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 shadow-2xs">
          <span className="material-icons text-blue-600 text-sm">policy</span>
          <span className="text-xs font-semibold text-[#1f1f1f] tracking-wide">
            Legal Terms, Policies & Compliance Hub
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#202124] tracking-tight">
          Policies & Compliance
        </h1>
        <p className="text-base sm:text-lg text-[#5f6368] leading-relaxed">
          VisaHOBe operates under strict ethical and legal guidelines. Review our terms, fee
          separation policies, data handling principles, and anti-fraud commitments.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-neutral-200">
        {[
          { id: 'disclaimer', label: 'Consular Disclaimer' },
          { id: 'refund', label: 'Refund & Cancellation' },
          { id: 'privacy', label: 'Privacy & Data Protection' },
          { id: 'terms', label: 'Terms & Conditions' },
          { id: 'fraud', label: 'Anti-Fraud Policy' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#1a73e8] text-white shadow-2xs'
                : 'text-[#5f6368] hover:text-[#1f1f1f] hover:bg-neutral-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Panes */}
      <div className="glass glass-sheen rounded-3xl p-6 sm:p-10 space-y-6 text-sm text-[#3c4043] leading-relaxed">
        {activeTab === 'disclaimer' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#202124]">Visa Services Legal Disclaimer</h2>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-medium">
              VisaHOBe (proposed legal display: VisaHOBe PTE. LTD.) is an independent visa-support and application assistance service. We are not an embassy, consulate, government immigration department, or authorized visa application centre (VFS Global / TLScontact).
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-[#202124] text-base">1. Final Decision-Making Authority</h3>
              <p>
                All decisions regarding the issuance, delay, refusal, or cancellation of any travel visa, work permit, residency card, or electronic authorization are made solely and exclusively by the consular officers and immigration authorities of the destination country. VisaHOBe has no influence, privileged relationship, or ability to alter official decisions.
              </p>

              <h3 className="font-bold text-[#202124] text-base">2. No Guarantee of Outcome</h3>
              <p>
                VisaHOBe strictly rejects and forbids false marketing claims such as "100% Visa Guarantee", "Sure Visa", or "Confirmed Job". Engaging our services guarantees only thorough, accurate, and professional administrative support and document checklist guidance.
              </p>

              <h3 className="font-bold text-[#202124] text-base">3. Applicant Truthfulness</h3>
              <p>
                Applicants remain solely responsible for the authenticity, legality, and factual accuracy of all submitted information and documents. Providing fraudulent documents or failing to disclose prior visa refusals constitutes statutory misrepresentation and may lead to permanent entry bans under foreign immigration codes.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'refund' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#202124]">Refund & Cancellation Policy</h2>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-[#001d35] text-xs">
              We maintain absolute transparency regarding what is refundable and what is non-refundable before any payment is initiated.
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-[#202124] text-base">1. Separation of Fees</h3>
              <p>
                <strong>Government & Embassy Fees:</strong> Official fees paid to embassies, consulates, immigration departments, or authorized application centers (e.g., U.S. MRV fees, Schengen visa fees, VFS biometric charges) are collected directly on government gateways. These fees are strictly non-refundable under official government policies, regardless of application outcome.
              </p>
              <p>
                <strong>VisaHOBe Service Fees:</strong> Fees charged for consultation, document checklist preparation, and application form assistance.
              </p>

              <h3 className="font-bold text-[#202124] text-base">2. Cancellation Rules</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Cancellation prior to work commencement:</strong> Eligible for a full refund minus nominal banking transaction fees if requested within 24 hours of booking.</li>
                <li><strong>Cancellation after document review has begun:</strong> Subject to a 50% administrative fee to cover labor and advisory research already conducted.</li>
                <li><strong>Cancellation after application form completion or submission:</strong> Service fees are non-refundable once drafts have been finalized and delivered to the applicant.</li>
                <li><strong>Visa Refusal:</strong> Because our fee compensates professional advisory and administrative labor, service fees are non-refundable in the event of an embassy refusal.</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#202124]">Privacy & Data Protection Policy</h2>
            <p>
              VisaHOBe treats your personal and travel documentation with the utmost confidentiality. We comply with applicable data protection principles to ensure your identity remains protected.
            </p>

            <div className="space-y-4">
              <h3 className="font-bold text-[#202124] text-base">1. Information We Collect</h3>
              <p>
                We collect only the information strictly necessary to assist with your visa application: full passport biodata, educational/employment credentials, financial proof submitted by you, travel itineraries, and contact details.
              </p>

              <h3 className="font-bold text-[#202124] text-base">2. What We Never Ask For</h3>
              <p>
                VisaHOBe will never request your online banking login credentials, net banking passwords, or one-time verification SMS codes (OTPs). Any request for such credentials by individuals claiming to represent VisaHOBe should be reported immediately.
              </p>

              <h3 className="font-bold text-[#202124] text-base">3. Document Storage & Deletion</h3>
              <p>
                All digital uploads in our Client Portal are stored in 256-bit SSL encrypted repositories with least-privilege staff access. Upon conclusion of your service or upon written request, you have the right to request the permanent deletion of your uploaded documents from our servers.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#202124]">Terms & Conditions of Service</h2>
            <div className="space-y-4">
              <h3 className="font-bold text-[#202124] text-base">1. Scope of Agreement</h3>
              <p>
                By booking a consultation, submitting an inquiry, or engaging VisaHOBe for application assistance, you agree to these terms. Our engagement constitutes an administrative consultancy relationship, not legal representation.
              </p>

              <h3 className="font-bold text-[#202124] text-base">2. Third-Party Delays & Processing Times</h3>
              <p>
                Published processing timelines are estimates derived from official embassy averages. Embassy workload, diplomatic holidays, background checks, or administrative processing (e.g., 221(g) reviews) may extend turnaround beyond standard expectations. VisaHOBe is not liable for travel cancellations resulting from consular delays.
              </p>

              <h3 className="font-bold text-[#202124] text-base">3. Limitation of Liability</h3>
              <p>
                VisaHOBe shall not be liable for any indirect, consequential, or incidental damages, including flight booking cancellations or hotel cancellation penalties, resulting from visa refusals or delays imposed by foreign immigration authorities.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'fraud' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#202124]">Zero-Tolerance Anti-Fraud Policy</h2>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs font-semibold">
              VisaHOBe enforces an absolute zero-tolerance policy against document fabrication, forged financial statements, and unauthorized human trafficking.
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-[#202124] text-base">1. Prohibition of Forged Documentation</h3>
              <p>
                We do not produce, source, alter, or accept fraudulent bank solvency certificates, fake tax returns, fabricated employment experience letters, or counterfeit educational diplomas. Any applicant attempting to introduce forged documents will have their file terminated immediately with zero refund.
              </p>

              <h3 className="font-bold text-[#202124] text-base">2. Overseas Employment Safeguards</h3>
              <p>
                We strictly oppose the illegal practice of sending jobseekers abroad on visit visas with false promises of employment. All skilled worker guidance requires verified contracts through official platforms (such as Saudi Qiwa or UAE MOHRE) and government-licensed recruiting partners.
              </p>

              <h3 className="font-bold text-[#202124] text-base">3. Reporting Fraud</h3>
              <p>
                If you suspect any agent or third party of fraudulently using the VisaHOBe brand name or promising "guaranteed visas", please report the matter immediately to our compliance desk at <strong>compliance@visahobe.com</strong>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
