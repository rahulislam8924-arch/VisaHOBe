import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CardItem } from '../components/dashboard/AddCardModal';
import type { TransactionData } from '../components/dashboard/TransactionReceiptModal';
import { INITIAL_CARDS, INITIAL_TRANSACTIONS } from '../data/dashboardMockData';
import {
  buildChecklist,
  emptyDocument,
  estimateFees,
  newId,
  nowIso,
  totalFees,
  type ApplicantInfo,
  type ApplicationStatus,
  type PortalNotification,
  type PortalDocument,
  type ServiceRequest,
  type StatusSource,
  type SupportTicket,
  type VisaApplication,
  type VisaCategory,
} from './portalTypes';

/**
 * Client Portal state.
 *
 * Read-only development mode: this store is the single client's local
 * sandbox. It is namespaced by `clientId` so a second browser profile can
 * never read another client's records, and it performs no network calls —
 * no visa submission, payment, e-mail, SMS or WhatsApp traffic is produced.
 */
export const PORTAL_STORAGE_KEY = 'visahobe.portal.v2';
const LEGACY_KEY = 'visahobe.portal.v1';

export interface PortalProfile {
  clientId: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  gender: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  passportNumber: string;
  passportExpiry: string;
  passportIssueCountry: string;
  verificationStatus: 'unverified' | 'pending' | 'verified';
}

export interface PortalPreferences {
  statusAlerts: boolean;
  appointmentReminders: boolean;
  courierTracking: boolean;
  consularSync: boolean;
  egateTokenization: boolean;
  gmailSmartFeatures: boolean;
  channelEmail: boolean;
  channelSms: boolean;
  channelWhatsapp: boolean;
}

export interface PortalSession {
  startedAt: string;
  lastActiveAt: string;
  device: string;
}

export type RecordsSource = 'demo' | 'client';

export interface PortalState {
  version: 2;
  clientId: string;
  recordsSource: RecordsSource;
  profile: PortalProfile;
  preferences: PortalPreferences;
  session: PortalSession;
  cards: CardItem[];
  transactions: TransactionData[];
  applications: VisaApplication[];
  notifications: PortalNotification[];
  support: SupportTicket[];
  requests: ServiceRequest[];
  activity: { id: string; at: string; action: string; detail: string; applicationId?: string }[];
  updatedAt: string;
}

export const DEFAULT_PROFILE: PortalProfile = {
  clientId: 'client-vh-1001',
  fullName: 'Alexander Morgan',
  dateOfBirth: '1991-04-18',
  nationality: 'Bangladesh',
  gender: 'Male',
  email: 'alex.morgan@visahobe.com',
  phone: '+880 1700 000000',
  addressLine1: '399 4th Street, Apt 1204',
  city: 'San Francisco',
  region: 'CA',
  postalCode: '94107',
  country: 'United States',
  passportNumber: 'P9842104',
  passportExpiry: '2032-06-30',
  passportIssueCountry: 'Bangladesh',
  verificationStatus: 'verified',
};

export const DEFAULT_PREFERENCES: PortalPreferences = {
  statusAlerts: true,
  appointmentReminders: true,
  courierTracking: true,
  consularSync: true,
  egateTokenization: true,
  gmailSmartFeatures: true,
  channelEmail: true,
  channelSms: false,
  channelWhatsapp: false,
};

const maskSeedCards = (cards: CardItem[]): CardItem[] =>
  cards.map((card) => ({ ...card, cardNumber: `•••• ${card.lastFour}` }));

const isoDaysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

/* ------------------------------------------------------------------ */
/* Demo applications (synthetic test data — clearly flagged)          */
/* ------------------------------------------------------------------ */

