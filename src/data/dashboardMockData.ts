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

export interface DashboardPassItem {
  id: string;
  category: 'boarding' | 'loyalty' | 'ticket' | 'offer';
  title: string;
  issuer: string;
  codeType: 'barcode' | 'qrcode';
  codeValue: string;
  seatOrNumber?: string;
  expiryDate?: string;
  bgColor: string;
  textColor: string;
  icon: string;
  badge?: string;
  extraDetails: { label: string; value: string }[];
}

export const INITIAL_PASSES: DashboardPassItem[] = [
  {
    id: 'pass-us-visa',
    category: 'boarding',
    title: 'United States B1/B2 Visa',
    issuer: 'U.S. Embassy Consular Section',
    codeType: 'qrcode',
    codeValue: 'USA-B1B2-V94820194-MORGAN/ALEXANDER-20341014-MULT',
    seatOrNumber: 'Class B1/B2 • 10-Year Multiple Entry',
    expiryDate: 'Valid until: Oct 14, 2034',
    bgColor: 'from-blue-900 to-indigo-950',
    textColor: 'text-white',
    icon: 'verified',
    badge: 'Approved e-Visa',
    extraDetails: [
      { label: 'Visa Holder', value: 'Alexander Morgan' },
      { label: 'Visa Foil #', value: 'V94820194' },
      { label: 'Visa Class', value: 'B1/B2 (Business & Tourism)' },
      { label: 'Issuing Post', value: 'U.S. Embassy Dhaka' },
      { label: 'Entries', value: 'Multiple (M)' },
      { label: 'Control Number', value: '20241014-992014' },
    ],
  },
  {
    id: 'pass-schengen-visa',
    category: 'loyalty',
    title: 'Schengen Multiple Entry Visa',
    issuer: 'Consulat Général de France',
    codeType: 'barcode',
    codeValue: 'FRA 0928410294 1192',
    seatOrNumber: 'Type C • 90 Days per 180 Days',
    expiryDate: 'Valid until: Dec 31, 2028',
    bgColor: 'from-sky-800 to-blue-950',
    textColor: 'text-white',
    icon: 'flight_takeoff',
    badge: 'Schengen States',
    extraDetails: [
      { label: 'Applicant', value: 'Alexander Morgan' },
      { label: 'Type of Visa', value: 'Uniform Schengen Visa (Type C)' },
      { label: 'Territorial Validity', value: 'Schengen States' },
      { label: 'Duration of Stay', value: '90 Days' },
      { label: 'Passport Number', value: 'P9842104' },
    ],
  },
  {
    id: 'pass-interview-slip',
    category: 'ticket',
    title: 'Consular Interview & Biometrics',
    issuer: 'Embassy Consular Services',
    codeType: 'qrcode',
    codeValue: 'DS160-APPT-20241108-0930-SLIP-A402',
    seatOrNumber: 'Interview: 09:30 AM • Counter 14',
    expiryDate: 'Feb 09, 2027 • Security Clear',
    bgColor: 'from-purple-900 to-neutral-950',
    textColor: 'text-white',
    icon: 'confirmation_number',
    badge: 'DS-160 Pass',
    extraDetails: [
      { label: 'Applicant Name', value: 'Alexander Morgan' },
      { label: 'Appointment Date', value: 'Tuesday, February 09, 2027' },
      { label: 'Appointment Time', value: '09:30 AM (Arrive 15m early)' },
      { label: 'DS-160 Barcode', value: 'AA00C9X2LM' },
      { label: 'Location', value: 'Embassy Consular Annex' },
      { label: 'Biometrics Status', value: 'Pre-enrolled' },
    ],
  },
  {
    id: 'pass-saudi-work-visa',
    category: 'boarding',
    title: 'Saudi Arabia Skilled Worker Visa',
    issuer: 'Ministry of Foreign Affairs (MOFA)',
    codeType: 'qrcode',
    codeValue: 'KSA-WORK-QIWA-849201948-ELEC-TECH-2025',
    seatOrNumber: 'Contract #98402194 • Electrician Tech',
    expiryDate: 'Verified on Qiwa / Muqeem',
    bgColor: 'from-emerald-900 to-teal-950',
    textColor: 'text-white',
    icon: 'engineering',
    badge: 'Qiwa Verified',
    extraDetails: [
      { label: 'Worker Name', value: 'Alexander Morgan' },
      { label: 'Occupation', value: 'Electrical Technician (Skilled)' },
      { label: 'Platform Verification', value: 'Qiwa Portal Verified' },
      { label: 'Visa Authorization #', value: '139480194' },
      { label: 'Medical Status', value: 'GAMCA Fit Verified' },
      { label: 'Licensed Partner', value: 'RL-Approved Partner Agency' },
    ],
  },
  {
    id: 'pass-uk-evisa',
    category: 'offer',
    title: 'UK Standard Visitor e-Visa',
    issuer: 'UK Visas & Immigration (UKVI)',
    codeType: 'barcode',
    codeValue: 'UKVI 9840 2194 0021 3492',
    seatOrNumber: 'Home Office Digital Status • 6 Months',
    expiryDate: 'Valid until: May 15, 2027',
    bgColor: 'from-red-900 to-slate-950',
    textColor: 'text-white',
    icon: 'badge',
    badge: 'UKVI Active',
    extraDetails: [
      { label: 'Digital Status #', value: 'UKVI-784019-AM' },
      { label: 'Visa Category', value: 'Standard Visitor' },
      { label: 'Work Restrictions', value: 'No work or recourse to public funds' },
      { label: 'Share Code', value: 'W94 821 K90' },
    ],
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
