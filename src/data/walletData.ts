import { JumplinkItem, FeatureSectionData, FAQItem, WalletCard } from '../types';

export const JUMPLINKS: JumplinkItem[] = [
  { id: 'payments', name: 'Visa Consultation & Fees', ariaLabel: 'Visa Consultation & Fees - Jump to section' },
  { id: 'receipts', name: 'Application Tracking', ariaLabel: 'Application Tracking - Jump to section' },
  { id: 'travel', name: 'Global E-Visas', ariaLabel: 'Global E-Visas - Jump to section' },
  { id: 'loyalty', name: 'Work & Employment Info', ariaLabel: 'Work & Employment Info - Jump to section' },
  { id: 'tickets', name: 'Embassy Passes', ariaLabel: 'Embassy Passes - Jump to section' },
  { id: 'identity', name: 'Biometric Travel ID', ariaLabel: 'Biometric Travel ID - Jump to section' },
  { id: 'keys', name: 'e-Gate Clearance', ariaLabel: 'e-Gate Clearance - Jump to section' },
  { id: 'security', name: 'Compliance & Security', ariaLabel: 'Compliance & Security - Jump to section' },
];

export const FEATURE_SECTIONS: FeatureSectionData[] = [
  {
    id: 'payments',
    category: 'VISA CONSULTATION & EMBASSY FEES',
    inlineIcon: 'verified',
    iconColor: '#1a73e8',
    titlePrefix: 'M',
    titleSuffix: 're transparent visa guidance & fee payments',
    description:
      'VisaHOBe helps you understand official visa requirements, prepare verified document checklists, and securely settle consular fees across authorized bank channels. Settle DS-160 MRV fees, Schengen visa charges, and embassy appointment payments with itemized receipts and zero hidden charges.',
    ctaText: 'Explore visa consultation & fee guidance',
    ctaUrl: '#services',
    isExternalCta: false,
    footnote: 'Embassy & government fees are non-refundable and paid directly to official mission gateways. Final visa decisions are made solely by the respective consular authorities.',
    lottieUrl:
      'https://www.gstatic.com/marketing-cms/sbx/bf/64/473a08ca46d7bd8f2aba46b90692/gwallet-payment-amex-desktop-en-us.json',
    imagePosition: 'left',
    altText: 'VisaHOBe transparent consular fee settlement and visa consultation',
  },
  {
    id: 'receipts',
    category: 'APPLICATION TRACKING & PASSPORT RETURN',
    inlineIcon: 'receipt',
    iconColor: '#34a853',
    titlePrefix: 'M',
    titleSuffix: 're seamless application tracking',
    description:
      'VisaHOBe provides end-to-end milestone tracking from initial document screening to embassy submission. Automatically sync appointment confirmations from your email, monitor verified status updates at every stage, and track secure passport courier delivery with live tracking numbers.',
    footnote: 'Secure passport courier delivery is fulfilled through authorized diplomatic logistics partners (FedEx, DHL, VFS Global) across Bangladesh and internationally.',
    lottieUrl:
      'https://www.gstatic.com/marketing-cms/sbx/70/90/2398657544e8b4c3b65ca896449c/transactions-receipts-en-us.json',
    imagePosition: 'right',
    altText: 'VisaHOBe live visa application milestones and passport courier delivery tracking',
  },
  {
    id: 'travel',
    category: 'GLOBAL E-VISAS & ENTRY PERMITS',
    inlineIcon: 'airplane_ticket',
    iconColor: '#f29900',
    titlePrefix: 'M',
    titleSuffix: 're carefree international travel',
    description:
      'Access verified electronic travel authorizations including UAE tourist e-Visas, Turkey e-Visas, Singapore entry cards, Malaysia MDAC, and UK ETA. Your approved travel authorizations stay organized with clear validity windows, single/multiple-entry terms, and border compliance guidance.',
    footnote: 'E-Visa eligibility is determined by your passport nationality, destination immigration rules, and travel history. VisaHOBe assists with administrative form review.',
    lottieUrl:
      'https://www.gstatic.com/marketing-cms/sbx/8c/41/5b1580824b0991e874616ef95f9b/gwallet-travel-transit-en-us-2.json',
    imagePosition: 'left',
    altText: 'Approved travel e-visas and entry authorizations organized in VisaHOBe',
  },
  {
    id: 'loyalty',
    category: 'WORK VISA & OVERSEAS EMPLOYMENT INFO',
    inlineIcon: 'loyalty',
    iconColor: '#ea4335',
    titlePrefix: 'M',
    titleSuffix: 're verified skilled worker guidance',
    description:
      'Navigate verified work visa pathways without falling for recruitment fraud. VisaHOBe provides official requirement guides for skilled technical professions (electricians, welders, construction specialists) and Saudi Arabia Qiwa/Musaned verified procedures. We strictly prohibit fake job promises.',
    footnote: 'VisaHOBe is an informational and application support service. Any recruitment or worker deployment is performed only through licensed government-approved recruiting partners.',
    lottieUrl:
      'https://www.gstatic.com/marketing-cms/58/c8/219baffa4bc4a33585495c649d75/gwallet-loyalty-new-desktop-en-us-1.json',
    imagePosition: 'right',
    altText: 'Skilled worker documentation and verified overseas employment information',
  },
  {
    id: 'tickets',
    category: 'EMBASSY APPOINTMENT & BIOMETRIC PASSES',
    inlineIcon: 'confirmation_number',
    iconColor: '#a142f4',
    titlePrefix: 'M',
    titleSuffix: 're secure appointment passes & slips',
    description:
      'Keep your embassy interview slips, VFS/TLScontact biometric confirmation barcodes, and document submission tickets ready in your smartphone. VisaHOBe surfaces your appointment barcode and security checklist on the morning of your visit for fast, stress-free entrance clearance.',
    lottieUrl:
      'https://www.gstatic.com/marketing-cms/sbx/99/e0/489ae2bd47b59af5546e3340c90b/gwallet-tickets-en-us.json',
    imagePosition: 'left',
    altText: 'Consular interview slips and biometric enrollment appointment passes in VisaHOBe',
  },
  {
    id: 'identity',
    category: 'BIOMETRIC PASSPORT & TRAVEL IDENTITY',
    inlineIcon: 'assignment_ind',
    iconColor: '#1a73e8',
    titlePrefix: 'M',
    titleSuffix: 're ways to safeguard your travel identity',
    description:
      'Securely store your Machine Readable Passport (MRP) and e-Passport biometric data, national ID, and police clearance certificates in VisaHOBe. Verify your travel history, past visa foil numbers, and personal details effortlessly when completing official visa forms.',
    ctaText: 'Learn about verified travel ID standards',
    ctaUrl: '#countries',
    isExternalCta: false,
    footnote: 'Biometric records are tokenized and comply with ICAO Doc 9303 international travel document security standards.',
    lottieUrl:
      'https://www.gstatic.com/marketing-cms/sbx/c6/19/a482205e4d6098cba225122358eb/gwallet-identity-en-us.json',
    imagePosition: 'right',
    altText: 'Biometric travel passport and national identity credentials stored securely',
  },
  {
    id: 'keys',
    category: 'BORDER CLEARANCE & VIP LOUNGE',
    inlineIcon: 'lock_open',
    iconColor: '#1e8e3e',
    titlePrefix: 'M',
    titleSuffix: 're keyless border clearance',
    description:
      'Store your automated border control clearance tokens, fast-track transit credentials, and international airport lounge passes. Tap your mobile device at participating international e-gates to speed through customs and immigration checkpoints safely.',
    ctaText: 'View supported international e-gates',
    ctaUrl: '#countries',
    isExternalCta: false,
    footnote: 'Automated border control smart gates available on NFC-equipped devices at eligible international air hubs.',
    lottieUrl:
      'https://www.gstatic.com/marketing-cms/d8/75/fe2117a74a4ba4b89c76d9029076/desktop-gwallet-access-keys-en-us.json',
    imagePosition: 'left',
    altText: 'Digital e-gate clearance and airport VIP fast-track access with VisaHOBe',
  },
  {
    id: 'security',
    category: 'LEGAL COMPLIANCE & DATA PRIVACY',
    inlineIcon: 'security',
    iconColor: '#1a73e8',
    titlePrefix: 'M',
    titleSuffix: 're peace of mind with ethical support',
    description:
      'Your personal, financial, and immigration records are protected by enterprise 256-bit SSL encryption. VisaHOBe adheres to strict ethical standards: no fabricated bank statements, no false bookings, and complete adherence to domestic and international data privacy regulations.',
    lottieUrl:
      'https://www.gstatic.com/marketing-cms/sbx/93/67/d7c9b78c4cddb7a76ff863759aa7/gwallet-security-en-us.json',
    imagePosition: 'right',
    altText: 'Strict legal compliance, data encryption, and ethical visa assistance at VisaHOBe',
  },
];

