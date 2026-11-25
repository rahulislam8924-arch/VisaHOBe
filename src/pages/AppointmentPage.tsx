import React, { useState } from 'react';
import { ALL_COUNTRIES } from '../data/allCountriesData';
import { Button } from '../components/ui';

const toISODate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;

/** Earliest bookable day: tomorrow, skipping Friday (weekend in Bangladesh). */
const formatDisplayDate = (isoDate: string) => {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getFirstAvailableDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  while (date.getDay() === 5) date.setDate(date.getDate() + 1);
  return toISODate(date);
};

interface AppointmentPageProps {
  initialCountry?: string;
  onBookingSuccess: () => void;
}

export const AppointmentPage: React.FC<AppointmentPageProps> = ({
  initialCountry = 'United States',
  onBookingSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('Bangladeshi');
  const [destination, setDestination] = useState(initialCountry);
  const [visaCategory, setVisaCategory] = useState('Tourist / Visit Visa');
  const [consultationType, setConsultationType] = useState<'online' | 'office'>('online');
  const [preferredDate, setPreferredDate] = useState(getFirstAvailableDate);
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [briefDetails, setBriefDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [bookingReference, setBookingReference] = useState('');

  const minDate = toISODate(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferredDate || preferredDate < minDate) {
      setError('Please choose a consultation date from today onwards.');
      return;
    }
    setError('');
    setBookingReference(`VHB-${Date.now().toString().slice(-6)}`);
    setIsSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left space-y-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 shadow-2xs">
          <span className="material-icons text-blue-600 text-sm">event_available</span>
          <span className="text-xs font-semibold text-[#1f1f1f] tracking-wide">
            Schedule a Confidential Consultation
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#202124] tracking-tight">
          Book a Consultation
        </h1>
        <p className="text-base sm:text-lg text-[#5f6368] leading-relaxed">
          Speak with our experienced visa advisors. Get personalized document checklists, eligibility
          assessments, and clear answers to your immigration questions.
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <span className="material-icons text-4xl">check_circle</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-neutral-900">Consultation Scheduled!</h2>
            <p className="text-sm text-[#5f6368] max-w-md mx-auto leading-relaxed">
              Thank you, {fullName}. We have registered your appointment for{' '}
              <strong>{destination} ({visaCategory})</strong> on <strong>{formatDisplayDate(preferredDate)} at {preferredTime}</strong> via{' '}
              <strong className="capitalize">{consultationType} meeting</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 max-w-md mx-auto text-xs text-neutral-600 text-left space-y-2">
            <p><strong>Confirmation sent to:</strong> {email}</p>
            <p><strong>Contact number:</strong> {phone}</p>
            <p><strong>Passport nationality:</strong> {nationality}</p>
            <p><strong>Consultation Reference:</strong> {bookingReference}</p>
            <p className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-200">
              Please have your current passport and any previous refusal notices ready for the session.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button variant="primary" size="md" onClick={onBookingSuccess} leadingIcon="home">
              Return to Homepage
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-black/5 shadow-xs space-y-8"
        >
          {/* Section 1: Travel & Visa Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#202124] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">1</span>
              <span>Select Destination & Category</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Destination Country
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8] bg-white cursor-pointer"
                >
                  {!ALL_COUNTRIES.some((c) => c.name === destination) &&
                    destination !== 'Other Country' && (
                      <option value={destination}>{destination}</option>
                    )}
                  {ALL_COUNTRIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                  <option value="Other Country">Other International Destination</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Visa Category
                </label>
                <select
                  value={visaCategory}
                  onChange={(e) => setVisaCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8] bg-white cursor-pointer"
                >
                  <option value="Tourist / Visit Visa">Tourist / Visit Visa</option>
                  <option value="Business / Conference Visa">Business / Conference Visa</option>
                  <option value="Student Visa Advisory">Student Visa Advisory</option>
                  <option value="Skilled Work Visa Advisory">Skilled Work Visa Advisory</option>
                  <option value="E-Visa Application">Electronic E-Visa Processing</option>
                  <option value="Refusal Review">Previous Refusal Analysis</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Meeting Format & Schedule */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#202124] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">2</span>
              <span>Consultation Format & Schedule</span>
            </h2>

            {/* Meeting format toggle */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4" role="group" aria-label="Consultation format">
              {[
                {
                  id: 'online' as const,
                  icon: 'video_camera_front',
                  title: 'Online video consultation',
                  hint: 'Google Meet / Zoom / WhatsApp',
                },
                {
                  id: 'office' as const,
                  icon: 'business',
                  title: 'In-office session',
                  hint: 'Dhaka advisory office',
                },
              ].map((option) => {
                const isActive = consultationType === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setConsultationType(option.id)}
                    aria-pressed={isActive}
                    className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-4 text-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/60 ${
                      isActive
                        ? 'border-[#1a73e8] bg-[#e8f0fe]/60 shadow-xs'
                        : 'border-black/[0.08] bg-white hover:border-[#c2d7f5] hover:bg-[#f6f9fe]'
                    }`}
                  >
                    <span
                      className={`material-icons text-2xl leading-none ${
                        isActive ? 'text-[#1a73e8]' : 'text-[#5f6368]'
                      }`}
                    >
                      {option.icon}
                    </span>
                    <span className="text-sm font-semibold text-[#202124]">{option.title}</span>
                    <span className="text-xs text-[#5f6368]">{option.hint}</span>
                    {isActive && (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0b57d0] ring-1 ring-[#c2e7ff]">
                        <span className="material-icons text-[12px] leading-none">check</span>
                        Selected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  min={minDate}
                  onChange={(e) => {
                    setPreferredDate(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Preferred Time Slot
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8] bg-white cursor-pointer"
                >
                  <option value="10:00 AM">10:00 AM - 10:45 AM</option>
                  <option value="11:00 AM">11:00 AM - 11:45 AM</option>
                  <option value="02:00 PM">02:00 PM - 02:45 PM</option>
                  <option value="03:30 PM">03:30 PM - 04:15 PM</option>
                  <option value="05:00 PM">05:00 PM - 05:45 PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Applicant Contact Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#202124] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">3</span>
              <span>Your Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Full Name (as in Passport)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Mohammad Rahman"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Passport Nationality
                </label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="e.g. Bangladeshi"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +880 1712-345678"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Brief Travel Purpose or Previous Refusal History (Optional)
              </label>
              <textarea
                rows={3}
                value={briefDetails}
                onChange={(e) => setBriefDetails(e.target.value)}
                placeholder="Share any specific questions or previous refusal dates..."
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
              />
            </div>
          </div>

          {/* Compliance Checkbox */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600">
            <p>
              By submitting this appointment request, you acknowledge that VisaHOBe provides
              administrative visa guidance and document review. Visa decisions are made solely by the
              respective government embassies and consular authorities.
            </p>
          </div>

          {/* Submit Action */}
          {error && (
            <p role="alert" className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}
          <div className="flex flex-col-reverse items-stretch justify-end gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center">
            <p className="flex-1 text-[11px] leading-relaxed text-neutral-500">
              No payment is required to request a consultation. We will confirm your slot by email.
            </p>
            <Button type="submit" variant="primary" size="lg" leadingIcon="event_available">
              Confirm Consultation Booking
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
