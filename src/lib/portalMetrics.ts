import type { DashboardPassItem } from '../data/dashboardMockData';
import type { PortalState } from './portalStore';

/**
 * Every number the dashboard shows is derived from the records the client
 * actually has — nothing is hard-coded copy.
 */

const MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

/** Reads the first "Mon DD, YYYY" date out of a pass label such as "Valid until: Oct 14, 2034" */
export const parsePassDate = (value?: string): Date | null => {
  if (!value) return null;
  const match = value.match(/([A-Za-z]{3})[a-z]*\s+(\d{1,2}),\s*(\d{4})/);
  if (!match) return null;
  const month = MONTHS.indexOf(match[1].toLowerCase());
  if (month < 0) return null;
  const date = new Date(Number(match[3]), month, Number(match[2]), 23, 59, 59);
  return Number.isNaN(date.getTime()) ? null : date;
};

export type ApplicationStatus = 'approved' | 'scheduled' | 'expired';

export const getApplicationStatus = (
  pass: DashboardPassItem,
  now: Date = new Date()
): ApplicationStatus => {
  const expiry = parsePassDate(pass.expiryDate);
  if (expiry && expiry.getTime() < now.getTime()) return 'expired';
  if (pass.category === 'ticket') return 'scheduled';
  return 'approved';
};

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  approved: 'Approved',
  scheduled: 'Appointment scheduled',
  expired: 'Expired',
};

export interface PortalMetrics {
  applications: number;
  approved: number;
  scheduled: number;
  expired: number;
  expiringSoon: number;
  savedCards: number;
  receipts: number;
  totalPaid: number;
}

export const getPortalMetrics = (
  state: Pick<PortalState, 'passes' | 'transactions' | 'cards'>
): PortalMetrics => {
  const now = new Date();
  const soon = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 180);

  let approved = 0;
  let scheduled = 0;
  let expired = 0;
  let expiringSoon = 0;

  state.passes.forEach((pass) => {
    const status = getApplicationStatus(pass, now);
    if (status === 'approved') approved += 1;
    else if (status === 'scheduled') scheduled += 1;
    else expired += 1;

    const expiry = parsePassDate(pass.expiryDate);
    if (expiry && expiry > now && expiry <= soon) expiringSoon += 1;
  });

  const paidTransactions = state.transactions.filter((tx) => tx.status !== 'Declined');
  const totalPaid = paidTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  return {
    applications: state.passes.length,
    approved,
    scheduled,
    expired,
    expiringSoon,
    savedCards: state.cards.length,
    receipts: paidTransactions.length,
    totalPaid,
  };
};

export const formatUsd = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const firstNameOf = (name: string) => name.trim().split(/\s+/)[0] || 'there';

/** "Alexander Morgan" -> "A. MORGAN", the way an e-Visa foil prints it */
export const holderLabel = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'APPLICANT';
  if (parts.length === 1) return parts[0].toUpperCase();
  return `${parts[0].charAt(0).toUpperCase()}. ${parts[parts.length - 1].toUpperCase()}`;
};

/** Keeps seeded records consistent with whichever applicant name the client set */
export const personalizePasses = (passes: DashboardPassItem[], name: string) =>
  passes.map((pass) => ({
    ...pass,
    extraDetails: pass.extraDetails.map((detail) =>
      /^alexander morgan$/i.test(detail.value.trim())
        ? { ...detail, value: name }
        : detail
    ),
  }));