export const ACCESS_SECTION_DATA = {
  heading: 'Access your visa applications, passes, and travel documents across web and mobile',
  cards: [
    {
      title: 'Online Application Autofill',
      description:
        'Biometric passport data, previous travel dates, and verified sponsor details securely populate when completing official DS-160, ESTA, and Schengen application forms in Google Chrome.',
      image: '/images/access-autofill.jpg',
      imageAlt: 'Online visa application autofill and consular fee payment with VisaHOBe',
    },
    {
      title: 'Across Global Travel Platforms',
      description:
        'Access your approved e-Visas, interview appointment slips, and live courier tracking everywhere you are signed into your VisaHOBe account – across desktop, mobile browser, and partner apps.',
      image: '/images/access-platforms.jpg',
      imageAlt: 'Access VisaHOBe digital travel documents across global platforms',
    },
  ],
};

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'what-is-visahobe',
    question: 'What is VisaHOBe?',
    answer:
      'VisaHOBe is your trusted partner for global visa guidance and application support. We help travelers, professionals, students, and businesses in Bangladesh and worldwide understand complex visa requirements, prepare authentic document checklists, complete official forms, and settle consular fees with complete transparency.',
  },
  {
    id: 'does-visahobe-guarantee-visa',
    question: 'Does VisaHOBe guarantee visa approval or job placement?',
    answer:
      'No. VisaHOBe strictly adheres to ethical immigration standards. No agency can guarantee visa issuance or foreign employment. Final decisions are made solely by the respective government embassy, consulate, or immigration authority. Our role is to ensure your application is accurate, complete, and properly documented.',
  },
  {
    id: 'which-destinations-supported',
    question: 'Which countries and destinations does VisaHOBe support?',
    answer:
      'We support visa guidance for major international destinations including the United Kingdom, United States, Canada, Australia, New Zealand, Schengen Area (Germany, France, Italy, Spain, etc.), Saudi Arabia, UAE, Qatar, Singapore, Malaysia, Thailand, Japan, and South Korea.',
  },
  {
    id: 'how-do-i-pay-embassy-fees',
    question: 'How are government and embassy fees handled?',
    answer:
      'We maintain strict financial transparency: government and embassy fees (such as DS-160 MRV fees or Schengen processing fees) are separated from VisaHOBe administrative service charges. Official fees are paid directly to designated embassy banking channels with verifiable receipts provided.',
  },
  {
    id: 'what-is-skilled-work-visa-support',
    question: 'How does VisaHOBe assist with work and employment visas?',
    answer:
      'We provide verified informational guidance on work visa requirements, employer sponsorship verification, and documentation for skilled occupations (electricians, welders, construction specialists) including Saudi Arabia Qiwa/Musaned protocols. Overseas recruitment is conducted exclusively through licensed government-authorized partners.',
  },
  {
    id: 'how-does-visahobe-protect-documents',
    question: 'How does VisaHOBe safeguard my passports and financial records?',
    answer:
      'All personal data, scanned passports, and financial records are encrypted with 256-bit SSL encryption. We never request your online banking passwords or one-time verification codes (OTPs), and we strictly prohibit fabricated documents or false declarations.',
  },
  {
    id: 'can-i-track-my-application',
    question: 'How can I track my visa application and passport delivery?',
    answer:
      'Through the VisaHOBe Client Portal, you can track live application milestones (Consultation, Document Review, Submission, Decision Received, Passport Courier Return) with direct courier tracking links.',
  },
  {
    id: 'is-consultation-available-in-bangla',
    question: 'Is customer support available in both English and Bangla?',
    answer:
      'Yes. Our experienced visa specialists provide personalized guidance in both English and Bangla (বাংলা), ensuring you clearly understand every step of the consular process.',
  },
];

