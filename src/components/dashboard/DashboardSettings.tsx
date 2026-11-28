import React, { useEffect, useState } from 'react';
import { useToast } from './PortalToast';
import type { PortalPreferences, PortalProfile } from '../../lib/portalStore';

interface DashboardSettingsProps {
  profile: PortalProfile;
  preferences: PortalPreferences;
  onUpdateProfile: (patch: Partial<PortalProfile>) => void;
  onUpdatePreference: (key: keyof PortalPreferences, value: boolean) => void;
  onResetPortalData?: () => void;
  onClearPortalRecords?: () => void;
}

const Switch: React.FC<{
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <label className="relative mt-1 inline-flex shrink-0 cursor-pointer items-center">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="peer sr-only"
      aria-label={label}
    />
    <span className="relative h-7 w-13 rounded-full bg-[#747775]/30 shadow-2xs transition-colors after:absolute after:left-[4px] after:top-[3px] after:h-5.5 after:w-5.5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#0b57d0] peer-checked:after:translate-x-6 peer-focus-visible:ring-2 peer-focus-visible:ring-[#1a73e8]/60 peer-focus-visible:ring-offset-2" />
  </label>
);

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
}> = ({ label, value, onChange, type = 'text', className = '' }) => (
  <label className={`block text-left ${className}`}>
    <span className="mb-1 block text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#5f6368]">
      {label}
    </span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-[#c4c7c5]/70 bg-white/90 px-3 py-2 text-sm text-[#1f1f1f] transition-colors focus:border-[#0b57d0] focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/20"
    />
  </label>
);

export const DashboardSettings: React.FC<DashboardSettingsProps> = ({
  profile,
  preferences,
  onUpdateProfile,
  onUpdatePreference,
  onResetPortalData,
  onClearPortalRecords,
}) => {
  const { notify } = useToast();

  // Applicant details form mirrors the saved profile and only writes on save
  const [details, setDetails] = useState(profile);
  useEffect(() => setDetails(profile), [profile]);

  const detailsDirty =
    details.name !== profile.name ||
    details.email !== profile.email ||
    details.phone !== profile.phone;

  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState(profile);
  useEffect(() => setAddress(profile), [profile]);

  const saveDetails = () => {
    if (!details.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      notify('Enter a name and a valid email address', 'info');
      return;
    }
    onUpdateProfile({
      name: details.name.trim(),
      email: details.email.trim(),
      phone: details.phone.trim(),
    });
    notify('Applicant details saved to your portal');
  };

  const saveAddress = () => {
    onUpdateProfile({
      addressLine1: address.addressLine1.trim(),
      city: address.city.trim(),
      region: address.region.trim(),
      postalCode: address.postalCode.trim(),
      country: address.country.trim(),
    });
    setIsEditingAddress(false);
    notify('Courier delivery address updated');
  };

  const toggle = (key: keyof PortalPreferences, label: string) => (value: boolean) => {
    onUpdatePreference(key, value);
    notify(`${label} ${value ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="max-w-4xl animate-in space-y-6 text-left fade-in duration-300">
      {/* Page Title & Subtitle */}
      <div className="space-y-2 pb-2">
        <h2 className="font-['Google_Sans',Roboto,sans-serif] text-3xl font-normal text-[#1f1f1f] sm:text-4xl">
          My Profile
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-[#444746]">
          Manage your applicant details, consular email alerts, passport security and privacy
          settings. Changes are saved to this device immediately.
        </p>
      </div>

      {/* Card 0: Applicant details */}
      <div className="glass-flat glass-sheen space-y-5 rounded-[28px] p-6 shadow-xs sm:p-8">
        <div>
          <h3 className="font-['Google_Sans',Roboto,sans-serif] text-xl font-normal text-[#1f1f1f]">
            Applicant details
          </h3>
          <p className="mt-0.5 text-xs text-[#444746] sm:text-sm">
            Used on consular forms, appointment slips and fee receipts
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name" value={details.name} onChange={(v) => setDetails({ ...details, name: v })} />
          <Field
            label="Email address"
            type="email"
            value={details.email}
            onChange={(v) => setDetails({ ...details, email: v })}
          />
          <Field
            label="Mobile number"
            type="tel"
            value={details.phone}
            onChange={(v) => setDetails({ ...details, phone: v })}
            className="sm:col-span-2"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-[#70757a]">
            Stored locally on this device — no sign-in required.
          </p>
          <button
            type="button"
            onClick={saveDetails}
            disabled={!detailsDirty}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0b57d0] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0842a0] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            <span className="material-icons text-base">save</span>
            <span>Save details</span>
          </button>
        </div>
      </div>

      {/* Card 1: Consular email & notification settings */}
      <div className="glass-flat glass-sheen space-y-6 rounded-[28px] p-6 shadow-xs sm:p-8">
        <div>
          <h3 className="font-['Google_Sans',Roboto,sans-serif] text-xl font-normal text-[#1f1f1f]">
            Email & consular notifications
          </h3>
          <p className="mt-0.5 text-xs text-[#444746] sm:text-sm">
            Manage the notifications you receive regarding your visa applications
          </p>
        </div>

        <div className="space-y-6 divide-y divide-neutral-100">
          <div className="flex items-start justify-between gap-6 pt-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#1f1f1f]">Visa application status updates</p>
              <p className="text-xs leading-relaxed text-[#444746]">
                Receive instant email alerts when your application progresses from received to
                under review, biometrics verified, or approved
              </p>
            </div>
            <Switch
              label="Visa application status updates"
              checked={preferences.statusAlerts}
              onChange={toggle('statusAlerts', 'Application status alerts')}
            />
          </div>

          <div className="flex items-start justify-between gap-6 pt-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#1f1f1f]">
                Embassy appointment & biometric reminders
              </p>
              <p className="text-xs leading-relaxed text-[#444746]">
                Get notified 48 hours and 24 hours prior to your consular interview or visa
                application center biometrics appointment
              </p>
            </div>
            <Switch
              label="Embassy appointment reminders"
              checked={preferences.appointmentReminders}
              onChange={toggle('appointmentReminders', 'Appointment reminders')}
            />
          </div>

          <div className="flex items-start justify-between gap-6 pt-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#1f1f1f]">
                Passport courier dispatch & delivery tracking
              </p>
              <p className="text-xs leading-relaxed text-[#444746]">
                Get live courier tracking updates when your stamped passport is dispatched from the
                embassy to your mailing address
              </p>
            </div>
            <Switch
              label="Courier tracking alerts"
              checked={preferences.courierTracking}
              onChange={toggle('courierTracking', 'Courier tracking')}
            />
          </div>
        </div>
      </div>

      {/* Card 2: Privacy & Biometric Data */}
      <div className="glass-flat glass-sheen space-y-6 rounded-[28px] p-6 shadow-xs sm:p-8">
        <div>
          <h3 className="font-['Google_Sans',Roboto,sans-serif] text-xl font-normal text-[#1f1f1f]">
            Privacy & biometric security
          </h3>
          <p className="mt-0.5 text-xs text-[#444746] sm:text-sm">
            Your personal information and biometric records are never shared publicly or sold.{' '}
            <a href="#legal" className="text-[#0b57d0] hover:underline">
              Learn how VisaHOBe keeps your consular data private
            </a>
          </p>
        </div>

        <div className="space-y-6 divide-y divide-neutral-100">
          <div className="flex items-start justify-between gap-6 pt-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#1f1f1f]">
                Consular application autofill synchronization
              </p>
              <p className="text-xs leading-relaxed text-[#444746]">
                Seamlessly populate verified passport numbers, previous travel visas, and sponsor
                details across official DS-160 and Schengen online forms
              </p>
            </div>
            <Switch
              label="Consular application autofill"
              checked={preferences.consularSync}
              onChange={toggle('consularSync', 'Form autofill sync')}
            />
          </div>

          <div className="flex items-start justify-between gap-6 pt-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#1f1f1f]">
                Automated e-Gate smart clearance tokens
              </p>
              <p className="text-xs leading-relaxed text-[#444746]">
                Generate encrypted NFC tokens for rapid border clearance at compatible
                international airport smart gates compliant with ICAO 9303 standards
              </p>
            </div>
            <Switch
              label="e-Gate clearance tokens"
              checked={preferences.egateTokenization}
              onChange={toggle('egateTokenization', 'e-Gate tokens')}
            />
          </div>

          <div className="flex items-start justify-between gap-6 pt-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#1f1f1f]">
                Gmail smart consular document import
              </p>
              <p className="text-xs leading-relaxed text-[#444746]">
                Automatically import consular fee receipts, interview appointment letters, and
                e-Visa issuance PDFs directly from your Gmail inbox
              </p>
            </div>
            <Switch
              label="Gmail document import"
              checked={preferences.gmailSmartFeatures}
              onChange={toggle('gmailSmartFeatures', 'Gmail document import')}
            />
          </div>
        </div>
      </div>

      {/* Card 3: Saved Traveler Addresses */}
      <div className="glass-flat glass-sheen space-y-4 rounded-[28px] p-6 shadow-xs sm:p-8">
        <div>
          <h3 className="font-['Google_Sans',Roboto,sans-serif] text-xl font-normal text-[#1f1f1f]">
            Saved applicant travel addresses
          </h3>
          <p className="mt-0.5 text-xs text-[#444746] sm:text-sm">
            Addresses used for courier passport delivery and consular DS-160 / Schengen forms
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 p-4">
          {isEditingAddress ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label="Street address"
                  value={address.addressLine1}
                  onChange={(v) => setAddress({ ...address, addressLine1: v })}
                  className="sm:col-span-2"
                />
                <Field label="City" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} />
                <Field label="State / Region" value={address.region} onChange={(v) => setAddress({ ...address, region: v })} />
                <Field
                  label="Postal code"
                  value={address.postalCode}
                  onChange={(v) => setAddress({ ...address, postalCode: v })}
                />
                <Field label="Country" value={address.country} onChange={(v) => setAddress({ ...address, country: v })} />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddress(profile);
                    setIsEditingAddress(false);
                  }}
                  className="rounded-full px-4 py-2 text-xs font-medium text-[#444746] transition-colors hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveAddress}
                  className="rounded-full bg-[#0b57d0] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#0842a0] cursor-pointer"
                >
                  Save address
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-neutral-800">{profile.name}</p>
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                    Primary Residence
                  </span>
                </div>
                <p className="text-xs text-neutral-500">{profile.addressLine1}</p>
                <p className="text-xs text-neutral-500">
                  {profile.city}, {profile.region} {profile.postalCode}, {profile.country}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddress(profile);
                  setIsEditingAddress(true);
                }}
                className="shrink-0 text-xs font-medium text-[#0b57d0] hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card 4: Local data */}
      <div className="space-y-3 rounded-2xl border border-black/[0.06] bg-white/60 p-4">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-[11.5px] leading-relaxed text-[#70757a]">
            Your cards, applications, receipts and preferences live in this browser. Demo records
            are sample applications you can remove whenever you want an account with only your own
            data.
          </p>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {onResetPortalData && (
              <button
                type="button"
                onClick={onResetPortalData}
                className="rounded-full border border-[#0b57d0]/30 px-4 py-2 text-xs font-semibold text-[#0b57d0] transition-colors hover:bg-[#e8f0fe] cursor-pointer"
              >
                Load demo records
              </button>
            )}
            {onClearPortalRecords && (
              <button
                type="button"
                onClick={() => setIsConfirmingClear(true)}
                className="rounded-full border border-[#c5221f]/30 px-4 py-2 text-xs font-semibold text-[#c5221f] transition-colors hover:bg-[#fce8e6] cursor-pointer"
              >
                Clear all records
              </button>
            )}
          </div>
        </div>

        {isConfirmingClear && onClearPortalRecords && (
          <div className="flex flex-col items-start justify-between gap-2 rounded-xl border border-[#c5221f]/25 bg-[#fce8e6]/60 p-3 sm:flex-row sm:items-center">
            <p className="text-[11.5px] text-[#8c1d18]">
              This removes every saved card, application and receipt from this browser. Your profile
              and preferences stay.
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmingClear(false)}
                className="rounded-full px-3 py-1.5 text-xs font-medium text-[#444746] hover:bg-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearPortalRecords();
                  setIsConfirmingClear(false);
                }}
                className="rounded-full bg-[#c5221f] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#a51d1a] cursor-pointer"
              >
                Clear records
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
