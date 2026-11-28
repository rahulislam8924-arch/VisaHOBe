import React, { useMemo, useState } from 'react';
import type { PortalActions, PortalState } from '../../lib/portalStore';
import { formatDateTime } from '../../lib/portalTypes';
import { useToast } from './PortalToast';
import { EmptyState, Modal, ghostButton, primaryButton, secondaryButton } from './portalUi';

interface SupportPanelProps {
  open: boolean;
  onClose: () => void;
  state: PortalState;
  actions: PortalActions;
  applicationId?: string;
}

const SUBJECTS = [
  'General visa question',
  'Document issue',
  'Payment or refund',
  'Appointment change',
  'Application correction',
  'Complaint',
];

export const SupportPanel: React.FC<SupportPanelProps> = ({
  open,
  onClose,
  state,
  actions,
  applicationId,
}) => {
  const { notify } = useToast();
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState('');
  const [linkedApplication, setLinkedApplication] = useState(applicationId ?? '');
  const [reply, setReply] = useState<Record<string, string>>({});

  const tickets = useMemo(
    () =>
      applicationId
        ? state.support.filter((ticket) => ticket.applicationId === applicationId)
        : state.support,
    [state.support, applicationId]
  );

  React.useEffect(() => {
    if (open) setLinkedApplication(applicationId ?? '');
  }, [open, applicationId]);

  const submit = () => {
    if (message.trim().length < 10) {
      notify('Please describe the issue in at least 10 characters', 'info');
      return;
    }
    const ticket = actions.createSupportTicket(
      subject,
      message.trim(),
      linkedApplication || undefined
    );
    setMessage('');
    notify(`Support request ${ticket.id} created`);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Support"
      size="lg"
      subtitle="Requests are handled inside the portal. No e-mail, SMS or WhatsApp message is sent in preview mode."
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-neutral-200 bg-white/70 p-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
            New support request
          </h4>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="block text-[11px] text-[#5f6368]">
              Topic
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/25"
              >
                {SUBJECTS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-[11px] text-[#5f6368]">
              Link to application (optional)
              <select
                value={linkedApplication}
                onChange={(e) => setLinkedApplication(e.target.value)}
                className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/25"
              >
                <option value="">No application</option>
                {state.applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.destination} · {app.id}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Describe the issue — for example: my bank statement was rejected and I want to know what to upload."
            className="mt-2 w-full rounded-2xl border border-neutral-300 bg-white p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/25"
          />

          <div className="mt-2 flex justify-end">
            <button
              type="button"
              className={primaryButton}
              disabled={message.trim().length < 10}
              onClick={submit}
            >
              <span className="material-icons text-sm">send</span>
              Create request
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
            Previous conversations ({tickets.length})
          </h4>

          {tickets.length === 0 ? (
            <EmptyState
              icon="support_agent"
              title="No support requests yet"
              body="Create a request above and the case team will reply here."
            />
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-2xl border border-neutral-200 bg-white/70 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[12.5px] font-semibold text-neutral-900">{ticket.subject}</p>
                    <p className="text-[10.5px] text-[#5f6368]">
                      <span className="font-mono">{ticket.id}</span> · created{' '}
                      {formatDateTime(ticket.createdAt)}
                      {ticket.applicationId ? ` · ${ticket.applicationId}` : ''}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${
                      ticket.status === 'closed'
                        ? 'bg-neutral-100 text-neutral-600 ring-neutral-200'
                        : 'bg-[#e8f0fe] text-[#0b57d0] ring-[#c2e7ff]'
                    }`}
                  >
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-2 space-y-1.5">
                  {ticket.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded-xl px-3 py-2 text-[11.5px] leading-relaxed ${
                        msg.from === 'client'
                          ? 'ml-6 bg-[#0b57d0] text-white'
                          : 'mr-6 bg-neutral-100 text-[#1f1f1f]'
                      }`}
                    >
                      {msg.text}
                      <span
                        className={`mt-0.5 block text-[9.5px] ${
                          msg.from === 'client' ? 'text-white/70' : 'text-[#5f6368]'
                        }`}
                      >
                        {msg.from === 'client' ? 'You' : 'VisaHOBe support (simulated)'} ·{' '}
                        {formatDateTime(msg.at)}
                      </span>
                    </div>
                  ))}
                </div>

                {ticket.status !== 'closed' && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={reply[ticket.id] ?? ''}
                      onChange={(e) => setReply({ ...reply, [ticket.id]: e.target.value })}
                      placeholder="Add a reply…"
                      className="min-w-0 flex-1 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-[11.5px] focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/25"
                      aria-label={`Reply to ${ticket.id}`}
                    />
                    <button
                      type="button"
                      className={secondaryButton}
                      onClick={() => {
                        const text = (reply[ticket.id] ?? '').trim();
                        if (!text) return;
                        actions.replySupportTicket(ticket.id, text);
                        setReply({ ...reply, [ticket.id]: '' });
                        notify('Reply added to the request');
                      }}
                    >
                      Reply
                    </button>
                    <button
                      type="button"
                      className={ghostButton}
                      onClick={() => actions.closeSupportTicket(ticket.id)}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
