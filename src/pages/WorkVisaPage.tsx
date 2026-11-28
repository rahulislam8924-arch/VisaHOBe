import React from 'react';
import { Button } from '../components/ui';

interface WorkVisaPageProps {
  onBookConsultation: () => void;
}

export const WorkVisaPage: React.FC<WorkVisaPageProps> = ({ onBookConsultation }) => {
  return (
    <div className="ambient-wash mx-auto max-w-5xl space-y-16 animate-in fade-in px-4 py-10 text-left duration-300 sm:px-6 sm:py-16 lg:px-8">
      {/* Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 shadow-2xs">
          <span className="material-icons text-amber-600 text-sm">engineering</span>
          <span className="text-xs font-semibold text-[#1f1f1f] tracking-wide">
            Overseas Employment Documentation & Skilled Worker Guidance
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#202124] tracking-tight">
          Work Visa & Employment Information
        </h1>
        <p className="text-base sm:text-lg text-[#5f6368] leading-relaxed">
          Navigate legitimate international work visa requirements with verified procedural guidance.
          Learn how to authenticate job offers, employer contracts, and official labor clearances
          without falling victim to fraudulent promises.
        </p>
      </div>

      {/* Mandatory Statutory Notice Banner */}
      <div className="bg-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-200 space-y-3">
        <div className="flex items-center gap-2 text-amber-900">
          <span className="material-icons text-amber-700 text-2xl">security</span>
          <h2 className="text-lg sm:text-xl font-bold">Important Notice on Regulated Overseas Recruitment</h2>
        </div>
        <p className="text-sm text-amber-950 leading-relaxed">
          <strong>VisaHOBe does not guarantee employment, work permits, or visa approvals.</strong> Any worker recruitment, job order placement, or worker deployment is offered strictly in collaboration with licensed recruiting agencies (RL holders) in Bangladesh and approved destination employers. Never pay unreceipted cash or travel on a tourist visa expecting to work illegally abroad.
        </p>
      </div>

      {/* Legal Work Permit vs Tourist Visa */}
      <div className="glass glass-sheen rounded-3xl p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#202124]">Work Permit vs Tourist Visa: The Legal Truth</h2>
          <p className="text-sm text-[#5f6368] mt-1">Understanding legal boundaries to prevent deportation, human trafficking, and permanent bans</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="p-5 rounded-2xl bg-[#f0f4f9] border border-neutral-200/80 space-y-3">
            <div className="flex items-center gap-2 text-[#0b57d0] font-bold">
              <span className="material-icons text-xl">badge</span>
              <span>Legal Work Permit / Employment Visa</span>
            </div>
            <ul className="space-y-2 text-neutral-700 text-xs leading-relaxed">
              <li>• Sponsored directly by a registered corporate entity or authorized licensed sponsor</li>
              <li>• Pre-approved quota/demand authenticated by the destination labor ministry and embassy</li>
              <li>• Mandatory medical fitness verification through accredited clinics (e.g., GAMCA / Wafid)</li>
              <li>• Entitles the holder to legal residency (Iqama/Work Pass), standard banking, and statutory labor protections</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
            <div className="flex items-center gap-2 text-rose-800 font-bold">
              <span className="material-icons text-xl">warning</span>
              <span>Visiting on a Tourist Visa to Work (Illegal)</span>
            </div>
            <ul className="space-y-2 text-rose-950 text-xs leading-relaxed">
              <li>• Strictly illegal under immigration and employment laws in UAE, Saudi Arabia, Malaysia, Europe, etc.</li>
              <li>• Leaves workers vulnerable to wage theft, confiscation of passports, arrest, and deportation</li>
              <li>• VisaHOBe strictly refuses assistance to any individual attempting to abuse visit visas for unauthorized work</li>
              <li>• Genuine employers always sponsor formal employment visas prior to travel</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bangladesh BMET Emigration Clearance Section */}
      <div className="glass glass-sheen rounded-3xl p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#202124]">Bangladesh BMET Smart Card Clearance Process</h2>
          <p className="text-sm text-[#5f6368] mt-1">
            Mandatory government emigration clearance through the Bureau of Manpower, Employment and Training (BMET)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
            <span className="font-bold text-blue-600">Step 1</span>
            <p className="font-bold text-neutral-900">Demand Letter Verification</p>
            <p className="text-neutral-500">Foreign employer's job order verified by the Bangladesh Labour Wing at the respective foreign mission.</p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
            <span className="font-bold text-blue-600">Step 2</span>
            <p className="font-bold text-neutral-900">GAMCA Medical Test</p>
            <p className="text-neutral-500">Biometric medical examination at an authorized GCC Approved Medical Centres Association clinic.</p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
            <span className="font-bold text-blue-600">Step 3</span>
            <p className="font-bold text-neutral-900">Pre-Departure Training (PDO)</p>
            <p className="text-neutral-500">Compulsory orientation session at a Technical Training Centre (TTC) covering overseas labor rights.</p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
            <span className="font-bold text-blue-600">Step 4</span>
            <p className="font-bold text-neutral-900">BMET Smart Card Issuance</p>
            <p className="text-neutral-500">Biometric emigration clearance smart card stamped and activated prior to airport departure.</p>
          </div>
        </div>
      </div>

      {/* Saudi Arabia Qiwa & Musaned Focus */}
      <div className="glass glass-sheen rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🇸🇦</span>
          <div>
            <h2 className="text-2xl font-bold text-[#202124]">Saudi Arabia: Qiwa & Musaned Systems</h2>
            <p className="text-xs text-[#5f6368]">
              Official platforms of the Ministry of Human Resources and Social Development (MHRSD)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-[#e8f0fe] border border-[#d2e3fc] space-y-3">
            <h3 className="font-bold text-[#001d35] text-base">Qiwa (قوى) for Skilled Trades</h3>
            <p className="text-xs text-[#3c4043] leading-relaxed">
              Qiwa authenticates digital electronic labor contracts for corporate and private sector enterprises in Saudi Arabia. Professional workers (electricians, welders, HVAC technicians, engineers, accountants) must have their contract approved on Qiwa before biometric visa stamping at Tasheer centers in Dhaka.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#0b57d0]">
              Key requirement: Always cross-verify the 9-digit Qiwa contract ID with your sponsor before departure.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
            <h3 className="font-bold text-emerald-950 text-base">Musaned (مساند) for Domestic Personnel</h3>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Domestic worker recruitment (drivers, house managers, caregivers) in Saudi Arabia is governed exclusively under the Musaned portal. It enforces statutory insurance coverage, standard contractual terms, and official bilateral registration between Bangladesh and Saudi labor ministries.
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-800">
              Key requirement: Recruitment must occur strictly through authorized government-registered channels.
            </div>
          </div>
        </div>
      </div>

      {/* Technical Skilled Occupations Checklist */}
      <div className="glass glass-sheen rounded-3xl p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#202124]">Skilled Technical Occupations: Document Guidance</h2>
          <p className="text-sm text-[#5f6368] mt-1">Checklist requirements for certified technical trades</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              title: 'Electrical Technician',
              icon: 'bolt',
              image: 'https://images.pexels.com/photos/27928759/pexels-photo-27928759.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
              reqs: ['Vocational trade certificate / BTEB diploma', 'Skill testing verification certificate', 'Minimum 2 years verifiable commercial experience', 'GAMCA / Wafid medical fitness clearance', 'Clean police verification certificate'],
            },
            {
              title: 'Certified Welder (TIG/MIG/Arc)',
              icon: 'handyman',
              image: 'https://images.pexels.com/photos/6509862/pexels-photo-6509862.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
              reqs: ['Welding qualification test certification (6G/3G)', 'Occupational health & safety training record', 'Authenticated sponsor demand letter', 'Original passport valid for minimum 2 years', 'BMET registration clearance'],
            },
            {
              title: 'Construction Supervisor / Civil Tech',
              icon: 'construction',
              image: 'https://images.pexels.com/photos/8853470/pexels-photo-8853470.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
              reqs: ['Civil engineering diploma or trade certificate', 'Verified employer job offer on official portal', 'Pre-departure training certificate (PDO)', 'Authenticated employment agreement', 'Bank account for salary remittance'],
            },
          ].map((occ, i) => (
            <div key={i} className="rounded-3xl overflow-hidden bg-white border border-neutral-200/80 shadow-xs space-y-3 text-left flex flex-col justify-between group hover:shadow-md transition-all">
              <div className="w-full h-36 overflow-hidden relative">
                <img
                  src={occ.image}
                  alt={occ.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 w-8 h-8 rounded-lg bg-white/95 text-blue-600 flex items-center justify-center shadow-md">
                  <span className="material-icons text-base">{occ.icon}</span>
                </div>
              </div>
              <div className="p-5 pt-1 space-y-2">
                <h3 className="font-bold text-base text-[#202124]">{occ.title}</h3>
                <ul className="space-y-1.5 text-xs text-[#5f6368]">
                  {occ.reqs.map((r, ri) => (
                    <li key={ri} className="flex items-start gap-1.5">
                      <span className="material-icons text-blue-600 text-xs mt-0.5">check</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5 Golden Rules Against Recruitment Fraud */}
      <div className="glass glass-sheen rounded-3xl p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#202124]">5 Golden Rules Against Overseas Recruitment Fraud</h2>
        <div className="space-y-3 text-sm text-[#3c4043]">
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 font-bold">1</span>
            <p><strong>Verify the Recruiting License (RL):</strong> In Bangladesh, only agencies holding an active, verified Recruiting License issued by the Ministry of Expatriates' Welfare are legally authorized to recruit.</p>
          </div>
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 font-bold">2</span>
            <p><strong>Verify Contract on Official Government Portals:</strong> Confirm your electronic employment contract on official destination platforms (e.g., Qiwa in Saudi Arabia, MOHRE in UAE, e-Pantas in Malaysia).</p>
          </div>
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 font-bold">3</span>
            <p><strong>Insist on Official Bank Receipts:</strong> Never pay cash to unauthorized middlemen or sub-agents without an official corporate receipt and stamped contract copy.</p>
          </div>
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 font-bold">4</span>
            <p><strong>Never Surrender Passports Without Written Receipt:</strong> Your passport is your sovereign property. Authorized agencies retain passports only temporarily for embassy stamping and provide immediate receipts.</p>
          </div>
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 font-bold">5</span>
            <p><strong>Mandatory BMET Immigration Clearance:</strong> Ensure your BMET smart card is activated and registered with the biometric emigration clearance database prior to Hazrat Shahjalal International Airport departure.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-[#202124]">
          Need professional document verification for your overseas employment file?
        </h3>
        <Button
          variant="primary"
          size="lg"
          onClick={onBookConsultation}
          leadingIcon="engineering"
        >
          Book Work Visa Documentation Advisory
        </Button>
      </div>
    </div>
  );
};
