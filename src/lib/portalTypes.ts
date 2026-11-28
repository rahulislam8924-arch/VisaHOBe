/**
 * Client Portal domain model (safe development / preview mode).
 *
 * Nothing in this file talks to a government, payment or messaging provider.
 * Every status here is either AI-generated or staff-simulated and is labelled
 * as such in the UI.
 */

export type VisaCategory =
  | 'tourist'
  | 'business'
  | 'work'
  | 'student'
  | 'transit'
  | 'medical'
  | 'family';

export type ApplicationStatus =
  | 'draft'
  | 'info_required'
  | 'documents_required'
  | 'documents_under_review'
  | 'application_prepared'
  | 'internal_review'
  | 'client_approval_required'
  | 'client_approved'
  | 'ready_for_submission'
  | 'submitted'
  | 'processing'
  | 'decision_received'
  | 'passport_ready'
  | 'completed'
  | 'cancelled';

export type StatusBucket = 'draft' | 'active' | 'pending' | 'completed' | 'cancelled';
export type StatusSource = 'ai' | 'staff' | 'provider';

export interface StatusMeta {
  label: string;
  bucket: StatusBucket;
  source: StatusSource;
  hint: string;
}

export const APPLICATION_STATUS: Record<ApplicationStatus, StatusMeta> = {
  draft: { label: 'Draft', bucket: 'draft', source: 'ai', hint: 'Started by the AI agent' },
  info_required: {
    label: 'Information required',
    bucket: 'active',
    source: 'ai',
    hint: 'The agent still needs a few answers',
  },
  documents_required: {
    label: 'Documents required',
    bucket: 'active',
    source: 'ai',
    hint: 'Upload the missing documents',
  },
  documents_under_review: {
    label: 'Documents under review',
    bucket: 'active',
    source: 'ai',
    hint: 'Preliminary AI check in progress',
  },
  application_prepared: {
    label: 'Application prepared',
    bucket: 'active',
    source: 'ai',
    hint: 'Form prepared from your answers',
  },
  internal_review: {
    label: 'Internal review',
    bucket: 'active',
    source: 'staff',
    hint: 'Queued for the VisaHOBe case team (simulated)',
  },
  client_approval_required: {
    label: 'Client approval required',
    bucket: 'active',
    source: 'staff',
    hint: 'Please review the application preview',
  },
  client_approved: {
    label: 'Client approved',
    bucket: 'active',
    source: 'staff',
    hint: 'Preview approved by you',
  },
  ready_for_submission: {
    label: 'Ready for authorised submission',
    bucket: 'active',
    source: 'staff',
    hint: 'Awaiting an authorised officer — nothing has been submitted',
  },
  submitted: {
    label: 'Submitted (simulated)',
    bucket: 'pending',
    source: 'staff',
    hint: 'Development data — no provider was contacted',
  },
  processing: {
    label: 'Processing (simulated)',
    bucket: 'pending',
    source: 'provider',
    hint: 'Simulated provider status',
  },
  decision_received: {
    label: 'Decision received (simulated)',
    bucket: 'pending',
    source: 'provider',
    hint: 'Simulated decision — not a government update',
  },
  passport_ready: {
    label: 'Passport ready (simulated)',
    bucket: 'completed',
    source: 'provider',
    hint: 'Simulated courier status',
  },
  completed: { label: 'Completed', bucket: 'completed', source: 'staff', hint: 'Case closed' },
  cancelled: { label: 'Cancelled', bucket: 'cancelled', source: 'staff', hint: 'Cancelled by you' },
};

export const STATUS_ORDER: ApplicationStatus[] = [
  'draft',
  'info_required',
  'documents_required',
  'documents_under_review',
  'application_prepared',
  'internal_review',
  'client_approval_required',
  'client_approved',
  'ready_for_submission',
  'submitted',
  'processing',
  'decision_received',
  'passport_ready',
  'completed',
];

export const SOURCE_LABEL: Record<StatusSource, string> = {
  ai: 'AI-generated',
  staff: 'VisaHOBe staff (simulated)',
  provider: 'Provider status (simulated)',
};

export type DocumentStatus =
  | 'missing'
  | 'uploaded'
  | 'under_review'
  | 'verified'
  | 'rejected'
  | 'expired';

