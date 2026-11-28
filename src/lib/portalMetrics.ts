import type { PortalState } from './portalStore';
import { APPLICATION_STATUS, totalFees, type ApplicationStatus } from './portalTypes';

/** Every dashboard figure is derived from the signed-in client's own records. */

export const formatUsd = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const firstNameOf = (name: string) => name.trim().split(/\s+/)[0] || 'there';

/** "Alexander Morgan" -> "A. MORGAN" (how an e-Visa foil prints it) */
export const holderLabel = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'APPLICANT';
  if (parts.length === 1) return parts[0].toUpperCase();
  return `${parts[0].charAt(0).toUpperCase()}. ${parts[parts.length - 1].toUpperCase()}`;
};

export interface UpcomingAppointment {
  applicationId: string;
  destination: string;
  date: string;
  time: string;
  location: string;
  status: string;
}

export interface PortalMetrics {
  totalApplications: number;
  draft: number;
  active: number;
  pending: number;
  completed: number;
  cancelled: number;
  missingDocuments: number;
  pendingApprovals: number;
  upcomingAppointments: UpcomingAppointment[];
  totalEstimated: number;
  paid: number;
  outstanding: number;
  receipts: number;
  savedCards: number;
  unreadNotifications: number;
}

const isMissingDoc = (doc: { required: boolean; status: string }) =>
  doc.required && (doc.status === 'missing' || doc.status === 'rejected');

export const getPortalMetrics = (
  state: Pick<PortalState, 'applications' | 'transactions' | 'cards' | 'notifications'>
): PortalMetrics => {
  const counts: Record<ApplicationStatus, number> = Object.keys(APPLICATION_STATUS).reduce(
    (acc, key) => ({ ...acc, [key]: 0 }),
    {} as Record<ApplicationStatus, number>
  );

  let missingDocuments = 0;
  let totalEstimated = 0;
  let pendingApprovals = 0;
  const appointments: UpcomingAppointment[] = [];

  state.applications.forEach((app) => {
    counts[app.status] += 1;
    missingDocuments += app.documents.filter(isMissingDoc).length;
    totalEstimated += totalFees(app.fees);
    if (app.status === 'client_approval_required') pendingApprovals += 1;
    if (app.appointment && app.appointment.status === 'scheduled') {
      appointments.push({
        applicationId: app.id,
        destination: app.destination,
        date: app.appointment.date,
        time: app.appointment.time,
        location: app.appointment.location,
        status: app.appointment.status,
      });
    }
  });

  const bucketCount = (bucket: string) =>
    (Object.keys(counts) as ApplicationStatus[]).reduce(
      (sum, status) =>
        APPLICATION_STATUS[status].bucket === bucket ? sum + counts[status] : sum,
      0
    );

  const paidTransactions = state.transactions.filter((tx) => tx.status !== 'Declined');
  const paid = paidTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  return {
    totalApplications: state.applications.length,
    draft: bucketCount('draft'),
    active: bucketCount('active'),
    pending: bucketCount('pending'),
    completed: bucketCount('completed'),
    cancelled: bucketCount('cancelled'),
    missingDocuments,
    pendingApprovals,
    upcomingAppointments: appointments.sort((a, b) => a.date.localeCompare(b.date)),
    totalEstimated,
    paid,
    outstanding: Math.max(0, totalEstimated - paid),
    receipts: paidTransactions.length,
    savedCards: state.cards.length,
    unreadNotifications: state.notifications.filter((n) => !n.read).length,
  };
};

export const applicationProgress = (
  status: ApplicationStatus,
  documents: { required: boolean; status: string }[]
) => {
  const base: Partial<Record<ApplicationStatus, number>> = {
    draft: 10,
    info_required: 20,
    documents_required: 35,
    documents_under_review: 55,
    application_prepared: 70,
    internal_review: 80,
    client_approval_required: 85,
    client_approved: 90,
    ready_for_submission: 95,
    submitted: 96,
    processing: 97,
    decision_received: 98,
    passport_ready: 99,
    completed: 100,
    cancelled: 100,
  };
  const required = documents.filter((doc) => doc.required);
  const verified = required.filter((doc) => doc.status === 'verified').length;
  const docScore = required.length ? (verified / required.length) * 15 : 0;
  const value = (base[status] ?? 10) + (status === 'documents_required' ? docScore : 0);
  return Math.min(100, Math.round(value));
};
