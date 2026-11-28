import React, { useMemo, useState } from 'react';
import type { PortalActions, PortalState } from '../../lib/portalStore';
import {
  APPLICATION_STATUS,
  formatDate,
  formatMoney,
  missingDocuments,
  totalFees,
  type StatusBucket,
  type VisaApplication,
} from '../../lib/portalTypes';
import { applicationProgress } from '../../lib/portalMetrics';
import { ApplicationDetail, type TabId } from './ApplicationDetail';
import { EmptyState, StatusPill, downloadTextFile, ghostButton, secondaryButton } from './portalUi';
import { useToast } from './PortalToast';

interface DashboardApplicationsProps {
  state: PortalState;
  actions: PortalActions;
  onOpenSupport: (applicationId?: string) => void;
  openApplicationId?: string | null;
  openApplicationTab?: TabId;
  onOpenApplication: (id: string | null) => void;
  onStartApplication: () => void;
}

const FILTERS: { id: 'all' | StatusBucket; label: string }[] = [
  { id: 'all', label: 'All applications' },
  { id: 'draft', label: 'Draft' },
  { id: 'active', label: 'Active' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const summaryText = (app: VisaApplication) =>
  [
    `VisaHOBe application ${app.id}`,
    `${app.destination} · ${app.visaType}`,
    `Status: ${APPLICATION_STATUS[app.status].label}`,
    `Created: ${formatDate(app.createdAt)} · Updated: ${formatDate(app.updatedAt)}`,
    `Applicant: ${app.applicant.fullName} (${app.applicant.passportNumber})`,
    `Travel: ${app.travel.dateFrom} → ${app.travel.dateTo} · ${app.travel.purpose}`,
    `Documents: ${app.documents.filter((d) => d.status === 'verified').length}/${app.documents.length} verified`,
    `Missing: ${missingDocuments(app).map((d) => d.label).join(', ') || 'none'}`,
    `Estimated fees: ${formatMoney(totalFees(app.fees))}`,
    'Preview only — nothing has been submitted.',
  ].join('\n');

export const DashboardApplications: React.FC<DashboardApplicationsProps> = ({
  state,
  actions,
  onOpenSupport,
  openApplicationId,
  openApplicationTab = 'overview',
  onOpenApplication,
  onStartApplication,
}) => {
  const { notify } = useToast();
  const [filter, setFilter] = useState<'all' | StatusBucket>('all');
  const [query, setQuery] = useState('');
  const [detailTab, setDetailTab] = useState<TabId>(openApplicationTab);

  React.useEffect(() => {
    if (openApplicationId) setDetailTab(openApplicationTab);
  }, [openApplicationId, openApplicationTab]);

  const paidTotal = state.transactions
    .filter((tx) => tx.status !== 'Declined')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const counts = useMemo(() => {
    const base: Record<string, number> = { all: state.applications.length };
    (['draft', 'active', 'pending', 'completed', 'cancelled'] as StatusBucket[]).forEach((bucket) => {
      base[bucket] = state.applications.filter(
        (app) => APPLICATION_STATUS[app.status].bucket === bucket
      ).length;
    });
    return base;
  }, [state.applications]);

  const visible = state.applications.filter((app) => {
    const matchesFilter =
      filter === 'all' || APPLICATION_STATUS[app.status].bucket === filter;
    const value = query.trim().toLowerCase();
    const matchesQuery =
      !value ||
      app.destination.toLowerCase().includes(value) ||
      app.visaType.toLowerCase().includes(value) ||
      app.id.toLowerCase().includes(value) ||
      app.applicant.fullName.toLowerCase().includes(value);
    return matchesFilter && matchesQuery;
  });

  const selected = state.applications.find((app) => app.id === openApplicationId) ?? null;

  const open = (id: string, tab: TabId) => {
    setDetailTab(tab);
    onOpenApplication(id);
  };

  return (
    <div className="max-w-5xl space-y-5 animate-in fade-in text-left duration-300">
      <div className="flex flex-col justify-between gap-3 pb-1 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <h2 className="font-['Google_Sans',Roboto,sans-serif] text-3xl font-normal text-[#1f1f1f] sm:text-4xl">
            My Applications
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-[#444746]">
            Every visa file you prepared with the AI agent — documents, checks, approval preview and
            timeline in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={onStartApplication}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#0b57d0] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0842a0] cursor-pointer"
        >
          <span className="material-icons text-lg">auto_awesome</span>
          Start with AI agent
        </button>
      </div>

      {/* Filters + search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[11.5px] font-medium transition-colors cursor-pointer ${
                filter === item.id
                  ? 'bg-[#c2e7ff] font-semibold text-[#001d35]'
                  : 'bg-white text-[#444746] ring-1 ring-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {item.label}
              <span
                className={`rounded-full px-1.5 text-[10px] font-semibold ${
                  filter === item.id ? 'bg-white/70' : 'bg-neutral-100'
                }`}
              >
                {counts[item.id] ?? 0}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by country, type or ID…"
            className="w-full rounded-full border border-neutral-300 bg-white py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/30"
            aria-label="Search applications"
          />
          <span className="material-icons absolute left-2.5 top-2 text-base text-neutral-400">
            search
          </span>
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon="folder_off"
          title={state.applications.length === 0 ? 'No applications yet' : 'Nothing in this filter'}
          body={
            state.applications.length === 0
              ? 'Start with the AI visa agent: it collects your details, builds the checklist and prepares the approval preview.'
              : 'Try another filter or clear the search.'
          }
          action={
            <button
              type="button"
              onClick={onStartApplication}
              className="mt-1 rounded-full bg-[#0b57d0] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0842a0] cursor-pointer"
            >
              Start a new application
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {visible.map((app) => {
            const missing = missingDocuments(app);
            const progress = applicationProgress(app.status, app.documents);
            return (
              <div
                key={app.id}
                className="glass-flat glass-sheen rounded-[24px] p-4 shadow-xs sm:p-5"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-['Google_Sans',Roboto,sans-serif] text-base font-medium text-[#1f1f1f]">
                        {app.destination}
                      </h3>
                      <StatusPill status={app.status} />
                      {app.demo && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 ring-1 ring-amber-200">
                          demo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#444746]">
                      {app.visaType} · <span className="font-mono">{app.id}</span> · created{' '}
                      {formatDate(app.createdAt)}
                    </p>
                    <p className="text-[11px] text-[#5f6368]">
                      {missing.length === 0
                        ? `${app.documents.filter((d) => d.status === 'verified').length}/${app.documents.length} documents verified`
                        : `${missing.length} missing document(s): ${missing
                            .map((doc) => doc.label)
                            .join(', ')}`}
                    </p>
                    <p className="text-[11px] text-[#5f6368]">
                      Fees {formatMoney(totalFees(app.fees))} · approval{' '}
                      {app.approval.status.replace(/_/g, ' ')} · submission{' '}
                      {app.submissionStatus === 'not_submitted'
                        ? 'not submitted'
                        : app.submissionStatus === 'ready_for_staff_review'
                        ? 'ready for staff review'
                        : 'submitted (simulated)'}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-neutral-200">
                        <div
                          className="h-full rounded-full bg-[#0b57d0]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-[#5f6368]">{progress}%</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                    <button
                      type="button"
                      className={secondaryButton}
                      onClick={() => open(app.id, 'overview')}
                    >
                      View details
                    </button>
                    <button
                      type="button"
                      className={ghostButton}
                      onClick={() =>
                        open(app.id, missing.length ? 'documents' : 'approval')
                      }
                    >
                      Continue
                    </button>
                    <button
                      type="button"
                      className={ghostButton}
                      onClick={() => open(app.id, 'documents')}
                    >
                      Documents
                    </button>
                    <button
                      type="button"
                      className={ghostButton}
                      onClick={() => open(app.id, 'timeline')}
                    >
                      Timeline
                    </button>
                    <button
                      type="button"
                      className={ghostButton}
                      onClick={() => {
                        downloadTextFile(`VisaHOBe-${app.id}.txt`, summaryText(app));
                        notify('Application summary downloaded');
                      }}
                    >
                      Summary
                    </button>
                    <button
                      type="button"
                      className={ghostButton}
                      onClick={() => onOpenSupport(app.id)}
                    >
                      Support
                    </button>
                  </div>
                </div>

                {app.status === 'client_approval_required' && (
                  <div className="mt-3 flex flex-col items-start justify-between gap-2 rounded-2xl bg-[#e8f0fe]/80 p-3 sm:flex-row sm:items-center">
                    <p className="text-[11.5px] text-[#001d35]">
                      The AI agent prepared version {app.version}. Review the preview and approve it,
                      or request a correction.
                    </p>
                    <button
                      type="button"
                      className="shrink-0 rounded-full bg-[#0b57d0] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#0842a0] cursor-pointer"
                      onClick={() => open(app.id, 'approval')}
                    >
                      Review & approve
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ApplicationDetail
        open={Boolean(selected)}
        application={selected}
        actions={actions}
        paidTotal={paidTotal}
        initialTab={detailTab}
        onClose={() => onOpenApplication(null)}
        onOpenSupport={(id) => onOpenSupport(id)}
      />
    </div>
  );
};