export interface DocumentHistoryEntry {
  at: string;
  action: string;
  note?: string;
}

export interface PortalDocument {
  id: string;
  key: string;
  label: string;
  required: boolean;
  status: DocumentStatus;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  uploadedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  expiryDate?: string;
  history: DocumentHistoryEntry[];
}

export interface ApplicantInfo {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  gender: string;
  email: string;
  phone: string;
  passportNumber: string;
  passportExpiry: string;
  passportIssueCountry: string;
}

export interface TravelInfo {
  purpose: string;
  dateFrom: string;
  dateTo: string;
}

export interface ApplicationFees {
  agency: number;
  government: number;
  embassy: number;
  additional: number;
  currency: 'USD';
}

export type ApprovalStatus = 'pending' | 'approved' | 'correction_requested';

export interface ApprovalRecord {
  version: number;
  status: ApprovalStatus;
  requestedAt?: string;
  approvedAt?: string;
  summary?: string;
  note?: string;
}

export interface TimelineEntry {
  at: string;
  status: ApplicationStatus;
  source: StatusSource;
  note: string;
}

export interface CorrectionRequest {
  at: string;
  message: string;
  status: 'open' | 'addressed';
}

export interface AppointmentInfo {
  date: string;
  time: string;
  location: string;
  status: 'scheduled' | 'reschedule_requested' | 'cancel_requested';
}

export interface CancellationRequest {
  at: string;
  reason: string;
  status: 'requested' | 'acknowledged';
}

export interface VisaApplication {
  id: string;
  clientId: string;
  destination: string;
  visaCategory: VisaCategory;
  visaType: string;
  status: ApplicationStatus;
  applicant: ApplicantInfo;
  travel: TravelInfo;
  documents: PortalDocument[];
  fees: ApplicationFees;
  notes: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEntry[];
  approval: ApprovalRecord;
  version: number;
  submissionStatus: 'not_submitted' | 'ready_for_staff_review' | 'submitted_simulated';
  appointment?: AppointmentInfo;
  corrections: CorrectionRequest[];
  cancellationRequest?: CancellationRequest;
  aiProgress: {
    answersCollected: number;
    answersTotal: number;
    checklistReady: boolean;
    formPrepared: boolean;
    validationPassed: boolean;
  };
  demo?: boolean;
}

export type NotificationKind =
  | 'application'
  | 'document'
  | 'approval'
  | 'payment'
  | 'appointment'
  | 'support'
  | 'system';

export interface PortalNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  at: string;
  read: boolean;
  applicationId?: string;
}

export interface ActivityEntry {
  id: string;
  at: string;
  action: string;
  detail: string;
  applicationId?: string;
}

export type SupportStatus = 'open' | 'awaiting_client' | 'closed';

export interface SupportMessage {
  id: string;
  from: 'client' | 'support';
  text: string;
  at: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: SupportStatus;
  createdAt: string;
  updatedAt: string;
  applicationId?: string;
  messages: SupportMessage[];
}

export interface ServiceRequest {
  id: string;
  type: 'appointment_reschedule' | 'appointment_cancel' | 'cancellation' | 'refund' | 'correction';
  applicationId: string;
  at: string;
  note: string;
  status: 'requested' | 'acknowledged';
}

/* ------------------------------------------------------------------ */
/* Fee estimation + document checklists (configured data, not live API) */
/* ------------------------------------------------------------------ */

const GOVERNMENT_FEES: Record<string, number> = {
  'united states': 185,
  'united kingdom': 145,
  canada: 100,
  australia: 145,
  schengen: 88,
  france: 88,
  germany: 88,
  italy: 88,
  spain: 88,
  netherlands: 88,
  'united arab emirates': 90,
  'saudi arabia': 35,
  qatar: 25,
  japan: 25,
  'south korea': 40,
  china: 140,
  india: 40,
  thailand: 40,
  malaysia: 30,
  singapore: 30,
  turkey: 50,
  bangladesh: 10,
  pakistan: 25,
  egypt: 25,
  'south africa': 40,
  brazil: 45,
  'new zealand': 120,
};

const CATEGORY_BASE_FEE: Record<VisaCategory, number> = {
  tourist: 80,
  business: 100,
  work: 150,
  student: 90,
  transit: 30,
  medical: 70,
  family: 85,
};

