import React from 'react';
import { Button } from '../components/ui';

interface AboutPageProps {
  onOpenConsultation: () => void;
  onOpenPortal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenConsultation, onOpenPortal }) => {
  return (
    <div className="ambient-wash mx-auto max-w-5xl space-y-16 animate-in fade-in px-4 py-10 text-left duration-300 sm:px-6 sm:py-16 lg:px-8">
      {/* Hero Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 shadow-2xs">
          <span className="material-icons text-blue-600 text-sm">verified</span>
          <span className="text-xs font-semibold text-[#1f1f1f] tracking-wide">
            Master Company Profile & Operational Transparency
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#202124] tracking-tight">
          About Visa<span className="text-[#1a73e8]">HOBe</span>
        </h1>
        <p className="text-base sm:text-lg text-[#5f6368] leading-relaxed">
          VisaHOBe (proposed legal display: VisaHOBe PTE. LTD.) is an independent visa-support and
          application assistance institution founded to bring clarity, ethical governance, and
          uncompromising transparency to international visa procedures.
        </p>
      </div>

      {/* Brand Identity & Core Purpose */}
      <div className="glass glass-sheen rounded-3xl p-8 sm:p-10 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#202124]">Who We Are & What Drives Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#3c4043] leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-neutral-900">An Independent Support Organization</h3>
            <p>
              Navigating foreign consulates, shifting biometric regulations, and complex online portals
              can be daunting for travelers in Bangladesh and across developing regions. VisaHOBe was
              established to serve as an honest bridge—transforming confusing statutory legal jargon into
              clear, actionable, and verified checklists.
            </p>
            <p>
              We are neither an embassy nor an immigration tribunal. We do not claim official
              government endorsement where none exists. Our expertise lies in administrative document
              organization, rigorous cross-checking, and ensuring your genuine travel story is
              substantiated accurately in every official filing.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-neutral-900">Rebuilding Trust in Visa Consulting</h3>
            <p>
              The visa consulting sector has long been plagued by deceptive middlemen promising "100%
              guaranteed approvals", circulating counterfeit flight bookings, and encouraging
              fraudulent bank statements. VisaHOBe actively combats this culture of misinformation.
            </p>
            <p>
              Our working philosophy is simple: <strong>Truthful documentation yields the most sustainable
              outcomes.</strong> When a client does not yet qualify, we provide honest assessments rather
              than taking fees for applications destined to fail.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass glass-sheen rounded-3xl p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0b57d0] flex items-center justify-center">
            <span className="material-icons text-2xl">flag</span>
          </div>
          <h2 className="text-2xl font-bold text-[#202124]">Our Mission</h2>
          <p className="text-sm sm:text-base text-[#5f6368] leading-relaxed">
            To empower applicants, families, students, and businesses with authentic, up-to-date
            consular knowledge, verified document checklists, and rigorous form preparation—ensuring
            every file strictly complies with international diplomatic standards while respecting
            the sovereign authority of destination nations.
          </p>
        </div>

        <div className="glass glass-sheen rounded-3xl p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <span className="material-icons text-2xl">visibility</span>
          </div>
          <h2 className="text-2xl font-bold text-[#202124]">Our Vision</h2>
          <p className="text-sm sm:text-base text-[#5f6368] leading-relaxed">
            To become the most dependable and ethical cross-border travel support institution across
            South Asia and international corridors—eradicating recruitment fraud, eliminating deceptive
            promises, and providing transparent, dignity-first service to every traveler.
          </p>
        </div>
      </div>

      {/* 10-Step operational workflow */}
      <div className="glass glass-sheen rounded-3xl p-8 sm:p-10 space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#202124]">Our 10-Step Operational Workflow</h2>
          <p className="text-sm text-[#5f6368] mt-1">How every file is managed from initial inquiry to final passport delivery</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-700">
          {[
            { step: '01', title: 'Initial Inquiry & Scope Check', desc: 'We verify your destination, passport nationality, and confirm whether VisaHOBe can lawfully assist with your category.' },
            { step: '02', title: 'Preliminary Assessment', desc: 'Objective evaluation of your travel history, financial ties, and purpose of visit without false promises.' },
            { step: '03', title: 'Official Checklist Review', desc: 'Generation of a personalized document checklist mapped directly to the embassy’s latest published circular.' },
            { step: '04', title: 'Secure Document Intake', desc: 'Passports, employment papers, and tax certificates are received through our encrypted Client Portal repository.' },
            { step: '05', title: 'Administrative Form Filling', desc: 'Meticulous data entry on official forms (DS-160, Schengen, UKVI) strictly using client-verified records.' },
            { step: '06', title: 'Applicant Audit & Declaration', desc: 'You inspect and approve every single typed field before any official submission takes place.' },
            { step: '07', title: 'Submission Protocol', desc: 'Direct submission by the applicant or authorized VFS/mission channel in accordance with jurisdictional rules.' },
            { step: '08', title: 'Official Status Monitoring', desc: 'Continuous tracking of embassy milestones and immediate communication of official updates.' },
            { step: '09', title: 'Passport & Delivery Logistics', desc: 'Coordination of secure return courier delivery with tamper-evident tracking numbers.' },
            { step: '10', title: 'Case Closure & Review', desc: 'Issuance of final itemized receipt, file archival, and escalation channel for post-service feedback.' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-3">
              <span className="font-mono text-base font-bold text-blue-600 shrink-0">{item.step}</span>
              <div>
                <p className="font-bold text-neutral-900 text-sm mb-0.5">{item.title}</p>
                <p className="text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safe Wording Matrix (Appendix B of Master Document) */}
      <div className="glass glass-sheen rounded-3xl p-8 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#202124]">Our Strict Safe Wording Standard</h2>
          <p className="text-xs text-[#5f6368] mt-0.5">
            We hold ourselves to the highest consumer protection benchmarks in immigration communications.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-neutral-200 rounded-xl overflow-hidden">
            <thead className="bg-[#f0f4f9] text-[#001d35] font-bold">
              <tr>
                <th className="p-3 border-b border-neutral-200 text-rose-700">Deceptive Terminology We Refuse to Use</th>
                <th className="p-3 border-b border-neutral-200 text-emerald-800">VisaHOBe Transparent Commitment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-700">
              <tr>
                <td className="p-3 font-semibold text-rose-900 bg-rose-50/30">"100% Visa Guarantee" / "Sure Visa"</td>
                <td className="p-3 text-emerald-950 bg-emerald-50/30">No visa outcome can ever be guaranteed. Decisions belong solely to the embassy.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-rose-900 bg-rose-50/30">"Official Embassy Agent"</td>
                <td className="p-3 text-emerald-950 bg-emerald-50/30">Independent visa-support agency providing administrative document assistance.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-rose-900 bg-rose-50/30">"Guaranteed Job in Saudi Arabia / Europe"</td>
                <td className="p-3 text-emerald-950 bg-emerald-50/30">Educational work visa guidance; recruitment only through licensed RL partners.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-rose-900 bg-rose-50/30">"Visa in 3 Days Guaranteed"</td>
                <td className="p-3 text-emerald-950 bg-emerald-50/30">Published timelines are official embassy averages; actual processing varies by case.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-rose-900 bg-rose-50/30">"No Documents or Bank Statement Needed"</td>
                <td className="p-3 text-emerald-950 bg-emerald-50/30">All applications require legitimate evidence of funds, travel ties, and purpose.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Verified Corporate Identity Audit */}
      <div className="bg-[#e8f0fe] rounded-3xl p-8 border border-[#d2e3fc] space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-icons text-[#0b57d0] text-2xl">account_balance</span>
          <h2 className="text-xl font-bold text-[#001d35]">Corporate Identity & Placeholders Audit</h2>
        </div>
        <p className="text-xs sm:text-sm text-[#3c4043] leading-relaxed">
          In strict compliance with our Master Governance Brief, VisaHOBe does not invent registration numbers, branch offices, or unauthorized partnerships. Below is the active verification disclosure:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-[#001d35] pt-2">
          <div className="bg-white/80 p-3 rounded-xl border border-[#c2e7ff]">
            <p className="font-bold text-[11px] text-neutral-500 uppercase">Brand Name</p>
            <p className="font-bold text-neutral-900 text-sm mt-0.5">VisaHOBe</p>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-[#c2e7ff]">
            <p className="font-bold text-[11px] text-neutral-500 uppercase">Legal Entity Display</p>
            <p className="font-bold text-neutral-900 text-sm mt-0.5">VisaHOBe PTE. LTD. (Pending Registry)</p>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-[#c2e7ff]">
            <p className="font-bold text-[11px] text-neutral-500 uppercase">Primary Operating Hub</p>
            <p className="font-bold text-neutral-900 text-sm mt-0.5">Dhaka, Bangladesh</p>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-[#c2e7ff]">
            <p className="font-bold text-[11px] text-neutral-500 uppercase">Recruitment Permissions</p>
            <p className="font-bold text-neutral-900 text-sm mt-0.5">Exclusively with Licensed RLs</p>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="text-center pt-4 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-[#202124]">
          Experience visa assistance backed by integrity and accuracy.
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={onOpenConsultation}
            leadingIcon="calendar_month"
          >
            Schedule a Confidential Consultation
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={onOpenPortal}
            leadingIcon="dashboard"
          >
            Access Client Portal
          </Button>
        </div>
      </div>
    </div>
  );
};
