import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ALL_COUNTRIES } from '../../data/allCountriesData';
import { DashboardPassItem } from '../../data/dashboardMockData';
import { DashboardTab } from './DashboardLayout';
import { TransactionData } from './TransactionReceiptModal';

interface DashboardAgentProps {
  passes: DashboardPassItem[];
  transactions: TransactionData[];
  onNavigateTab?: (tab: DashboardTab) => void;
}

interface Message {
  id: number;
  role: 'agent' | 'client';
  text: string;
  chips?: string[];
}

const QUICK_PROMPTS = [
  'Do I need a visa for the UAE?',
  'What documents do I need for Schengen?',
  'Show my application status',
  'How much have I paid in embassy fees?',
];

const DOCUMENT_CHECKLIST = [
  'Passport valid for at least 6 months with 2 blank pages',
  'Recent biometric photos to the mission’s specification',
  'Bank statement (last 3–6 months) plus solvency letter',
  'Confirmed itinerary, accommodation and travel insurance',
  'Employment or student letter and approved leave',
  'Cover letter explaining purpose, dates and funding',
];

/** Everyday names and abbreviations clients actually type */
const COUNTRY_ALIASES: Record<string, string> = {
  uae: 'United Arab Emirates',
  dubai: 'United Arab Emirates',
  'abu dhabi': 'United Arab Emirates',
  emirates: 'United Arab Emirates',
  usa: 'United States',
  us: 'United States',
  america: 'United States',
  uk: 'United Kingdom',
  britain: 'United Kingdom',
  england: 'United Kingdom',
  ksa: 'Saudi Arabia',
  riyadh: 'Saudi Arabia',
  saudia: 'Saudi Arabia',
  korea: 'South Korea',
  'south korea': 'South Korea',
  holland: 'Netherlands',
  germany: 'Germany',
  italy: 'Italy',
  spain: 'Spain',
  france: 'France',
  canada: 'Canada',
  australia: 'Australia',
  japan: 'Japan',
  china: 'China',
  malaysia: 'Malaysia',
  singapore: 'Singapore',
  thailand: 'Thailand',
  qatar: 'Qatar',
  oman: 'Oman',
  kuwait: 'Kuwait',
  bahrain: 'Bahrain',
  turkey: 'Turkey',
  turkiye: 'Turkey',
};

const findCountry = (question: string) => {
  const q = question.toLowerCase();

  const alias = Object.keys(COUNTRY_ALIASES).find((key) =>
    new RegExp(`(^|[^a-z])${key}([^a-z]|$)`).test(q)
  );
  if (alias) {
    const target = ALL_COUNTRIES.find((c) => c.name === COUNTRY_ALIASES[alias]);
    if (target) return target;
  }

  return (
    ALL_COUNTRIES.find((c) => q.includes(c.name.toLowerCase())) ||
    ALL_COUNTRIES.find((c) => c.name.toLowerCase().startsWith(q.trim())) ||
    null
  );
};