export const VISA_CATEGORY_LABEL: Record<VisaCategory, string> = {
  tourist: 'Tourist / visitor',
  business: 'Business',
  work: 'Work',
  student: 'Student',
  transit: 'Transit',
  medical: 'Medical',
  family: 'Family / spouse',
};

export const estimateFees = (
  destination: string,
  category: VisaCategory,
  options?: { courier?: boolean; expedited?: boolean }
): ApplicationFees => {
  const key = (destination || '').trim().toLowerCase();
  const government = GOVERNMENT_FEES[key] ?? CATEGORY_BASE_FEE[category];
  const agency = category === 'work' ? 149 : category === 'student' ? 99 : 69;
  const embassy = category === 'transit' ? 0 : 32;
  let additional = options?.courier === false ? 0 : 25;
  if (options?.expedited) additional += 60;
  return { agency, government, embassy, additional, currency: 'USD' };
};

export const totalFees = (fees: ApplicationFees) =>
  fees.agency + fees.government + fees.embassy + fees.additional;

export const formatMoney = (value: number, currency = 'USD') =>
  value.toLocaleString('en-US', { style: 'currency', currency });

interface ChecklistItem {
  key: string;
  label: string;
  required: boolean;
}

const BASE_CHECKLIST: ChecklistItem[] = [
  { key: 'passport', label: 'Passport bio page', required: true },
  { key: 'photo', label: 'Passport-size photograph', required: true },
  { key: 'national_id', label: 'National ID', required: false },
];

const CATEGORY_CHECKLIST: Record<VisaCategory, ChecklistItem[]> = {
  tourist: [
    { key: 'bank_statement', label: 'Bank statements (last 6 months)', required: true },
    { key: 'employment', label: 'Employment / leave letter', required: true },
    { key: 'itinerary', label: 'Flight & hotel itinerary', required: true },
  ],
  business: [
    { key: 'bank_statement', label: 'Bank statements (last 6 months)', required: true },
    { key: 'employment', label: 'Employment letter / trade licence', required: true },
    { key: 'invitation', label: 'Business invitation letter', required: true },
    { key: 'company_docs', label: 'Company registration documents', required: false },
  ],
  work: [
    { key: 'employment', label: 'Employment contract / offer letter', required: true },
    { key: 'medical', label: 'Medical fitness certificate', required: true },
    { key: 'police_clearance', label: 'Police clearance certificate', required: true },
    { key: 'qualification', label: 'Educational / trade qualification', required: true },
  ],
  student: [
    { key: 'admission', label: 'University admission letter', required: true },
    { key: 'bank_statement', label: 'Financial sponsor statements', required: true },
    { key: 'qualification', label: 'Academic transcripts', required: true },
  ],
  transit: [{ key: 'itinerary', label: 'Onward flight ticket', required: true }],
  medical: [
    { key: 'medical', label: 'Treating hospital appointment letter', required: true },
    { key: 'bank_statement', label: 'Funds / insurance proof', required: true },
  ],
  family: [
    { key: 'invitation', label: 'Sponsor invitation letter', required: true },
    { key: 'relationship', label: 'Relationship certificate', required: true },
    { key: 'bank_statement', label: 'Sponsor financial documents', required: true },
  ],
};

export const buildChecklist = (category: VisaCategory): ChecklistItem[] => [
  ...BASE_CHECKLIST,
  ...CATEGORY_CHECKLIST[category],
];

export const emptyDocument = (item: ChecklistItem): PortalDocument => ({
  id: `doc-${item.key}-${Math.random().toString(36).slice(2, 7)}`,
  key: item.key,
  label: item.label,
  required: item.required,
  status: 'missing',
  history: [{ at: new Date().toISOString(), action: 'Requested' }],
});

export const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`;

export const nowIso = () => new Date().toISOString();

export const formatDate = (iso?: string) => {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDateTime = (iso?: string) => {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${formatDate(iso)} · ${date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

export const missingDocuments = (app: VisaApplication) =>
  app.documents.filter((doc) => doc.required && (doc.status === 'missing' || doc.status === 'rejected'));

export const feesPaid = (app: VisaApplication, paidTotal: number) =>
  Math.min(paidTotal, totalFees(app.fees));
