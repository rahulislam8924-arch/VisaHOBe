import React from 'react';
import type { ApplicationStatus, DocumentStatus } from '../../lib/portalTypes';
import { APPLICATION_STATUS } from '../../lib/portalTypes';

export const STATUS_TONE: Record<ApplicationStatus, string> = {
  draft: 'bg-neutral-100 text-neutral-700 ring-neutral-200',
  info_required: 'bg-amber-50 text-amber-800 ring-amber-200',
  documents_required: 'bg-amber-50 text-amber-800 ring-amber-200',
  documents_under_review: 'bg-sky-50 text-sky-800 ring-sky-200',
  application_prepared: 'bg-sky-50 text-sky-800 ring-sky-200',
  internal_review: 'bg-indigo-50 text-indigo-800 ring-indigo-200',
  client_approval_required: 'bg-[#e8f0fe] text-[#0b57d0] ring-[#c2e7ff]',
  client_approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  ready_for_submission: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  submitted: 'bg-blue-50 text-blue-700 ring-blue-200',
  processing: 'bg-blue-50 text-blue-700 ring-blue-200',
  decision_received: 'bg-teal-50 text-teal-700 ring-teal-200',
  passport_ready: 'bg-teal-50 text-teal-700 ring-teal-200',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  cancelled: 'bg-neutral-100 text-neutral-500 ring-neutral-200',
};

export const StatusPill: React.FC<{ status: ApplicationStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  const meta = APPLICATION_STATUS[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${STATUS_TONE[status]} ${className}`}
      title={meta.hint}
    >
      {meta.label}
    </span>
  );
};

export const DOC_TONE: Record<DocumentStatus, string> = {
  missing: 'bg-amber-50 text-amber-800 ring-amber-200',
  uploaded: 'bg-sky-50 text-sky-800 ring-sky-200',
  under_review: 'bg-sky-50 text-sky-800 ring-sky-200',
  verified: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  rejected: 'bg-red-50 text-red-700 ring-red-200',
  expired: 'bg-neutral-100 text-neutral-600 ring-neutral-200',
};

export const DOC_LABEL: Record<DocumentStatus, string> = {
  missing: 'Missing',
  uploaded: 'Uploaded',
  under_review: 'Under review',
  verified: 'Verified (preliminary)',
  rejected: 'Rejected',
  expired: 'Expired',
};

export const DocPill: React.FC<{ status: DocumentStatus }> = ({ status }) => (
  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${DOC_TONE[status]}`}>
    {DOC_LABEL[status]}
  </span>
);

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'lg',
}) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const width = size === 'md' ? 'max-w-xl' : size === 'xl' ? 'max-w-5xl' : 'max-w-3xl';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-xs sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`glass-panel relative my-4 w-full ${width} overflow-hidden rounded-[28px] text-left animate-in fade-in duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-5 py-4 sm:px-6">
          <div>
            <h3 className="font-['Google_Sans',Roboto,sans-serif] text-lg font-medium text-[#1f1f1f]">
              {title}
            </h3>
            {subtitle && <p className="mt-0.5 text-xs text-[#5f6368]">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#444746] transition-colors hover:bg-neutral-100 cursor-pointer"
            aria-label="Close"
          >
            <span className="material-icons text-xl">close</span>
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-4 sm:px-6">{children}</div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-black/[0.06] bg-white/50 px-5 py-3 sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const InfoRow: React.FC<{ label: string; value?: React.ReactNode; mono?: boolean }> = ({
  label,
  value,
  mono,
}) => (
  <div className="flex items-start justify-between gap-4 py-1.5 text-xs">
    <span className="shrink-0 text-[#5f6368]">{label}</span>
    <span className={`text-right font-medium text-[#1f1f1f] ${mono ? 'font-mono' : ''}`}>
      {value ?? '—'}
    </span>
  </div>
);

export const EmptyState: React.FC<{
  icon?: string;
  title: string;
  body?: string;
  action?: React.ReactNode;
}> = ({ icon = 'inbox', title, body, action }) => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 bg-white/50 p-8 text-center">
    <span className="material-icons text-3xl text-neutral-300">{icon}</span>
    <p className="text-sm font-semibold text-neutral-800">{title}</p>
    {body && <p className="max-w-md text-xs leading-relaxed text-[#5f6368]">{body}</p>}
    {action}
  </div>
);

export const downloadTextFile = (filename: string, content: string, type = 'text/plain') => {
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const primaryButton =
  'inline-flex items-center gap-1.5 rounded-full bg-[#0b57d0] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0842a0] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer';
export const secondaryButton =
  'inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#0b57d0] ring-1 ring-black/[0.08] transition-colors hover:bg-neutral-50 cursor-pointer';
export const ghostButton =
  'inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium text-[#444746] transition-colors hover:bg-neutral-100 cursor-pointer';
export const dangerButton =
  'inline-flex items-center gap-1.5 rounded-full border border-[#c5221f]/30 px-4 py-2 text-xs font-semibold text-[#c5221f] transition-colors hover:bg-[#fce8e6] cursor-pointer';
