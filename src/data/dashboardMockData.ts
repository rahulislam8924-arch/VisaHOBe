import { CardItem } from '../components/dashboard/AddCardModal';
import { TransactionData } from '../components/dashboard/TransactionReceiptModal';

/** Formats a date a given number of days in the past, so the demo portal never looks stale. */
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

export const INITIAL_CARDS: CardItem[] = [
  {
    id: 'card-visa-infinite',
    cardholderName: 'ALEXANDER MORGAN',
    cardNumber: '4242424242424242',
    network: 'Visa',
    lastFour: '4242',
    expMonth: '11',
    expYear: '28',
    nickname: 'Visa Infinite Consular Card',
    isDefault: true,
    bgGradient: 'from-blue-900 via-indigo-950 to-blue-950',
  },
  {
    id: 'card-amex',
    cardholderName: 'ALEXANDER MORGAN',
    cardNumber: '378282246311008',
    network: 'Amex',
    lastFour: '1008',
    expMonth: '08',
    expYear: '29',
    nickname: 'American Express Platinum Travel',
    isDefault: false,
    bgGradient: 'from-slate-700 via-neutral-800 to-zinc-900',
  },
  {
    id: 'card-capone',
    cardholderName: 'ALEXANDER MORGAN',
    cardNumber: '5500000000008812',
    network: 'Mastercard',
    lastFour: '8812',
    expMonth: '04',
    expYear: '27',
    nickname: 'Capital One Global Venture',
    isDefault: false,
    bgGradient: 'from-zinc-900 via-stone-800 to-neutral-900',
  },
];

export const INITIAL_TRANSACTIONS: TransactionData[] = [
  {
    id: 'tx-1',
    merchant: 'U.S. Department of State',
    amount: -185.0,
    date: 'Yesterday',
    time: '4:15 PM',
    cardName: 'Visa Infinite',
    lastFour: '4242',
    category: 'Consular Visa Fee',
    status: 'Completed',
    type: 'Online purchase',
    location: 'Consular Electronic Application Center (CEAC)',
    deviceAccountNumber: '9421',
    items: [
      { name: 'DS-160 Nonimmigrant Visa Application Fee (MRV)', qty: 1, price: 185.0 },
    ],
  },
  {
    id: 'tx-2',
    merchant: 'VFS Global Services Dhaka',
    amount: -68.5,
    date: daysAgo(7),
    time: '8:42 AM',
    cardName: 'Visa Infinite',
    lastFour: '4242',
    category: 'Biometrics & Processing',
    status: 'Completed',
    type: 'Contactless',
    location: 'Visa Application Center, Dhaka',
    deviceAccountNumber: '3819',
    items: [
      { name: 'Biometric Enrollment & Identity Capture', qty: 1, price: 38.5 },
      { name: 'Secure Passport Courier Return Service', qty: 1, price: 20.0 },
      { name: 'SMS Live Application Tracking Alerts', qty: 1, price: 10.0 },
    ],
  },
  {
    id: 'tx-3',
    merchant: 'Consulat Général de France',
    amount: -88.0,
    date: daysAgo(13),
    time: '11:20 AM',
    cardName: 'American Express',
    lastFour: '1008',
    category: 'Schengen Visa Fee',
    status: 'Completed',
    type: 'Online purchase',
    deviceAccountNumber: '9421',
    items: [
      { name: 'Schengen Short-Stay Visa Fee (Type C - €80.00)', qty: 1, price: 88.0 },
    ],
  },
  {
    id: 'tx-4',
    merchant: 'UK Visas and Immigration',
    amount: -360.0,
    date: daysAgo(20),
    time: '6:30 PM',
    cardName: 'Visa Infinite',
    lastFour: '4242',
    category: 'Immigration & Surcharge',
    status: 'Completed',
    type: 'Online purchase',
    location: 'Gov.uk Visa Portal',
    deviceAccountNumber: '3819',
    items: [
      { name: 'Standard Visitor Visa 6-Month Fee', qty: 1, price: 145.0 },
      { name: 'Priority Expedited Visa Processing Service', qty: 1, price: 215.0 },
    ],
  },
  {
    id: 'tx-5',
    merchant: 'Saudi Ministry of Foreign Affairs (MOFA)',
    amount: -35.0,
    date: daysAgo(27),
    time: '3:20 PM',
    cardName: 'Visa Infinite',
    lastFour: '4242',
    category: 'Work Visa Stamping',
    status: 'Completed',
    type: 'Online purchase',
    location: 'Enjaz MOFA Visa Gateway',
    items: [
      { name: 'Work Visa Application Processing Fee (Enjaz)', qty: 1, price: 35.0 },
    ],
  },
  {
    id: 'tx-6',
    merchant: 'FedEx Diplomatic Courier',
    amount: -24.5,
    date: daysAgo(34),
    time: '9:15 PM',
    cardName: 'American Express',
    lastFour: '1008',
    category: 'Passport Delivery',
    status: 'Completed',
    type: 'In-app',
    deviceAccountNumber: '9421',
    items: [
      { name: 'Tamper-Evident Passport Return Priority Courier', qty: 1, price: 24.5 },
    ],
  },
];