const countryAnswer = (country: (typeof ALL_COUNTRIES)[number]) => {
  const entry = [
    country.eVisaAvailable ? 'e-Visa available' : null,
    country.visaOnArrival ? 'visa on arrival' : null,
    country.biometricRequired ? 'biometrics required' : null,
    country.interviewRequired ? 'interview may be required' : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return [
    `${country.name} (${country.continent}) — capital ${country.capital}, currency ${country.currency}.`,
    `Entry route: ${country.visaTypeSummary}.`,
    country.visaRequiredForBD
      ? 'Bangladeshi passport holders need a visa before travel.'
      : 'Bangladeshi passport holders do not need a visa for this destination.',
    entry ? `Notes: ${entry}.` : '',
    `Apply through: ${country.submissionLocation}.`,
    `Typical processing: ${country.processingTime}. Embassy fee range: ${country.embassyFeeRange}.`,
    'Open Countries in the main site for the full 29-point consular report. Embassy decisions are always final.',
  ]
    .filter(Boolean)
    .join('\n');
};

export const DashboardAgent: React.FC<DashboardAgentProps> = ({ passes, transactions }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'agent',
      text:
        'Assalamu alaikum 👋 I’m the VisaHOBe AI visa agent. Ask me about a destination, your documents, application status or embassy fee receipts.\n\nI answer from VisaHOBe’s verified 190-country dataset — no guesses, no fake promises.',
      chips: QUICK_PROMPTS,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(2);

  const completedTotal = useMemo(
    () =>
      transactions
        .filter((t) => t.status === 'Completed')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const pendingCount = useMemo(
    () => transactions.filter((t) => t.status === 'Pending').length,
    [transactions]
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  const buildAnswer = (question: string): string => {
    const q = question.toLowerCase();

    const country = findCountry(question);
    if (country) return countryAnswer(country);

    if (/(application|status|track|pass|visa file|approve)/.test(q)) {
      if (passes.length === 0) {
        return 'You have no application files in this portal yet. Start one from Visa Services on visahobe.com and it will appear here with live milestones.';
      }
      const lines = passes.map(
        (pass) =>
          `• ${pass.title} — ${pass.issuer}${pass.expiryDate ? ` · valid until ${pass.expiryDate}` : ''}${
            pass.badge ? ` · ${pass.badge}` : ''
          }`
      );
      return [
        `You have ${passes.length} application file${passes.length > 1 ? 's' : ''} stored in the portal:`,
        ...lines,
        'Open “My Applications” for barcodes, biometric slips and courier tracking.',
      ].join('\n');
    }

    if (/(payment|fee|receipt|paid|card|transaction|refund)/.test(q)) {
      return [
        `Settled so far: ৳${completedTotal.toLocaleString('en-US')} across ${
          transactions.filter((t) => t.status === 'Completed').length
        } completed consular payments.`,
        pendingCount > 0
          ? `${pendingCount} payment${pendingCount > 1 ? 's are' : ' is'} still pending at the bank.`
          : 'No payments are pending right now.',
        'Every receipt is itemised — open “Payments” to add a card or review payment history.',
      ].join('\n');
    }

    if (/(document|checklist|paper|bank statement|photo|insurance)/.test(q)) {
      return [
        'Standard document set for most missions:',
        ...DOCUMENT_CHECKLIST.map((item) => `• ${item}`),
        'Category-specific extras (PCC, trade certificate, sponsor NOC, invitation letter) are listed in the 29-point country report.',
      ].join('\n');
    }

    if (/(appointment|biometric|interview|vfs|slot)/.test(q)) {
      return [
        'Appointment and biometric guidance:',
        '• Book only through the mission’s official portal or authorised centre (VFS, TLScontact, BLS).',
        '• Carry the printed appointment slip, passport, and the exact photo specification.',
        '• Arrive 15 minutes early; biometrics are usually completed in under 10 minutes.',
        'Your appointment passes live in “My Applications” so you can show the barcode at the gate.',
      ].join('\n');
    }

    if (/(refus|reject|denied|appeal)/.test(q)) {
      return [
        'If an application was refused:',
        '• Read the refusal letter carefully — it names the exact ground of refusal.',
        '• Address that ground with evidence (funds trail, ties to Bangladesh, corrected itinerary).',
        '• Never submit altered bank statements or false bookings — that triggers a long-term ban.',
        'Our refusal review service maps each ground to the documents that answer it.',
      ].join('\n');
    }

    return [
      'I can help with destination requirements, document checklists, application status, appointments and fee receipts.',
      'Try asking: “Do I need a visa for Turkey?”, “What is my application status?” or “How much have I paid?”',
    ].join('\n');
  };

  const ask = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    const clientMessage: Message = { id: nextId.current++, role: 'client', text: trimmed };
    setMessages((prev) => [...prev, clientMessage]);
    setInput('');
    setIsTyping(true);

    const answer = buildAnswer(trimmed);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { id: nextId.current++, role: 'agent', text: answer }]);
      setIsTyping(false);
    }, 550);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#1f1f1f] sm:text-3xl">AI Visa Agent</h1>
            <span className="rounded-full bg-[#c2e7ff] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#001d35]">
              Beta
            </span>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-[#444746]">
            Instant answers on entry rules, document checklists, appointments and fee receipts —
            grounded in VisaHOBe’s verified country dataset.
          </p>
        </div>

      </div>

      {/* Conversation */}
      <div className="glass-flat glass-sheen flex flex-col overflow-hidden rounded-[28px]">
        <div
          ref={scrollRef}
          role="log"
          aria-live="polite"
          aria-label="Conversation with the VisaHOBe AI visa agent"
          className="max-h-[460px] min-h-[320px] flex-1 space-y-4 overflow-y-auto p-5 sm:p-6"
        >
          {messages.map((message) => {
            const isAgent = message.role === 'agent';
            return (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${isAgent ? '' : 'flex-row-reverse'}`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isAgent
                      ? 'bg-gradient-to-br from-[#1a73e8] to-[#0d47a1] text-white'
                      : 'bg-[#e8f0fe] text-[#0b57d0]'
                  }`}
                >
                  <span className="material-icons text-[18px] leading-none">
                    {isAgent ? 'auto_awesome' : 'person'}
                  </span>
                </span>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isAgent
                      ? 'bg-white/80 text-[#3c4043] shadow-2xs ring-1 ring-black/[0.04]'
                      : 'bg-[#0b57d0] text-white'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>

                  {message.chips && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.chips.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => ask(chip)}
                          className="rounded-full border border-[#c2e7ff] bg-[#e8f0fe]/80 px-3 py-1 text-[11.5px] font-semibold text-[#0b57d0] transition-colors hover:bg-[#d7e6fd] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/60"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#1a73e8] to-[#0d47a1] text-white">
                <span className="material-icons text-[18px] leading-none">auto_awesome</span>
              </span>
              <span className="flex items-center gap-1 rounded-2xl bg-white/80 px-4 py-3 shadow-2xs ring-1 ring-black/[0.04]">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9aa0a6]"
                    style={{ animationDelay: `${dot * 120}ms` }}
                  />
                ))}
              </span>
            </div>
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex items-center gap-2 border-t border-black/[0.06] bg-white/60 p-3 sm:p-4"
        >
          <label className="sr-only" htmlFor="agent-input">
            Ask the AI visa agent
          </label>
          <input
            id="agent-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a country, documents, appointments or fees…"
            className="min-w-0 flex-1 rounded-full border border-black/[0.08] bg-white/90 px-4 py-2.5 text-sm text-[#1f1f1f] placeholder:text-[#9aa0a6] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/25"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send question"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0b57d0] text-white transition-colors hover:bg-[#0842a0] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <span className="material-icons text-[20px] leading-none">send</span>
          </button>
        </form>
      </div>

      <p className="text-[11px] leading-relaxed text-[#70757a]">
        The agent summarises official requirements only. It never fabricates documents and its
        answers are not legal advice — final decisions rest with the embassy or consulate.
      </p>
    </div>
  );
};