export const DEMO_CARDS: WalletCard[] = [
  {
    id: 'visahobe-fee-card',
    type: 'payment',
    title: 'Visa Infinite Travel Card',
    subtitle: 'Consular Fee Settlement',
    brand: 'Visa',
    cardNumber: '•••• 4242',
    expiry: '11/28',
    bgColor: 'from-blue-900 via-indigo-950 to-blue-950',
    textColor: 'text-white',
    iconName: 'credit_card',
    status: 'Default for Embassy Fees',
  },
  {
    id: 'us-b1b2-visa',
    type: 'id',
    title: 'United States B1/B2 Visa',
    subtitle: '10-Year Multiple Entry',
    brand: 'U.S. Embassy Consular',
    cardNumber: 'V94820194',
    expiry: 'Valid until: Oct 2034',
    bgColor: 'from-blue-800 via-sky-900 to-indigo-950',
    textColor: 'text-white',
    iconName: 'verified',
    status: 'Approved • Travel Ready',
  },
  {
    id: 'schengen-visa-pass',
    type: 'transit',
    title: 'Schengen Multiple Entry Visa',
    subtitle: 'France / European Union',
    brand: 'Consulat Général de France',
    balanceOrSeat: 'Type C • 90 Days / 180 Days',
    bgColor: 'from-sky-700 to-blue-900',
    textColor: 'text-white',
    iconName: 'flight_takeoff',
    status: 'Biometrics Cleared • Active',
  },
  {
    id: 'consular-interview-slip',
    type: 'ticket',
    title: 'Consular Interview Pass',
    subtitle: 'U.S. Embassy Dhaka • Counter 14',
    brand: 'DS-160 Appointment',
    balanceOrSeat: 'Interview: 09:30 AM • Slip #A-402',
    bgColor: 'from-purple-800 to-indigo-950',
    textColor: 'text-white',
    iconName: 'confirmation_number',
    status: 'Confirmed • QR Ready',
  },
  {
    id: 'saudi-skilled-worker',
    type: 'loyalty',
    title: 'Saudi Arabia Work Visa Status',
    subtitle: 'Qiwa / Muqeem Verified',
    brand: 'Skilled Electrical Tech',
    balanceOrSeat: 'Iqama Sponsor Approved',
    bgColor: 'from-emerald-800 to-green-950',
    textColor: 'text-white',
    iconName: 'engineering',
    status: 'Labor Contract Verified',
  },
  {
    id: 'egate-clearance-key',
    type: 'key',
    title: 'e-Gate Automated Border Pass',
    subtitle: 'Smart Border Clearance',
    brand: 'ICAO Biometric Key',
    balanceOrSeat: 'Facial Token Synced',
    bgColor: 'from-neutral-900 via-stone-900 to-neutral-800',
    textColor: 'text-white',
    iconName: 'lock_open',
    status: 'Ready at Smart Gates',
  },
];

export const LANGUAGES = [
  { code: 'en_us', label: 'English (Global)', url: 'https://visahobe.com/en/' },
  { code: 'bn_bd', label: 'বাংলা (বাংলাদেশ)', url: 'https://visahobe.com/bn/' },
  { code: 'de_de', label: 'Deutsch (Deutschland)', url: 'https://visahobe.com/de/' },
  { code: 'es_es', label: 'Español (España)', url: 'https://visahobe.com/es/' },
  { code: 'fr_fr', label: 'Français (France)', url: 'https://visahobe.com/fr/' },
  { code: 'it_it', label: 'Italiano (Italia)', url: 'https://visahobe.com/it/' },
  { code: 'ja_jp', label: '日本語 (日本)', url: 'https://visahobe.com/ja/' },
  { code: 'ar_sa', label: 'العربية (السعودية)', url: 'https://visahobe.com/ar/' },
];