const buildDemoApplication = (
  destination: string,
  category: VisaCategory,
  visaType: string,
  status: ApplicationStatus,
  daysAgo: number,
  options?: { missingDocs?: string[]; appointmentInDays?: number }
): VisaApplication => {
  const createdAt = isoDaysFromNow(-daysAgo);
  const fees = estimateFees(destination, category);
  const documents: PortalDocument[] = buildChecklist(category).map((item) => {
    const doc = emptyDocument(item);
    if (options?.missingDocs?.includes(item.key)) {
      return { ...doc, status: item.required ? 'missing' : 'missing' };
    }
    return {
      ...doc,
      status: 'verified',
      fileName: `${item.key}-${destination.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      fileType: 'application/pdf',
      fileSize: 240_000 + item.key.length * 12_000,
      uploadedAt: createdAt,
      verifiedAt: createdAt,
      history: [
        { at: createdAt, action: 'Requested' },
        { at: createdAt, action: 'Uploaded' },
        { at: createdAt, action: 'Preliminary AI check passed' },
      ],
    };
  });

  const timeline = [
    { at: createdAt, status: 'draft' as ApplicationStatus, source: 'ai' as StatusSource, note: 'Application started with the AI visa agent' },
    { at: createdAt, status: 'documents_required' as ApplicationStatus, source: 'ai' as StatusSource, note: 'Document checklist generated' },
    { at: createdAt, status: 'documents_under_review' as ApplicationStatus, source: 'ai' as StatusSource, note: 'Preliminary AI validation completed' },
    { at: createdAt, status, source: 'staff' as StatusSource, note: 'Simulated case-team update' },
  ];

  return {
    id: newId('VH'),
    clientId: DEFAULT_PROFILE.clientId,
    destination,
    visaCategory: category,
    visaType,
    status,
    applicant: {
      fullName: DEFAULT_PROFILE.fullName,
      dateOfBirth: DEFAULT_PROFILE.dateOfBirth,
      nationality: DEFAULT_PROFILE.nationality,
      gender: DEFAULT_PROFILE.gender,
      email: DEFAULT_PROFILE.email,
      phone: DEFAULT_PROFILE.phone,
      passportNumber: DEFAULT_PROFILE.passportNumber,
      passportExpiry: DEFAULT_PROFILE.passportExpiry,
      passportIssueCountry: DEFAULT_PROFILE.passportIssueCountry,
    },
    travel: {
      purpose: category === 'business' ? 'Business meetings' : 'Tourism',
      dateFrom: isoDaysFromNow(45).slice(0, 10),
      dateTo: isoDaysFromNow(60).slice(0, 10),
    },
    documents,
    fees,
    notes: '',
    createdAt,
    updatedAt: createdAt,
    timeline,
    approval:
      status === 'client_approval_required'
        ? { version: 1, status: 'pending', requestedAt: createdAt }
        : { version: 1, status: 'pending' },
    version: 1,
    submissionStatus: status === 'submitted' ? 'submitted_simulated' : 'not_submitted',
    corrections: [],
    aiProgress: {
      answersCollected: 8,
      answersTotal: 8,
      checklistReady: true,
      formPrepared: true,
      validationPassed: (options?.missingDocs?.length ?? 0) === 0,
    },
    appointment:
      options?.appointmentInDays !== undefined
        ? {
            date: isoDaysFromNow(options.appointmentInDays).slice(0, 10),
            time: '09:30',
            location: 'Visa Application Centre, Dhaka',
            status: 'scheduled',
          }
        : undefined,
    demo: true,
  };
};

const buildDemoApplications = (): VisaApplication[] => [
  buildDemoApplication('United States', 'tourist', 'B1/B2 visitor visa', 'client_approval_required', 12),
  buildDemoApplication('France', 'tourist', 'Schengen short-stay (Type C)', 'documents_required', 6, {
    missingDocs: ['bank_statement'],
  }),
  buildDemoApplication('United Kingdom', 'business', 'Standard visitor (business)', 'submitted', 26, {
    appointmentInDays: 9,
  }),
];

const buildDemoState = (): PortalState => {
  const applications = buildDemoApplications();
  const at = nowIso();
  return {
    version: 2,
    clientId: DEFAULT_PROFILE.clientId,
    recordsSource: 'demo',
    profile: DEFAULT_PROFILE,
    preferences: DEFAULT_PREFERENCES,
    session: { startedAt: at, lastActiveAt: at, device: 'This browser (preview)' },
    cards: maskSeedCards(INITIAL_CARDS),
    transactions: INITIAL_TRANSACTIONS,
    applications,
    notifications: [
      {
        id: newId('ntf'),
        kind: 'approval',
        title: 'Application preview ready for approval',
        body: `Your ${applications[0].destination} application is ready to review and approve.`,
        at,
        read: false,
        applicationId: applications[0].id,
      },
      {
        id: newId('ntf'),
        kind: 'document',
        title: 'Missing document',
        body: `Bank statements are still missing for your ${applications[1].destination} application.`,
        at,
        read: false,
        applicationId: applications[1].id,
      },
      {
        id: newId('ntf'),
        kind: 'appointment',
        title: 'Appointment reminder',
        body: 'Biometrics appointment at the Visa Application Centre, Dhaka.',
        at,
        read: true,
        applicationId: applications[2].id,
      },
    ],
    support: [],
    requests: [],
    activity: [
      {
        id: newId('act'),
        at,
        action: 'Application created',
        detail: `${applications[0].destination} · ${applications[0].visaType}`,
        applicationId: applications[0].id,
      },
      {
        id: newId('act'),
        at,
        action: 'Documents uploaded',
        detail: 'Passport bio page verified by the preliminary AI check',
        applicationId: applications[1].id,
      },
    ],
    updatedAt: at,
  };
};

const emptyState = (): PortalState => {
  const at = nowIso();
  const demo = buildDemoState();
  return {
    ...demo,
    recordsSource: 'client',
    cards: [],
    transactions: [],
    applications: [],
    notifications: [],
    activity: [],
    support: [],
    requests: [],
    updatedAt: at,
  };
};

/* ------------------------------------------------------------------ */
/* Persistence                                                        */
/* ------------------------------------------------------------------ */

export const loadPortalState = (): PortalState => {
  const fallback = buildDemoState();
  if (typeof window === 'undefined' || !window.localStorage) return fallback;

  try {
    const raw = window.localStorage.getItem(PORTAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PortalState>;
      return {
        ...fallback,
        ...parsed,
        version: 2,
        clientId: parsed.clientId ?? fallback.clientId,
        profile: { ...DEFAULT_PROFILE, ...(parsed.profile ?? {}) },
        preferences: { ...DEFAULT_PREFERENCES, ...(parsed.preferences ?? {}) },
        session: {
          ...fallback.session,
          ...(parsed.session ?? {}),
          lastActiveAt: nowIso(),
        },
        applications: Array.isArray(parsed.applications) ? parsed.applications : [],
        notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
        support: Array.isArray(parsed.support) ? parsed.support : [],
        requests: Array.isArray(parsed.requests) ? parsed.requests : [],
        activity: Array.isArray(parsed.activity) ? parsed.activity : [],
        cards: Array.isArray(parsed.cards) ? maskSeedCards(parsed.cards) : [],
        transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
      };
    }

    // One-time migration of the v1 portal file (keeps client-entered data)
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const old = JSON.parse(legacy) as Record<string, unknown>;
      const migrated = buildDemoState();
      if (Array.isArray(old.cards) && old.cards.length) {
        migrated.cards = maskSeedCards(old.cards as CardItem[]);
      }
      if (Array.isArray(old.transactions) && old.transactions.length) {
        migrated.transactions = old.transactions as TransactionData[];
      }
      if (old.profile) {
        const legacyProfile = old.profile as Partial<PortalProfile> & { name?: string };
        migrated.profile = {
          ...migrated.profile,
          ...legacyProfile,
          fullName: legacyProfile.fullName ?? legacyProfile.name ?? migrated.profile.fullName,
        };
      }
      return migrated;
    }
    return fallback;
  } catch {
    return fallback;
  }
};

const persist = (state: PortalState) => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(PORTAL_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota exceeded — the session keeps working in memory */
  }
};

/* ------------------------------------------------------------------ */
/* Hook + actions                                                     */
/* ------------------------------------------------------------------ */

export interface NewApplicationInput {
  destination: string;
  visaCategory: VisaCategory;
  visaType: string;
  applicant: ApplicantInfo;
  travel: { purpose: string; dateFrom: string; dateTo: string };
  notes?: string;
  expedited?: boolean;
}

export interface PortalActions {
  // cards
  addCard: (card: CardItem) => void;
  setDefaultCard: (id: string) => void;
  removeCard: (id: string) => void;
  renameCard: (id: string, nickname: string) => void;
  // profile
  updateProfile: (patch: Partial<PortalProfile>) => void;
  updatePreference: (key: keyof PortalPreferences, value: boolean) => void;
  changePasswordPreview: () => void;
  // applications
  createApplication: (input: NewApplicationInput) => VisaApplication;
  updateApplication: (id: string, patch: Partial<VisaApplication>) => void;
  setStatus: (id: string, status: ApplicationStatus, source: StatusSource, note: string) => void;
  uploadDocument: (
    applicationId: string,
    documentId: string,
    file: { name: string; type: string; size: number }
  ) => void;
  verifyDocument: (applicationId: string, documentId: string, decision: 'verified' | 'rejected', reason?: string) => void;
  requestCorrection: (applicationId: string, message: string) => void;
  approvePreview: (applicationId: string) => void;
  requestCancellation: (applicationId: string, reason: string) => void;
  requestAppointmentChange: (applicationId: string, kind: 'reschedule' | 'cancel') => void;
  // notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Omit<PortalNotification, 'id' | 'at' | 'read'>) => void;
  // support
  createSupportTicket: (subject: string, message: string, applicationId?: string) => SupportTicket;
  replySupportTicket: (ticketId: string, text: string) => void;
  closeSupportTicket: (ticketId: string) => void;
  // data controls
  resetPortalData: () => void;
  clearPortalRecords: () => void;
  dismissDemoRecords: () => void;
}

export const usePortalState = () => {
  const [state, setState] = useState<PortalState>(loadPortalState);

  useEffect(() => {
    persist(state);
  }, [state]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === PORTAL_STORAGE_KEY && event.newValue) {
        setState(loadPortalState());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = useCallback(
    (recipe: (prev: PortalState) => PortalState) => {
      setState((prev) => ({
        ...recipe(prev),
        updatedAt: nowIso(),
        session: { ...prev.session, lastActiveAt: nowIso() },
      }));
    },
    []
  );

  const pushActivity = (
    prev: PortalState,
    action: string,
    detail: string,
    applicationId?: string
  ) => [
    { id: newId('act'), at: nowIso(), action, detail, applicationId },
    ...prev.activity,
  ].slice(0, 60);

  const pushNotification = (
    prev: PortalState,
    notification: Omit<PortalNotification, 'id' | 'at' | 'read'>
  ): PortalNotification[] =>
    [
      { ...notification, id: newId('ntf'), at: nowIso(), read: false },
      ...prev.notifications,
    ].slice(0, 60);

  const patchApplication = (
    prev: PortalState,
    id: string,
    recipe: (app: VisaApplication) => VisaApplication
  ) => ({
    ...prev,
    applications: prev.applications.map((app) =>
      app.id === id ? { ...recipe(app), updatedAt: nowIso(), clientId: prev.clientId } : app
    ),
  });

  const actions: PortalActions = {
    addCard: (card) =>
      update((prev) => ({
        ...prev,
        recordsSource: 'client',
        cards: card.isDefault
          ? [card, ...prev.cards.map((c) => ({ ...c, isDefault: false }))]
          : [...prev.cards, card],
        activity: pushActivity(prev, 'Payment card added', `${card.network} •••• ${card.lastFour}`),
      })),

    setDefaultCard: (id) =>
      update((prev) => ({
        ...prev,
        cards: prev.cards.map((c) => ({ ...c, isDefault: c.id === id })),
        activity: pushActivity(prev, 'Default card changed', 'Used for the next consular fee'),
      })),

    removeCard: (id) =>
      update((prev) => {
        const card = prev.cards.find((c) => c.id === id);
        return {
          ...prev,
          cards: prev.cards.filter((c) => c.id !== id),
          activity: pushActivity(
            prev,
            'Payment card removed',
            card ? `${card.network} •••• ${card.lastFour}` : 'Card removed'
          ),
        };
      }),

    renameCard: (id, nickname) =>
      update((prev) => ({
        ...prev,
        cards: prev.cards.map((c) =>
          c.id === id ? { ...c, nickname: nickname.trim() || c.nickname } : c
        ),
      })),

    updateProfile: (patch) =>
      update((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...patch },
        activity: pushActivity(prev, 'Profile updated', Object.keys(patch).join(', ')),
      })),

    updatePreference: (key, value) =>
      update((prev) => ({
        ...prev,
        preferences: { ...prev.preferences, [key]: value },
      })),

    changePasswordPreview: () =>
      update((prev) => ({
        ...prev,
        activity: pushActivity(
          prev,
          'Password change requested',
          'Preview only — identity provider not connected'
        ),
        notifications: pushNotification(prev, {
          kind: 'system',
          title: 'Password change preview',
          body: 'In preview mode the password is not changed. Connect the identity provider to enable this.',
        }),
      })),

    createApplication: (input) => {
      const fees = estimateFees(input.destination, input.visaCategory, {
        expedited: input.expedited,
      });
      const at = nowIso();
      const app: VisaApplication = {
        id: newId('VH'),
        clientId: state.clientId,
        destination: input.destination,
        visaCategory: input.visaCategory,
        visaType: input.visaType,
        status: 'documents_required',
        applicant: input.applicant,
        travel: input.travel,
        documents: buildChecklist(input.visaCategory).map(emptyDocument),
        fees,
        notes: input.notes ?? '',
        createdAt: at,
        updatedAt: at,
        timeline: [
          { at, status: 'draft', source: 'ai', note: 'Application started with the AI visa agent' },
          { at, status: 'documents_required', source: 'ai', note: 'Document checklist generated' },
        ],
        approval: { version: 1, status: 'pending' },
        version: 1,
        submissionStatus: 'not_submitted',
        corrections: [],
        aiProgress: {
          answersCollected: 8,
          answersTotal: 8,
          checklistReady: true,
          formPrepared: false,
          validationPassed: false,
        },
      };
      update((prev) => ({
        ...prev,
        recordsSource: 'client',
        applications: [app, ...prev.applications],
        activity: pushActivity(
          prev,
          'Application created',
          `${app.destination} · ${app.visaType}`,
          app.id
        ),
        notifications: pushNotification(prev, {
          kind: 'application',
          title: 'Application draft created',
          body: `${app.destination} · ${app.visaType}. Upload the checklist documents to continue.`,
          applicationId: app.id,
        }),
      }));
      return app;
    },

    updateApplication: (id, patch) =>
      update((prev) => ({
        ...prev,
        applications: prev.applications.map((app) =>
          app.id === id ? { ...app, ...patch, updatedAt: nowIso(), version: app.version + 1 } : app
        ),
      })),

    setStatus: (id, status, source, note) =>
      update((prev) => ({
        ...patchApplication(prev, id, (app) => ({
          ...app,
          status,
          timeline: [...app.timeline, { at: nowIso(), status, source, note }],
        })),
        activity: pushActivity(prev, 'Status updated', note, id),
      })),

    uploadDocument: (applicationId, documentId, file) =>
      update((prev) => ({
        ...patchApplication(prev, applicationId, (app) => ({
          ...app,
          documents: app.documents.map((doc) =>
            doc.id === documentId
              ? {
                  ...doc,
                  status: 'under_review',
                  fileName: file.name,
                  fileType: file.type || 'unknown',
                  fileSize: file.size,
                  uploadedAt: nowIso(),
                  rejectionReason: undefined,
                  history: [
                    ...doc.history,
                    { at: nowIso(), action: 'Uploaded', note: file.name },
                  ],
                }
              : doc
          ),
        })),
        activity: pushActivity(prev, 'Document uploaded', file.name, applicationId),
      })),

    verifyDocument: (applicationId, documentId, decision, reason) =>
      update((prev) => ({
        ...patchApplication(prev, applicationId, (app) => ({
          ...app,
          documents: app.documents.map((doc) =>
            doc.id === documentId
              ? {
                  ...doc,
                  status: decision,
                  verifiedAt: decision === 'verified' ? nowIso() : undefined,
                  rejectionReason: decision === 'rejected' ? reason || 'Rejected by preliminary check' : undefined,
                  history: [
                    ...doc.history,
                    {
                      at: nowIso(),
                      action: decision === 'verified' ? 'Verified (preliminary)' : 'Rejected (preliminary)',
                      note: reason,
                    },
                  ],
                }
              : doc
          ),
        })),
        activity: pushActivity(
          prev,
          decision === 'verified' ? 'Document verified' : 'Document rejected',
          reason || 'Preliminary AI check',
          applicationId
        ),
      })),

    requestCorrection: (applicationId, message) =>
      update((prev) => ({
        ...patchApplication(prev, applicationId, (app) => ({
          ...app,
          status: 'internal_review',
          corrections: [
            ...app.corrections,
            { at: nowIso(), message, status: 'open' as const },
          ],
          timeline: [
            ...app.timeline,
            {
              at: nowIso(),
              status: 'internal_review' as ApplicationStatus,
              source: 'staff' as StatusSource,
              note: `Correction requested: ${message}`,
            },
          ],
        })),
        activity: pushActivity(prev, 'Correction requested', message, applicationId),
        notifications: pushNotification(prev, {
          kind: 'application',
          title: 'Correction requested',
          body: message,
          applicationId,
        }),
      })),

    approvePreview: (applicationId) =>
      update((prev) => {
        const app = prev.applications.find((item) => item.id === applicationId);
        if (!app) return prev;
        const summary = `${app.destination} · ${app.visaType} · v${app.version} · ${app.applicant.fullName}`;
        return {
          ...patchApplication(prev, applicationId, (current) => ({
            ...current,
            status: 'client_approved',
            approval: {
              version: current.version,
              status: 'approved',
              approvedAt: nowIso(),
              requestedAt: current.approval.requestedAt,
              summary,
            },
            timeline: [
              ...current.timeline,
              {
                at: nowIso(),
                status: 'client_approved',
                source: 'staff',
                note: `Client approved preview v${current.version} (preview only — nothing submitted)`,
              },
            ],
          })),
          activity: pushActivity(prev, 'Preview approved', summary, applicationId),
          notifications: pushNotification(prev, {
            kind: 'approval',
            title: 'Preview approved',
            body: `${app.destination} application v${app.version} approved by you. An authorised officer must still submit it.`,
            applicationId,
          }),
        };
      }),

    requestCancellation: (applicationId, reason) =>
      update((prev) => ({
        ...patchApplication(prev, applicationId, (app) => ({
          ...app,
          status: 'cancelled',
          cancellationRequest: { at: nowIso(), reason, status: 'requested' },
          timeline: [
            ...app.timeline,
            {
              at: nowIso(),
              status: 'cancelled',
              source: 'staff',
              note: `Cancellation requested: ${reason}`,
            },
          ],
        })),
        requests: [
          {
            id: newId('req'),
            type: 'cancellation',
            applicationId,
            at: nowIso(),
            note: reason,
            status: 'requested',
          },
          ...prev.requests,
        ],
        activity: pushActivity(prev, 'Cancellation requested', reason, applicationId),
      })),

    requestAppointmentChange: (applicationId, kind) =>
      update((prev) => ({
        ...patchApplication(prev, applicationId, (app) => ({
          ...app,
          appointment: app.appointment
            ? {
                ...app.appointment,
                status: kind === 'reschedule' ? 'reschedule_requested' : 'cancel_requested',
              }
            : app.appointment,
          timeline: [
            ...app.timeline,
            {
              at: nowIso(),
              status: app.status,
              source: 'staff',
              note:
                kind === 'reschedule'
                  ? 'Appointment reschedule requested (preview — no message sent)'
                  : 'Appointment cancellation requested (preview — no message sent)',
            },
          ],
        })),
        requests: [
          {
            id: newId('req'),
            type: kind === 'reschedule' ? 'appointment_reschedule' : 'appointment_cancel',
            applicationId,
            at: nowIso(),
            note: 'Requested from the client portal (preview)',
            status: 'requested',
          },
          ...prev.requests,
        ],
        activity: pushActivity(
          prev,
          kind === 'reschedule' ? 'Reschedule requested' : 'Appointment cancellation requested',
          'Preview only — no external message sent',
          applicationId
        ),
      })),

    markNotificationRead: (id) =>
      update((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      })),

    markAllNotificationsRead: () =>
      update((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) => ({ ...n, read: true })),
      })),

    addNotification: (notification) =>
      update((prev) => ({ ...prev, notifications: pushNotification(prev, notification) })),

    createSupportTicket: (subject, message, applicationId) => {
      const at = nowIso();
      const ticket: SupportTicket = {
        id: newId('SUP'),
        subject,
        status: 'open',
        createdAt: at,
        updatedAt: at,
        applicationId,
        messages: [
          { id: newId('msg'), from: 'client', text: message, at },
          {
            id: newId('msg'),
            from: 'support',
            text:
              'Thank you — your request is queued for the VisaHOBe case team. This is a simulated acknowledgement: in preview mode no e-mail, SMS or WhatsApp message is sent.',
            at,
          },
        ],
      };
      update((prev) => ({
        ...prev,
        support: [ticket, ...prev.support],
        activity: pushActivity(prev, 'Support request created', subject, applicationId),
        notifications: pushNotification(prev, {
          kind: 'support',
          title: 'Support request created',
          body: `${ticket.id} · ${subject}. A case officer will reply here — no external message is sent.`,
          applicationId,
        }),
      }));
      return ticket;
    },

    replySupportTicket: (ticketId, text) =>
      update((prev) => ({
        ...prev,
        support: prev.support.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                status: 'open',
                updatedAt: nowIso(),
                messages: [
                  ...ticket.messages,
                  { id: newId('msg'), from: 'client', text, at: nowIso() },
                ],
              }
            : ticket
        ),
        activity: pushActivity(prev, 'Support reply sent', text.slice(0, 60)),
      })),

    closeSupportTicket: (ticketId) =>
      update((prev) => ({
        ...prev,
        support: prev.support.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, status: 'closed', updatedAt: nowIso() }
            : ticket
        ),
      })),

    resetPortalData: () => setState(buildDemoState()),

    clearPortalRecords: () => setState(emptyState()),

    dismissDemoRecords: () =>
      update((prev) => ({
        ...prev,
        recordsSource: 'client',
        applications: prev.applications.filter((app) => !app.demo),
      })),
  };

  return { state, actions };
};

/* ------------------------------------------------------------------ */
/* Derived helpers used across the portal                             */
/* ------------------------------------------------------------------ */

export const usePortalDerived = (state: PortalState) =>
  useMemo(() => {
    const unread = state.notifications.filter((n) => !n.read).length;
    const totalEstimated = state.applications.reduce((sum, app) => sum + totalFees(app.fees), 0);
    const paid = state.transactions
      .filter((tx) => tx.status !== 'Declined')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const outstanding = Math.max(0, totalEstimated - paid);
    return { unread, totalEstimated, paid, outstanding };
  }, [state]);
