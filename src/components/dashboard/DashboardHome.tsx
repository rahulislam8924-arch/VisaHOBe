import React from 'react';
import type { PortalState } from '../../lib/portalStore';
import { formatDate, formatDateTime } from '../../lib/portalTypes';
import { formatUsd, getPortalMetrics } from '../../lib/portalMetrics';
import type { DashboardTab } from './DashboardLayout';
import { EmptyState, StatusPill } from './portalUi';
import { WelcomeIllustration } from './DashboardIllustrations';

interface DashboardHomeProps {
  state: PortalState;
  onNavigateTab: (tab: DashboardTab) => void;
  onOpenApplication: (id: string, tab?: 'overview' | 'documents' | 'timeline' | 'approval' | 'payment') => void;
  onOpenSupport: () => void;
  isDemoData: boolean;
  onClearDemoRecords: () => void;
  onDismissDemo: () => void;
}

const StatTile: React.FC<{
  label: string;
  value: string;
  hint?: string;
  icon: string;
  tone?: 'default' | 'warn' | 'good';
  onClick?: () => void;
}> = ({ label, value, hint, icon, tone = 'default', onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`glass-flat glass-sheen flex flex-col items-start rounded-2xl p-3.5 text-left shadow-xs transition-colors ${
      onClick ? 'hover:bg-white/70 cursor-pointer' : 'cursor-default'
    }`}
  >
    <span
      className={`material-icons text-lg ${
        tone === 'warn' ? 'text-amber-600' : tone === 'good' ? 'text-emerald-600' : 'text-[#0b57d0]'
      }`}
    >
      {icon}
    </span>
    <span className="mt-1 text-xl font-semibold text-[#1f1f1f]">{value}</span>
    <span className="text-[11px] font-medium text-[#5f6368]">{label}</span>
    {hint && <span className="mt-0.5 text-[10px] text-[#9aa0a6]">{hint}</span>}
  </button>
);

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  state,
  onNavigateTab,
  onOpenApplication,
  onOpenSupport,
  isDemoData,
  onClearDemoRecords,
  onDismissDemo,
}) => {
  const metrics = getPortalMetrics(state);
  const firstName = state.profile.fullName.trim().split(/\s+/)[0] || 'there';
  const applications = state.applications;
  const attention = applications
    .filter((app) =>
      ['client_approval_required', 'documents_required', 'info_required', 'internal_review'].includes(
        app.status
      )
    )
    .slice(0, 4);
  const recentActivity = state.activity.slice(0, 5);
  const unread = state.notifications.filter((item) => !item.read).slice(0, 4);

  return (
    <div className="space-y-5 animate-in fade-in text-left duration-300">
      {/* Welcome */}
      <div className="glass-flat glass-sheen relative flex flex-col items-start justify-between gap-5 overflow-hidden rounded-[28px] p-6 shadow-xs sm:p-7 md:flex-row md:items-center">
        <div className="max-w-xl space-y-2">
          <h2 className="font-['Google_Sans',Roboto,sans-serif] text-2xl font-normal tracking-tight text-[#1f1f1f] sm:text-[28px]">
            Welcome back, {firstName}
          </h2>
          <p className="text-sm leading-relaxed text-[#444746]">
            {metrics.totalApplications === 0
              ? 'You have no applications yet. The AI visa agent can prepare your first one end to end.'
              : `${metrics.totalApplications} application${
                  metrics.totalApplications === 1 ? '' : 's'
                } · ${metrics.active} active · ${metrics.missingDocuments} missing document${
                  metrics.missingDocuments === 1 ? '' : 's'
                } · ${formatUsd(metrics.outstanding)} pending payment.`}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onNavigateTab('agent')}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0b57d0] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0842a0] cursor-pointer"
            >
              <span className="material-icons text-sm">auto_awesome</span>
              {metrics.totalApplications === 0 ? 'Start with the AI agent' : 'Continue with the AI agent'}
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('applications')}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-[#0b57d0] ring-1 ring-black/[0.06] transition-colors hover:bg-white cursor-pointer"
            >
              <span className="material-icons text-sm">folder_shared</span>
              My applications
            </button>
            {metrics.pendingApprovals > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f0fe] px-3 py-1.5 text-[11px] font-medium text-[#0b57d0] ring-1 ring-[#c2e7ff]">
                <span className="material-icons text-sm">fact_check</span>
                {metrics.pendingApprovals} awaiting your approval
              </span>
            )}
          </div>
        </div>
        <div className="self-center md:self-auto">
          <WelcomeIllustration />
        </div>
      </div>

      {/* Demo banner */}
      {isDemoData && (
        <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-[#0b57d0]/20 bg-[#e8f0fe]/70 px-4 py-3 sm:flex-row sm:items-center">
          <p className="text-xs leading-relaxed text-[#001d35]">
            <span className="font-semibold">Demo records.</span> The applications, cards and receipts
            below are synthetic test data for preview mode.
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onDismissDemo}
              className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#0b57d0] ring-1 ring-[#0b57d0]/25 transition-colors hover:bg-[#f4f8ff] cursor-pointer"
            >
              Keep as demo
            </button>
            <button
              type="button"
              onClick={onClearDemoRecords}
              className="rounded-full bg-[#0b57d0] px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#0842a0] cursor-pointer"
            >
              Clear demo records
            </button>
          </div>
        </div>
      )}

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        <StatTile
          label="Total applications"
          value={String(metrics.totalApplications)}
          icon="folder_shared"
          onClick={() => onNavigateTab('applications')}
        />
        <StatTile
          label="Active"
          value={String(metrics.active)}
          icon="hourglass_top"
          onClick={() => onNavigateTab('applications')}
        />
        <StatTile
          label="Pending"
          value={String(metrics.pending)}
          hint="awaiting provider"
          icon="pending_actions"
          onClick={() => onNavigateTab('applications')}
        />
        <StatTile
          label="Completed"
          value={String(metrics.completed)}
          icon="task_alt"
          tone="good"
          onClick={() => onNavigateTab('applications')}
        />
        <StatTile
          label="Missing documents"
          value={String(metrics.missingDocuments)}
          icon="folder_off"
          tone={metrics.missingDocuments ? 'warn' : 'default'}
          onClick={() => onNavigateTab('applications')}
        />
        <StatTile
          label="Pending payments"
          value={formatUsd(metrics.outstanding)}
          icon="payments"
          tone={metrics.outstanding > 0 ? 'warn' : 'default'}
          onClick={() => onNavigateTab('payments')}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        {/* Left column */}
        <div className="space-y-5 lg:col-span-7">
          {/* Needs attention */}
          <section className="glass-flat glass-sheen space-y-3 rounded-[28px] p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="font-['Google_Sans',Roboto,sans-serif] text-lg font-medium text-[#1f1f1f]">
                  Needs your attention
                </h3>
                <p className="text-[11px] text-[#5f6368]">
                  Approvals, missing documents and corrections
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('applications')}
                className="text-[11px] font-semibold text-[#0b57d0] hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>

            {attention.length === 0 ? (
              <EmptyState
                icon="check_circle"
                title="Nothing waiting on you"
                body="New approvals and document requests will appear here as the agent prepares your files."
              />
            ) : (
              <div className="space-y-2">
                {attention.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() =>
                      onOpenApplication(
                        app.id,
                        app.status === 'client_approval_required' ? 'approval' : 'documents'
                      )
                    }
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white/70 p-3 text-left transition-colors hover:bg-white cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-semibold text-neutral-900">
                        {app.destination} · {app.visaType}
                      </p>
                      <p className="text-[10.5px] text-[#5f6368]">
                        {app.id} · updated {formatDate(app.updatedAt)}
                      </p>
                    </div>
                    <StatusPill status={app.status} />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Recent activity */}
          <section className="glass-flat glass-sheen space-y-3 rounded-[28px] p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-['Google_Sans',Roboto,sans-serif] text-lg font-medium text-[#1f1f1f]">
                Recent application activity
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('applications')}
                className="text-[11px] font-semibold text-[#0b57d0] hover:underline cursor-pointer"
              >
                Open timeline
              </button>
            </div>

            {recentActivity.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-neutral-300 bg-white/50 p-4 text-xs text-[#5f6368]">
                No activity recorded yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {recentActivity.map((entry) => (
                  <li key={entry.id} className="flex items-start gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0b57d0]" />
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-[#1f1f1f]">{entry.action}</p>
                      <p className="truncate text-[10.5px] text-[#5f6368]">
                        {entry.detail} · {formatDateTime(entry.at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-5 lg:col-span-5">
          {/* Upcoming appointments */}
          <section className="glass-flat glass-sheen space-y-3 rounded-[28px] p-5 shadow-xs">
            <h3 className="font-['Google_Sans',Roboto,sans-serif] text-lg font-medium text-[#1f1f1f]">
              Upcoming appointments
            </h3>
            {metrics.upcomingAppointments.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-neutral-300 bg-white/50 p-4 text-xs text-[#5f6368]">
                No appointments scheduled.
              </p>
            ) : (
              <div className="space-y-2">
                {metrics.upcomingAppointments.map((appointment) => (
                  <button
                    key={appointment.applicationId}
                    type="button"
                    onClick={() => onOpenApplication(appointment.applicationId, 'overview')}
                    className="flex w-full items-center gap-3 rounded-2xl border border-neutral-200 bg-white/70 p-3 text-left transition-colors hover:bg-white cursor-pointer"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f0fe] text-[#0b57d0]">
                      <span className="material-icons text-base">event</span>
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-neutral-900">
                        {formatDate(appointment.date)} · {appointment.time}
                      </p>
                      <p className="truncate text-[10.5px] text-[#5f6368]">
                        {appointment.destination} · {appointment.location}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Notifications */}
          <section className="glass-flat glass-sheen space-y-3 rounded-[28px] p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-['Google_Sans',Roboto,sans-serif] text-lg font-medium text-[#1f1f1f]">
                Notifications
              </h3>
              <span className="rounded-full bg-[#e8f0fe] px-2 py-0.5 text-[10px] font-semibold text-[#0b57d0]">
                {metrics.unreadNotifications} unread
              </span>
            </div>
            {unread.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-neutral-300 bg-white/50 p-4 text-xs text-[#5f6368]">
                You are all caught up.
              </p>
            ) : (
              <ul className="space-y-2">
                {unread.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() =>
                        item.applicationId && onOpenApplication(item.applicationId, 'overview')
                      }
                      className="w-full rounded-2xl border border-neutral-200 bg-white/70 p-2.5 text-left transition-colors hover:bg-white cursor-pointer"
                    >
                      <p className="text-[11.5px] font-semibold text-[#1f1f1f]">{item.title}</p>
                      <p className="text-[10.5px] leading-snug text-[#5f6368]">{item.body}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* AI + support */}
          <section className="glass-flat glass-sheen space-y-3 rounded-[28px] p-5 shadow-xs">
            <h3 className="font-['Google_Sans',Roboto,sans-serif] text-lg font-medium text-[#1f1f1f]">
              AI visa agent
            </h3>
            <p className="text-[11.5px] leading-relaxed text-[#444746]">
              Ask about requirements, appointments or fees — or let the agent prepare a complete
              application and document checklist.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onNavigateTab('agent')}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0b57d0] px-3.5 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-[#0842a0] cursor-pointer"
              >
                <span className="material-icons text-sm">auto_awesome</span>
                Open agent
              </button>
              <button
                type="button"
                onClick={onOpenSupport}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold text-[#0b57d0] ring-1 ring-black/[0.08] transition-colors hover:bg-neutral-50 cursor-pointer"
              >
                <span className="material-icons text-sm">support_agent</span>
                Support
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
