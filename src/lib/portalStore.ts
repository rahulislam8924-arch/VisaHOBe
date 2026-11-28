import { useCallback, useEffect, useState } from 'react';
import type { CardItem } from '../components/dashboard/AddCardModal';
import type { TransactionData } from '../components/dashboard/TransactionReceiptModal';
import type { DashboardPassItem } from '../data/dashboardMockData';
import {
  INITIAL_CARDS,
  INITIAL_PASSES,
  INITIAL_TRANSACTIONS,
} from '../data/dashboardMockData';

/**
 * Persisted client-portal state.
 *
 * The portal has no backend (and no sign-in by design for now), so every change
 * a client makes — cards, notification preferences, profile details — is stored
 * in localStorage under one versioned key and restored on the next visit.
 */
export const PORTAL_STORAGE_KEY = 'visahobe.portal.v1';

export interface PortalProfile {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface PortalPreferences {
  statusAlerts: boolean;
  appointmentReminders: boolean;
  courierTracking: boolean;
  consularSync: boolean;
  egateTokenization: boolean;
  gmailSmartFeatures: boolean;
}

export type RecordsSource = 'demo' | 'client';

export interface PortalState {
  version: 1;
  /** 'demo' while the seeded sample records are still untouched */
  recordsSource: RecordsSource;
  cards: CardItem[];
  passes: DashboardPassItem[];
  transactions: TransactionData[];
  profile: PortalProfile;
  preferences: PortalPreferences;
  updatedAt: string;
}

export const DEFAULT_PROFILE: PortalProfile = {
  name: 'Alexander Morgan',
  email: 'alex.morgan@visahobe.com',
  phone: '+880 1700 000000',
  addressLine1: '399 4th Street, Apt 1204',
  city: 'San Francisco',
  region: 'CA',
  postalCode: '94107',
  country: 'United States',
};

export const DEFAULT_PREFERENCES: PortalPreferences = {
  statusAlerts: true,
  appointmentReminders: true,
  courierTracking: true,
  consularSync: true,
  egateTokenization: true,
  gmailSmartFeatures: true,
};

/** Seed cards keep only their last four digits — a full PAN is never written to storage */
const maskSeedCards = (cards: CardItem[]): CardItem[] =>
  cards.map((card) => ({ ...card, cardNumber: `•••• ${card.lastFour}` }));

const defaultState = (): PortalState => ({
  version: 1,
  recordsSource: 'demo',
  cards: maskSeedCards(INITIAL_CARDS),
  passes: INITIAL_PASSES,
  transactions: INITIAL_TRANSACTIONS,
  profile: DEFAULT_PROFILE,
  preferences: DEFAULT_PREFERENCES,
  updatedAt: new Date().toISOString(),
});

/** Reads the saved portal state, repairing anything missing or malformed. */
export const loadPortalState = (): PortalState => {
  const fallback = defaultState();
  if (typeof window === 'undefined' || !window.localStorage) return fallback;

  try {
    const raw = window.localStorage.getItem(PORTAL_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<PortalState>;
    return {
      version: 1,
      recordsSource: parsed.recordsSource === 'client' ? 'client' : 'demo',
      cards: Array.isArray(parsed.cards) ? maskSeedCards(parsed.cards) : fallback.cards,
      passes: Array.isArray(parsed.passes) && parsed.passes.length ? parsed.passes : fallback.passes,
      transactions: Array.isArray(parsed.transactions) && parsed.transactions.length
        ? parsed.transactions
        : fallback.transactions,
      profile: { ...DEFAULT_PROFILE, ...(parsed.profile ?? {}) },
      preferences: { ...DEFAULT_PREFERENCES, ...(parsed.preferences ?? {}) },
      updatedAt: parsed.updatedAt ?? fallback.updatedAt,
    };
  } catch {
    return fallback;
  }
};

const persist = (state: PortalState) => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(PORTAL_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked — the session keeps working in memory */
  }
};

export interface PortalActions {
  addCard: (card: CardItem) => void;
  setDefaultCard: (id: string) => void;
  removeCard: (id: string) => void;
  renameCard: (id: string, nickname: string) => void;
  updateProfile: (patch: Partial<PortalProfile>) => void;
  updatePreference: (key: keyof PortalPreferences, value: boolean) => void;
  resetPortalData: () => void;
  clearPortalRecords: () => void;
  dismissDemoRecords: () => void;
}

export const usePortalState = () => {
  const [state, setState] = useState<PortalState>(loadPortalState);

  // Persist every change
  useEffect(() => {
    persist(state);
  }, [state]);

  // Keep tabs in sync (e.g. portal open twice)
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === PORTAL_STORAGE_KEY && event.newValue) {
        setState(loadPortalState());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = useCallback((recipe: (prev: PortalState) => PortalState) => {
    setState((prev) => ({ ...recipe(prev), updatedAt: new Date().toISOString() }));
  }, []);

  const actions: PortalActions = {
    addCard: (card) =>
      update((prev) => ({
        ...prev,
        recordsSource: 'client',
        cards: card.isDefault
          ? [card, ...prev.cards.map((c) => ({ ...c, isDefault: false }))]
          : [...prev.cards, card],
      })),

    setDefaultCard: (id) =>
      update((prev) => ({
        ...prev,
        cards: prev.cards.map((c) => ({ ...c, isDefault: c.id === id })),
      })),

    removeCard: (id) =>
      update((prev) => ({
        ...prev,
        cards: prev.cards.filter((c) => c.id !== id),
      })),

    renameCard: (id, nickname) =>
      update((prev) => ({
        ...prev,
        cards: prev.cards.map((c) =>
          c.id === id ? { ...c, nickname: nickname.trim() || c.nickname } : c
        ),
      })),

    dismissDemoRecords: () =>
      update((prev) => ({ ...prev, recordsSource: 'client' })),

    updateProfile: (patch) =>
      update((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } })),

    updatePreference: (key, value) =>
      update((prev) => ({
        ...prev,
        preferences: { ...prev.preferences, [key]: value },
      })),

    resetPortalData: () => setState(defaultState()),

    // Start from an empty account: keeps the profile and saved preferences
    clearPortalRecords: () =>
      update((prev) => ({
        ...prev,
        recordsSource: 'client',
        cards: [],
        passes: [],
        transactions: [],
      })),
  };

  return { state, actions };
};
