import React, { useState } from 'react';

export const DashboardSettings: React.FC = () => {
  const [statusAlerts, setStatusAlerts] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [courierTracking, setCourierTracking] = useState(true);
  const [consularSync, setConsularSync] = useState(true);
  const [egateTokenization, setEgateTokenization] = useState(true);
  const [gmailSmartFeatures, setGmailSmartFeatures] = useState(true);

  return (
    <div className="space-y-6 text-left max-w-4xl animate-in fade-in duration-300">
      {/* Page Title & Subtitle */}
      <div className="space-y-2 pb-2">
        <h2 className="font-['Google_Sans',Roboto,sans-serif] text-3xl sm:text-4xl font-normal text-[#1f1f1f]">
          Settings
        </h2>
        <p className="text-sm text-[#444746] leading-relaxed max-w-2xl">
          Manage your consular email alerts, passport security, and privacy settings for VisaHOBe
          Portal. You can change your preferences at any time.
        </p>
      </div>

      {/* Card 1: Consular email & notification settings */}
      <div className="glass-flat glass-sheen rounded-[28px] p-6 sm:p-8 shadow-xs  space-y-6">
        <div>
          <h3 className="font-['Google_Sans',Roboto,sans-serif] text-xl font-normal text-[#1f1f1f]">
            Email & consular notifications
          </h3>
          <p className="text-xs sm:text-sm text-[#444746] mt-0.5">
            Manage the notifications you receive regarding your visa applications
          </p>
        </div>

        <div className="space-y-6 divide-y divide-neutral-100">
          {/* Item 1: Visa application status updates */}
          <div className="pt-2 flex items-start justify-between gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#1f1f1f]">
                Visa application status updates
              </p>
              <p className="text-xs text-[#444746] leading-relaxed">
                Receive instant email alerts when your application progresses from received to
                under review, biometrics verified, or approved
              </p>
            </div>
            {/* Material 3 switch */}
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={statusAlerts}
                onChange={(e) => setStatusAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-13 h-7 bg-[#747775]/30 peer-focus:outline-none rounded-full peer peer-checked:bg-[#0b57d0] transition-colors relative after:content-[''] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:after:translate-x-6 shadow-2xs" />
            </label>
          </div>

          {/* Item 2: Embassy appointment reminders */}
          <div className="pt-6 flex items-start justify-between gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#1f1f1f]">
                Embassy appointment & biometric reminders
              </p>
              <p className="text-xs text-[#444746] leading-relaxed">
                Get notified 48 hours and 24 hours prior to your consular interview or visa
                application center biometrics appointment
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={appointmentReminders}
                onChange={(e) => setAppointmentReminders(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-13 h-7 bg-[#747775]/30 peer-focus:outline-none rounded-full peer peer-checked:bg-[#0b57d0] transition-colors relative after:content-[''] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:after:translate-x-6 shadow-2xs" />
            </label>
          </div>

          {/* Item 3: Passport courier tracking alerts */}
          <div className="pt-6 flex items-start justify-between gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#1f1f1f]">
                Passport courier dispatch & delivery tracking
              </p>
              <p className="text-xs text-[#444746] leading-relaxed">
                Get live courier tracking updates when your stamped passport is dispatched from the
                embassy to your mailing address
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={courierTracking}
                onChange={(e) => setCourierTracking(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-13 h-7 bg-[#747775]/30 peer-focus:outline-none rounded-full peer peer-checked:bg-[#0b57d0] transition-colors relative after:content-[''] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:after:translate-x-6 shadow-2xs" />
            </label>
          </div>
        </div>
      </div>

      {/* Card 2: Privacy & Biometric Data */}
      <div className="glass-flat glass-sheen rounded-[28px] p-6 sm:p-8 shadow-xs  space-y-6">
        <div>
          <h3 className="font-['Google_Sans',Roboto,sans-serif] text-xl font-normal text-[#1f1f1f]">
            Privacy & biometric security
          </h3>
          <p className="text-xs sm:text-sm text-[#444746] mt-0.5">
            Your personal information and biometric records are never shared publicly or sold.{' '}
            <a
              href="#legal"
              className="text-[#0b57d0] hover:underline"
            >
              Learn how VisaHOBe keeps your consular data private
            </a>
          </p>
        </div>

        <div className="space-y-6 divide-y divide-neutral-100">
          {/* Item 1: Consular data synchronization */}
          <div className="pt-2 flex items-start justify-between gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#1f1f1f]">
                Consular application autofill synchronization
              </p>
              <p className="text-xs text-[#444746] leading-relaxed">
                Seamlessly populate verified passport numbers, previous travel visas, and sponsor
                details across official DS-160 and Schengen online forms
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={consularSync}
                onChange={(e) => setConsularSync(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-13 h-7 bg-[#747775]/30 peer-focus:outline-none rounded-full peer peer-checked:bg-[#0b57d0] transition-colors relative after:content-[''] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:after:translate-x-6 shadow-2xs" />
            </label>
          </div>

          {/* Item 2: Automated e-Gate Tokenization */}
          <div className="pt-6 flex items-start justify-between gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#1f1f1f]">
                Automated e-Gate smart clearance tokens
              </p>
              <p className="text-xs text-[#444746] leading-relaxed">
                Generate encrypted NFC tokens for rapid border clearance at compatible
                international airport smart gates compliant with ICAO 9303 standards
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={egateTokenization}
                onChange={(e) => setEgateTokenization(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-13 h-7 bg-[#747775]/30 peer-focus:outline-none rounded-full peer peer-checked:bg-[#0b57d0] transition-colors relative after:content-[''] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:after:translate-x-6 shadow-2xs" />
            </label>
          </div>

          {/* Item 3: Gmail smart features and passes */}
          <div className="pt-6 flex items-start justify-between gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#1f1f1f]">
                Gmail smart consular document import
              </p>
              <p className="text-xs text-[#444746] leading-relaxed">
                Automatically import consular fee receipts, interview appointment letters, and
                e-Visa issuance PDFs directly from your Gmail inbox
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={gmailSmartFeatures}
                onChange={(e) => setGmailSmartFeatures(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-13 h-7 bg-[#747775]/30 peer-focus:outline-none rounded-full peer peer-checked:bg-[#0b57d0] transition-colors relative after:content-[''] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:after:translate-x-6 shadow-2xs" />
            </label>
          </div>
        </div>
      </div>

      {/* Card 3: Saved Traveler Addresses */}
      <div className="glass-flat glass-sheen rounded-[28px] p-6 sm:p-8 shadow-xs  space-y-4">
        <div>
          <h3 className="font-['Google_Sans',Roboto,sans-serif] text-xl font-normal text-[#1f1f1f]">
            Saved applicant travel addresses
          </h3>
          <p className="text-xs sm:text-sm text-[#444746] mt-0.5">
            Addresses used for courier passport delivery and consular DS-160 / Schengen forms
          </p>
        </div>

        <div className="border border-neutral-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-neutral-800">Alexander Morgan</p>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full border border-blue-200">
                Primary Residence
              </span>
            </div>
            <p className="text-xs text-neutral-500">399 4th Street, Apt 1204</p>
            <p className="text-xs text-neutral-500">San Francisco, CA 94107, United States</p>
          </div>
          <button
            onClick={() => alert('Applicant address management')}
            className="text-xs text-[#0b57d0] hover:underline font-medium cursor-pointer"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};
