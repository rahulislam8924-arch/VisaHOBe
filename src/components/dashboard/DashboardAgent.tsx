import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AGENT_QUICK_PROMPTS,
  emptyAgentSession,
  runAgentTurn,
  type AgentSession,
} from '../../lib/aiAgent';
import { getPortalMetrics } from '../../lib/portalMetrics';
import type { PortalState } from '../../lib/portalStore';
import type { NewApplicationInput } from '../../lib/portalStore';
import type { VisaApplication } from '../../lib/portalTypes';
import { useToast } from './PortalToast';

interface Message {
  id: number;
  role: 'client' | 'agent';
  text: string;
  at: string;
}

interface DashboardAgentProps {
  state: PortalState;
  onCreateApplication: (input: NewApplicationInput) => VisaApplication;
  onOpenApplication: (applicationId: string) => void;
  onOpenSupport: () => void;
}

const now = () =>
  new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

export const DashboardAgent: React.FC<DashboardAgentProps> = ({
  state,
  onCreateApplication,
  onOpenApplication,
  onOpenSupport,
}) => {
  const { notify } = useToast();
  const metrics = useMemo(() => getPortalMetrics(state), [state]);

  const [session, setSession] = useState<AgentSession>(emptyAgentSession);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'agent',
      text: [
        `Hello ${state.profile.fullName.split(' ')[0] || 'there'} — I am the VisaHOBe AI visa agent.`,
        '',
        'I can prepare a complete application with you: requirements, applicant and passport details, the document checklist, a preliminary document check, the form preview and an estimated fee.',
        '',
        'Tell me the country you want to visit, or ask me anything about visas.',
      ].join('\n'),
      at: now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(AGENT_QUICK_PROMPTS);
  const nextId = useRef(2);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (typeof bottomRef.current?.scrollIntoView === 'function') {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isTyping]);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    []
  );

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || isTyping) return;

    const clientMessage: Message = { id: nextId.current++, role: 'client', text, at: now() };
    setMessages((prev) => [...prev, clientMessage]);
    setInput('');

    const result = runAgentTurn(session, text, {
      defaultApplicant: {
        fullName: state.profile.fullName,
        dateOfBirth: state.profile.dateOfBirth,
        nationality: state.profile.nationality,
        email: state.profile.email,
        phone: state.profile.phone,
        passportNumber: state.profile.passportNumber,
        passportExpiry: state.profile.passportExpiry,
        passportIssueCountry: state.profile.passportIssueCountry,
        gender: state.profile.gender,
      },
      applicationCount: metrics.totalApplications,
      missingDocuments: metrics.missingDocuments,
      pendingApprovals: metrics.pendingApprovals,
    });

    setSession(result.session);
    setIsTyping(true);

    const typingTimer = window.setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        ...result.replies.map((reply) => ({
          id: nextId.current++,
          role: 'agent' as const,
          text: reply,
          at: now(),
        })),
      ]);
      setSuggestions(result.suggestions);

      if (result.openSupport) onOpenSupport();

      if (result.createdApplication) {
        const application = onCreateApplication(result.createdApplication);
        notify('Draft application created — upload the checklist documents');
        onOpenApplication(application.id);
      }
    }, 550);

    timers.current.push(typingTimer);
  };

  const currentStep = session.step;

  return (
    <div className="max-w-5xl space-y-4 animate-in fade-in text-left duration-300">
      <div className="space-y-1 pb-1">
        <h2 className="font-['Google_Sans',Roboto,sans-serif] text-3xl font-normal text-[#1f1f1f] sm:text-4xl">
          AI Visa Agent
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-[#444746]">
          Your application assistant, grounded in the verified 190-country dataset and your own
          portal records. It prepares the application — you review and approve before anything moves
          forward.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Chat */}
        <div className="glass-flat glass-sheen flex h-[560px] flex-col overflow-hidden rounded-[28px] shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f0fe] text-[#0b57d0]">
                <span className="material-icons text-base">auto_awesome</span>
              </span>
              <div>
                <p className="text-sm font-semibold text-[#1f1f1f]">VisaHOBe AI Agent</p>
                <p className="text-[11px] text-[#5f6368]">
                  {currentStep === 'idle'
                    ? 'Ready · preview mode'
                    : `Collecting details · step: ${currentStep}`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenSupport}
              className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#0b57d0] ring-1 ring-black/[0.08] transition-colors hover:bg-neutral-50 cursor-pointer"
            >
              Contact support
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'client' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed ${
                    message.role === 'client'
                      ? 'bg-[#0b57d0] text-white'
                      : 'bg-white text-[#1f1f1f] ring-1 ring-black/[0.06]'
                  }`}
                >
                  {message.text}
                  <span
                    className={`mt-1 block text-[10px] ${
                      message.role === 'client' ? 'text-white/70' : 'text-[#9aa0a6]'
                    }`}
                  >
                    {message.at}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl bg-white px-3.5 py-3 ring-1 ring-black/[0.06]">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9aa0a6]"
                      style={{ animationDelay: `${dot * 120}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-t border-black/[0.06] px-4 py-2">
              {suggestions.slice(0, 4).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => send(suggestion)}
                  className="rounded-full bg-[#e8f0fe] px-3 py-1.5 text-[11px] font-medium text-[#0b57d0] transition-colors hover:bg-[#d2e3fc] cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-black/[0.06] px-3 py-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a country, documents, appointments or fees…"
              className="min-w-0 flex-1 rounded-full border border-black/[0.08] bg-white/90 px-4 py-2.5 text-sm text-[#1f1f1f] placeholder:text-[#9aa0a6] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/25"
              aria-label="Message the AI visa agent"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0b57d0] text-white transition-colors hover:bg-[#0842a0] disabled:opacity-40 cursor-pointer"
              aria-label="Send message"
            >
              <span className="material-icons text-lg">send</span>
            </button>
          </form>
        </div>

        {/* Side rail */}
        <div className="space-y-4">
          <div className="glass-flat glass-sheen space-y-3 rounded-[28px] p-5 shadow-xs">
            <h3 className="font-['Google_Sans',Roboto,sans-serif] text-base font-medium text-[#1f1f1f]">
              What I can prepare
            </h3>
            <ul className="space-y-1.5 text-xs text-[#444746]">
              {[
                'Visa requirement & country guidance',
                'Applicant and passport details',
                'Document checklist generation',
                'Preliminary document validation',
                'Application form preparation',
                'Fee estimation & preview',
                'Client approval package',
                'Appointment and support help',
              ].map((item) => (
                <li key={item} className="flex items-start gap-1.5">
                  <span className="material-icons text-[14px] text-emerald-600">check</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-flat glass-sheen space-y-2 rounded-[28px] p-5 shadow-xs">
            <h3 className="font-['Google_Sans',Roboto,sans-serif] text-base font-medium text-[#1f1f1f]">
              Your file
            </h3>
            <p className="text-xs text-[#444746]">
              {metrics.totalApplications} application{metrics.totalApplications === 1 ? '' : 's'} ·{' '}
              {metrics.missingDocuments} missing document{metrics.missingDocuments === 1 ? '' : 's'} ·{' '}
              {metrics.pendingApprovals} awaiting approval
            </p>
            <button
              type="button"
              onClick={onOpenSupport}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold text-[#0b57d0] ring-1 ring-black/[0.08] transition-colors hover:bg-neutral-50 cursor-pointer"
            >
              <span className="material-icons text-sm">support_agent</span>
              Talk to human support
            </button>
          </div>

          <p className="rounded-2xl bg-amber-50/70 p-3 text-[11px] leading-relaxed text-amber-900 ring-1 ring-amber-200">
            Preview mode: the agent never submits an application, never guarantees an approval and
            never contacts an embassy. All statuses are AI-generated or simulated.
          </p>
        </div>
      </div>
    </div>
  );
};
