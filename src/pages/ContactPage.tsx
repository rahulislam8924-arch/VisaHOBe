import React, { useState } from 'react';
import { Button } from '../components/ui';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('United States');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="ambient-wash mx-auto max-w-5xl space-y-16 animate-in fade-in px-4 py-10 text-left duration-300 sm:px-6 sm:py-16 lg:px-8">
      {/* Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 shadow-2xs">
          <span className="material-icons text-blue-600 text-sm">contact_support</span>
          <span className="text-xs font-semibold text-[#1f1f1f] tracking-wide">
            Get in Touch with VisaHOBe
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#202124] tracking-tight">
          Contact & Support
        </h1>
        <p className="text-base sm:text-lg text-[#5f6368] leading-relaxed">
          Have questions regarding visa requirements, document attestation, or appointment booking?
          Reach out to our dedicated support desks in Dhaka and regional hubs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards (Left 5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass glass-sheen rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#202124] flex items-center gap-2">
              <span className="material-icons text-blue-600">location_on</span>
              <span>Primary Operating Desks</span>
            </h3>

            <div className="space-y-3 text-xs text-neutral-600">
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                <p className="font-bold text-neutral-900 text-sm mb-0.5">Dhaka Advisory Desk</p>
                <p>Gulshan-1 / Banani Commercial Area</p>
                <p>Dhaka 1212, Bangladesh</p>
                <p className="text-[11px] text-neutral-400 mt-1">Hours: Sat - Thu (09:30 AM - 06:30 PM BST)</p>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                <p className="font-bold text-neutral-900 text-sm mb-0.5">Corporate Headquarters</p>
                <p>VisaHOBe PTE. LTD.</p>
                <p>Singapore Corporate Registry</p>
                <p className="text-[11px] text-neutral-400 mt-1">Global Consular Coordination Desk</p>
              </div>
            </div>
          </div>

          <div className="glass glass-sheen rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#202124] flex items-center gap-2">
              <span className="material-icons text-emerald-600">call</span>
              <span>Direct Communication</span>
            </h3>

            <div className="space-y-3 text-xs text-neutral-700">
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl">
                <span className="material-icons text-neutral-500">phone</span>
                <div>
                  <p className="font-semibold text-neutral-900">Phone Support</p>
                  <p className="text-neutral-500">+880 1700-000000 / +880 2-9800000</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl">
                <span className="material-icons text-emerald-600">chat</span>
                <div>
                  <p className="font-semibold text-neutral-900">WhatsApp Business</p>
                  <p className="text-neutral-500">+880 1700-000000 (Chat Support)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl">
                <span className="material-icons text-blue-600">email</span>
                <div>
                  <p className="font-semibold text-neutral-900">General Inquiries</p>
                  <p className="text-neutral-500">support@visahobe.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-[#e8f0fe] border border-[#d2e3fc] text-xs text-[#001d35] space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <span className="material-icons text-sm text-blue-700">shield</span>
              <span>Anti-Fraud & Privacy Notice</span>
            </p>
            <p className="text-[11px] leading-relaxed">
              VisaHOBe never requests payments via personal unverified mobile accounts. All payments must be made to official company bank accounts with verified receipts.
            </p>
          </div>
        </div>

        {/* Contact Form (Right 7 Cols) */}
        <div className="lg:col-span-7 glass glass-sheen rounded-3xl p-6 sm:p-8">
          {sent ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <span className="material-icons text-3xl">check</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">Message Received</h3>
              <p className="text-sm text-neutral-600 max-w-sm mx-auto leading-relaxed">
                Thank you, {name}. A visa advisory representative will review your inquiry for{' '}
                <strong>{destination}</strong> and respond to <strong>{email}</strong> within 1
                business day.
              </p>
              <Button variant="tonal" size="md" onClick={() => setSent(false)} leadingIcon="edit">
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <h2 className="text-xl font-bold text-[#202124] mb-2">Send an Advisory Message</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1712-000000"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Destination of Interest
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8] bg-white cursor-pointer"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Schengen Area">Schengen Europe</option>
                    <option value="Canada">Canada</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Singapore / Malaysia">Singapore / Malaysia</option>
                    <option value="Japan / South Korea">Japan / South Korea</option>
                    <option value="Other">Other Country</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Tourist visa document checklist inquiry"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your travel plans or questions in detail..."
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                  required
                />
              </div>

              <div className="flex flex-col-reverse items-stretch justify-end gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center">
                <p className="flex-1 text-[11px] leading-relaxed text-neutral-500">
                  Typical response time: within 1 business day (Sat–Thu).
                </p>
                <Button type="submit" variant="primary" size="lg" leadingIcon="send">
                  Send Advisory Message
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
