import React, { useEffect, useState } from 'react';
import type { PortalActions, PortalProfile, PortalState } from '../../lib/portalStore';
import { formatDateTime } from '../../lib/portalTypes';
import { useToast } from './PortalToast';
import { InfoRow, ghostButton, primaryButton, secondaryButton } from './portalUi';

interface DashboardSettingsProps {
  state: PortalState;
  actions: PortalActions;
  onOpenSupport: () => void;
  onClearPortalRecords: () => void;
  onResetPortalData: () => void;
}

const Switch: React.FC<{ checked: boolean; onChange: (value: boolean) => void; label: string }> = ({
  checked,
  onChange,
  label,
}) => (
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
  placeholder?: string;
}> = ({ label, value, onChange, type = 'text', className = '', placeholder }) => (
  <label className={`block text-left ${className}`}>
    <span className="mb-1 block text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#5f6368]">
      {label}
    </span>
    <input
      type={type}
      aria-label={label}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-[#c4c7c5]/70 bg-white/90 px-3 py-2 text-sm text-[#1f1f1f] transition-colors focus:border-[#0b57d0] focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/20"
    />
  </label>
);

export const DashboardSettings: React.FC<DashboardSettingsProps> = ({
  state,
  actions,
  onOpenSupport,
  onClearPortalRecords,
  onResetPortalData,
}) => {
  const { notify } = useToast();
  const { profile, preferences } = state;

  const [details, setDetails] = useState<PortalProfile>(profile);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  useEffect(() => setDetails(profile), [profile]);

  const dirty = (Object.keys(details) as (keyof PortalProfile)[]).some(
    (key) => details[key] !== profile[key]
  );

  const saveDetails = () => {
    if (!details.fullName.trim()) {
      notify('Full legal name is required', 'info');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      notify('Enter a valid email address', 'info');
      return;
    }
    if (details.passportExpiry && Date.parse(details.passportExpiry) < Date.now()) {
      notify('Passport expiry is in the past — renew before applying', 'info');
    }
    actions.updateProfile(details);
    notify('Profile saved');
  };

  const verificationTone =
    profile.verificationStatus === 'verified'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : profile.verificationStatus === 'pending'
      ? 'bg-amber-50 text-amber-800 ring-amber-200'
      : 'bg-neutral-100 text-neutral-600 ring-neutral-200';

  return (
    <div className="max-w-4xl space-y-5 animate-in fade-in text-left duration-300">
      <div className="space-y-1 pb-1">
        <h2 className="font-['Google_Sans',Roboto,sans-serif] text-3xl font-normal text-[#1f1f1f] sm:text-4xl">
          My Profile
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-[#444746]">
          Your personal, passport, contact and security information. Changes are saved to this device
          and are used by the AI agent when preparing applications.
        </p>
        <span
          className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-medium ring-1 ${verificationTone}`}
        >
          <span className="material-icons text-[13px]">
            {profile.verificationStatus === 'verified' ? 'verified_user' : 'pending'}
          </span>
          Profile {profile.verificationStatus}
        </span>
      </div>

      {/* Personal information */}
      <section className="glass-flat glass-sheen space-y-4 rounded-[28px] p-5 shadow-xs sm:p-6">
        <div>
          <h3 className="font-['Google_Sans',Roboto,sans-serif] text-lg font-medium text-[#1f1f1f]">
            Personal information
          </h3>
          <p className="text-[11px] text-[#5f6368]">Exactly as printed in your passport</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label="Full legal name"
            value={details.fullName}
            onChange={(value) => setDetails({ ...details, fullName: value })}
            className="sm:col-span-2"
          />
          <Field
            label="Date of birth"
            type="date"
            value={details.dateOfBirth}
            onChange={(value) => setDetails({ ...details, dateOfBirth: value })}
          />
          <Field
            label="Nationality"
            value={details.nationality}
            onChange={(value) => setDetails({ ...details, nationality: value })}
          />
          <label className="block text-left">
            <span className="mb-1 block text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#5f6368]">
              Gender (only where an application requires it)
            </span>
            <select
              value={details.gender}
              onChange={(e) => setDetails({ ...details, gender: e.target.value })}
              className="w-full rounded-xl border border-[#c4c7c5]/70 bg-white/90 px-3 py-2 text-sm text-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/20"
            >
              {['Not specified', 'Female', 'Male', 'Other'].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="Mobile number"
            type="tel"
            value={details.phone}
            onChange={(value) => setDetails({ ...details, phone: value })}
          />
          <Field
            label="Email address"
            type="email"
            value={details.email}
            onChange={(value) => setDetails({ ...details, email: value })}
            className="sm:col-span-2"
          />
        </div>
      </section>

      {/* Passport */}
      <section className="glass-flat glass-sheen space-y-4 rounded-[28px] p-5 shadow-xs sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-['Google_Sans',Roboto,sans-serif] text-lg font-medium text-[#1f1f1f]">
              Passport details
            </h3>
            <p className="text-[11px] text-[#5f6368]">
              Masked outside your own application screens
            </p>
          </div>
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10.5px] font-medium text-neutral-600">
            Protected field
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field
            label="Passport number"
            value={details.passportNumber}
            onChange={(value) => setDetails({ ...details, passportNumber: value.toUpperCase() })}
          />
          <Field
            label="Expiry date"
            type="date"
            value={details.passportExpiry}
            onChange={(value) => setDetails({ ...details, passportExpiry: value })}
          />
          <Field
            label="Issuing country"
            value={details.passportIssueCountry}
            onChange={(value) => setDetails({ ...details, passportIssueCountry: value })}
          />
        </div>
      </section>

      {/* Address */}
      <section className="glass-flat glass-sheen space-y-4 rounded-[28px] p-5 shadow-xs sm:p-6">
        <div>
          <h3 className="font-['Google_Sans',Roboto,sans-serif] text-lg font-medium text-[#1f1f1f]">
            Address
          </h3>
          <p className="text-[11px] text-[#5f6368]">Used for courier passport delivery</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label="Street address"
            value={details.addressLine1}
            onChange={(value) => setDetails({ ...details, addressLine1: value })}
            className="sm:col-span-2"
          />
          <Field
            label="City"
            value={details.city}
            onChange={(value) => setDetails({ ...details, city: value })}
          />
          <Field
            label="State / region"
            value={details.region}
            onChange={(value) => setDetails({ ...details, region: value })}
          />
          <Field
            label="Postal code"
            value={details.postalCode}
            onChange={(value) => setDetails({ ...details, postalCode: value })}
          />
          <Field
            label="Country"
            value={details.country}
            onChange={(value) => setDetails({ ...details, country: value })}
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-black/[0.06] bg-white/60 p-3">
        <p className="text-[11px] text-[#5f6368]">
          {dirty ? 'You have unsaved profile changes.' : 'All profile changes are saved.'}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={ghostButton}
            disabled={!dirty}
            onClick={() => {
              setDetails(profile);
              notify('Changes discarded', 'info');
            }}
          >
            Discard
          </button>
          <button type="button" className={primaryButton} disabled={!dirty} onClick={saveDetails}>
            <span className="material-icons text-sm">save</span>
            Save profile
          </button>
        </div>
      </div>

      {/* Notifications */}
      <section className="glass-flat glass-sheen space-y-4 rounded-[28px] p-5 shadow-xs sm:p-6">
        <div>
          <h3 className="font-['Google_Sans',Roboto,sans-serif] text-lg font-medium text-[#1f1f1f]">
            Notifications
          </h3>
          <p className="text-[11px] text-[#5f6368]">
            Delivery architecture for e-mail, SMS and WhatsApp is prepared but disabled in preview
            mode
          </p>
        </div>

        <div className="space-y-3">
          {[
            { key: 'statusAlerts' as const, label: 'Application status updates' },
            { key: 'appointmentReminders' as const, label: 'Appointment & biometric reminders' },
            { key: 'courierTracking' as const, label: 'Passport courier tracking' },
            { key: 'channelEmail' as const, label: 'E-mail channel' },
            { key: 'channelSms' as const, label: 'SMS channel (prepared, off)' },
            { key: 'channelWhatsapp' as const, label: 'WhatsApp channel (prepared, off)' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-4">
              <p className="text-xs font-medium text-[#1f1f1f]">{item.label}</p>
              <Switch
                label={item.label}
                checked={preferences[item.key]}
                onChange={(value) => {
                  actions.updatePreference(item.key, value);
                  notify(`${item.label} ${value ? 'enabled' : 'disabled'}`);
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="glass-flat glass-sheen space-y-4 rounded-[28px] p-5 shadow-xs sm:p-6">
        <div>
          <h3 className="font-['Google_Sans',Roboto,sans-serif] text-lg font-medium text-[#1f1f1f]">
            Security
          </h3>
          <p className="text-[11px] text-[#5f6368]">
            Password management is wallet/identity-provider based. In preview mode no credential is
            changed.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field
            label="Current password"
            type="password"
            value={passwordForm.current}
            onChange={(value) => setPasswordForm({ ...passwordForm, current: value })}
            placeholder="••••••••"
          />
          <Field
            label="New password"
            type="password"
            value={passwordForm.next}
            onChange={(value) => setPasswordForm({ ...passwordForm, next: value })}
            placeholder="At least 8 characters"
          />
          <Field
            label="Confirm new password"
            type="password"
            value={passwordForm.confirm}
            onChange={(value) => setPasswordForm({ ...passwordForm, confirm: value })}
            placeholder="Repeat"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={secondaryButton}
            onClick={() => {
              if (passwordForm.next.length < 8) {
                notify('New password must be at least 8 characters', 'info');
                return;
              }
              if (passwordForm.next !== passwordForm.confirm) {
                notify('Passwords do not match', 'info');
                return;
              }
              actions.changePasswordPreview();
              setPasswordForm({ current: '', next: '', confirm: '' });
              notify('Password change requested — disabled in preview mode', 'info');
            }}
          >
            Change password
          </button>
          <button type="button" className={ghostButton} onClick={onOpenSupport}>
            Report a security issue
          </button>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white/70 p-3">
          <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#5f6368]">
            Session
          </h4>
          <InfoRow label="Client ID" value={state.profile.clientId} mono />
          <InfoRow label="Device" value={state.session.device} />
          <InfoRow label="Signed in" value={formatDateTime(state.session.startedAt)} />
          <InfoRow label="Last activity" value={formatDateTime(state.session.lastActiveAt)} />
          <InfoRow label="Role" value="Client (own records only)" />
        </div>
      </section>

      {/* Activity log */}
      <section className="glass-flat glass-sheen space-y-3 rounded-[28px] p-5 shadow-xs sm:p-6">
        <h3 className="font-['Google_Sans',Roboto,sans-serif] text-lg font-medium text-[#1f1f1f]">
          Account activity
        </h3>
        {state.activity.length === 0 ? (
          <p className="text-xs text-[#5f6368]">No activity recorded yet.</p>
        ) : (
          <ul className="max-h-52 space-y-2 overflow-y-auto pr-1">
            {state.activity.slice(0, 20).map((entry) => (
              <li key={entry.id} className="flex items-start justify-between gap-3 text-[11.5px]">
                <span className="min-w-0">
                  <span className="font-medium text-[#1f1f1f]">{entry.action}</span>
                  <span className="block truncate text-[10.5px] text-[#5f6368]">{entry.detail}</span>
                </span>
                <span className="shrink-0 text-[10px] text-[#9aa0a6]">
                  {formatDateTime(entry.at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Data controls */}
      <section className="space-y-3 rounded-2xl border border-black/[0.06] bg-white/60 p-4">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-[11.5px] leading-relaxed text-[#70757a]">
            Portal data lives in this browser only. Demo records are synthetic test data; clearing
            them keeps your profile and preferences.
          </p>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button type="button" className={secondaryButton} onClick={onResetPortalData}>
              Load demo records
            </button>
            <button
              type="button"
              className="rounded-full border border-[#c5221f]/30 px-4 py-2 text-xs font-semibold text-[#c5221f] transition-colors hover:bg-[#fce8e6] cursor-pointer"
              onClick={() => setIsConfirmingClear(true)}
            >
              Clear all records
            </button>
          </div>
        </div>

        {isConfirmingClear && (
          <div className="flex flex-col items-start justify-between gap-2 rounded-xl border border-[#c5221f]/25 bg-[#fce8e6]/60 p-3 sm:flex-row sm:items-center">
            <p className="text-[11.5px] text-[#8c1d18]">
              This removes every application, document record, receipt and notification from this
              browser. Profile and preferences stay.
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" className={ghostButton} onClick={() => setIsConfirmingClear(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="rounded-full bg-[#c5221f] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#a51d1a] cursor-pointer"
                onClick={() => {
                  onClearPortalRecords();
                  setIsConfirmingClear(false);
                }}
              >
                Clear records
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
