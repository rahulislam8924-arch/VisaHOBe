import { ALL_COUNTRIES } from '../data/allCountriesData';
import type { ApplicantInfo, VisaCategory } from './portalTypes';
import { buildChecklist, estimateFees, formatMoney, VISA_CATEGORY_LABEL } from './portalTypes';
import type { NewApplicationInput } from './portalStore';

/**
 * Deterministic, offline visa assistant.
 *
 * The agent runs entirely in the browser: no external AI provider is called,
 * nothing is submitted anywhere and it never promises an approval. It prepares
 * the application package and hands it to the client for approval.
 */

export type AgentStep =
  | 'idle'
  | 'destination'
  | 'category'
  | 'visaType'
  | 'fullName'
  | 'dateOfBirth'
  | 'nationality'
  | 'passportNumber'
  | 'passportExpiry'
  | 'email'
  | 'purpose'
  | 'travelDates'
  | 'review';

export interface AgentDraft {
  destination?: string;
  visaCategory?: VisaCategory;
  visaType?: string;
  applicant: Partial<ApplicantInfo>;
  purpose?: string;
  dateFrom?: string;
  dateTo?: string;
  expedited?: boolean;
}

export interface AgentSession {
  step: AgentStep;
  draft: AgentDraft;
}

export const emptyAgentSession = (): AgentSession => ({ step: 'idle', draft: { applicant: {} } });

export interface AgentTurnResult {
  session: AgentSession;
  replies: string[];
  suggestions: string[];
  createdApplication?: NewApplicationInput;
  openSupport?: boolean;
  openApplicationId?: string;
}

const COUNTRY_ALIASES: Record<string, string> = {
  uae: 'United Arab Emirates',
  dubai: 'United Arab Emirates',
  emirates: 'United Arab Emirates',
  usa: 'United States',
  us: 'United States',
  america: 'United States',
  uk: 'United Kingdom',
  britain: 'United Kingdom',
  england: 'United Kingdom',
  ksa: 'Saudi Arabia',
  schengen: 'France',
  holland: 'Netherlands',
  korea: 'South Korea',
  uae2: 'United Arab Emirates',
};

export const findCountry = (text: string) => {
  const value = text.toLowerCase();
  const alias = Object.keys(COUNTRY_ALIASES).find((key) =>
    new RegExp(`\\b${key}\\b`).test(value)
  );
  if (alias) {
    const match = ALL_COUNTRIES.find((country) => country.name === COUNTRY_ALIASES[alias]);
    if (match) return match;
  }
  return (
    ALL_COUNTRIES.find((country) => new RegExp(`\\b${country.name.toLowerCase()}\\b`).test(value)) ??
    null
  );
};

const CATEGORY_PATTERNS: { category: VisaCategory; pattern: RegExp }[] = [
  { category: 'work', pattern: /work|employment|job|labour|labor|skilled/i },
  { category: 'business', pattern: /business|conference|meeting|trade/i },
  { category: 'student', pattern: /student|study|university|college|school/i },
  { category: 'transit', pattern: /transit|layover|stopover/i },
  { category: 'medical', pattern: /medical|treatment|hospital|surgery/i },
  { category: 'family', pattern: /family|spouse|wife|husband|dependent|visit.*relative/i },
  { category: 'tourist', pattern: /touris|visitor|holiday|vacation|leisure|sightsee/i },
];

const categoryFromText = (text: string): VisaCategory | null => {
  const found = CATEGORY_PATTERNS.find((entry) => entry.pattern.test(text));
  return found ? found.category : null;
};

const VISA_TYPE_BY_CATEGORY: Record<VisaCategory, string> = {
  tourist: 'Short-stay visitor visa',
  business: 'Business visitor visa',
  work: 'Long-stay work visa',
  student: 'Student visa',
  transit: 'Transit visa',
  medical: 'Medical treatment visa',
  family: 'Family visit visa',
};

const isValidIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));

const parseDate = (text: string): string | null => {
  const iso = text.match(/\d{4}-\d{2}-\d{2}/);
  if (iso && isValidIsoDate(iso[0])) return iso[0];
  const match = text.match(/(\d{1,2})[\/\-. ](\d{1,2})[\/\-. ](\d{4})/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }
  const parsed = Date.parse(text);
  if (!Number.isNaN(parsed)) return new Date(parsed).toISOString().slice(0, 10);
  return null;
};

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

export const countryBrief = (name: string) => {
  const country = ALL_COUNTRIES.find((entry) => entry.name === name);
  if (!country) return null;
  return [
    `${country.name} — ${country.visaTypeSummary}`,
    `Visa needed for Bangladeshi passports: ${country.visaRequiredForBD ? 'yes' : 'no'}`,
    `Apply via: ${country.submissionLocation}`,
    `Typical processing: ${country.processingTime}`,
    `Embassy fee range: ${country.embassyFeeRange}`,
    `Biometrics: ${country.biometricRequired ? 'required' : 'not required'} · Interview: ${
      country.interviewRequired ? 'usually required' : 'normally waived'
    }`,
  ].join('\n');
};

const summaryOfDraft = (draft: AgentDraft) => {
  const fees = estimateFees(draft.destination ?? '', draft.visaCategory ?? 'tourist', {
    expedited: draft.expedited,
  });
  const total = fees.agency + fees.government + fees.embassy + fees.additional;
  const checklist = buildChecklist(draft.visaCategory ?? 'tourist');
  return {
    fees,
    total,
    checklist,
    text: [
      `Here is the application package I prepared — nothing has been submitted.`,
      '',
      `Destination: ${draft.destination}`,
      `Visa category: ${VISA_CATEGORY_LABEL[draft.visaCategory ?? 'tourist']}`,
      `Visa type: ${draft.visaType ?? VISA_TYPE_BY_CATEGORY[draft.visaCategory ?? 'tourist']}`,
      `Applicant: ${draft.applicant.fullName} · DOB ${draft.applicant.dateOfBirth} · ${draft.applicant.nationality}`,
      `Passport: ${draft.applicant.passportNumber} (expires ${draft.applicant.passportExpiry})`,
      `Travel: ${draft.purpose} · ${draft.dateFrom} → ${draft.dateTo}`,
      '',
      `Estimated fees: agency ${formatMoney(fees.agency)} + government ${formatMoney(
        fees.government
      )} + visa centre ${formatMoney(fees.embassy)} + services ${formatMoney(
        fees.additional
      )} = ${formatMoney(total)}`,
      '',
      `Documents you will need (${checklist.length}):`,
      ...checklist.map((item) => `• ${item.label}${item.required ? '' : ' (if applicable)'}`),
      '',
      'Please review this preview. You can approve it, or ask for a correction first.',
    ].join('\n'),
  };
};

const ask = (
  step: AgentStep,
  session: AgentSession,
  replies: string[],
  suggestions: string[] = []
): AgentTurnResult => ({
  session: { ...session, step },
  replies,
  suggestions,
});

const mergeDraft = (session: AgentSession, patch: Partial<AgentDraft>): AgentSession => ({
  ...session,
  draft: { ...session.draft, ...patch, applicant: { ...session.draft.applicant, ...(patch.applicant ?? {}) } },
});

const buildInput = (draft: AgentDraft): NewApplicationInput => ({
  destination: draft.destination ?? '',
  visaCategory: draft.visaCategory ?? 'tourist',
  visaType: draft.visaType ?? VISA_TYPE_BY_CATEGORY[draft.visaCategory ?? 'tourist'],
  applicant: {
    fullName: draft.applicant.fullName ?? '',
    dateOfBirth: draft.applicant.dateOfBirth ?? '',
    nationality: draft.applicant.nationality ?? '',
    gender: draft.applicant.gender ?? 'Not specified',
    email: draft.applicant.email ?? '',
    phone: draft.applicant.phone ?? '',
    passportNumber: draft.applicant.passportNumber ?? '',
    passportExpiry: draft.applicant.passportExpiry ?? '',
    passportIssueCountry: draft.applicant.passportIssueCountry ?? draft.applicant.nationality ?? '',
  },
  travel: {
    purpose: draft.purpose ?? 'Tourism',
    dateFrom: draft.dateFrom ?? '',
    dateTo: draft.dateTo ?? '',
  },
  expedited: draft.expedited,
  notes: 'Prepared by the VisaHOBe AI visa agent (preview mode).',
});

/**
 * Advance the conversation one turn.
 * `context` lets the agent answer questions about the client's own records.
 */
export const runAgentTurn = (
  session: AgentSession,
  rawText: string,
  context: {
    defaultApplicant: Partial<ApplicantInfo>;
    applicationCount: number;
    missingDocuments: number;
    pendingApprovals: number;
  }
): AgentTurnResult => {
  const text = rawText.trim();
  const lower = text.toLowerCase();

  if (!text) {
    return {
      session,
      replies: ['Tell me what you need — for example the country you want to visit.'],
      suggestions: ['I want to apply for a US tourist visa', 'Which documents do I need?', 'Show my applications'],
    };
  }

  // Support hand-off
  if (/human|agent support|support team|talk to (a )?(person|officer)|complain/.test(lower)) {
    return {
      session: { ...session, step: 'idle' },
      replies: [
        'I can raise a support request for the VisaHOBe case team. Open **Support** and describe the issue — you will get replies in the portal (no external message is sent in preview mode).',
      ],
      suggestions: ['Open support', 'Back to my application'],
      openSupport: true,
    };
  }

  // Status questions about own records
  if (/(my|show).*(application|status|case)|status of my|how far/.test(lower)) {
    return {
      session: { ...session, step: 'idle' },
      replies: [
        `You have ${context.applicationCount} application${context.applicationCount === 1 ? '' : 's'} on file.`,
        context.missingDocuments
          ? `${context.missingDocuments} required document${context.missingDocuments === 1 ? ' is' : 's are'} still missing.`
          : 'All required documents have been uploaded.',
        context.pendingApprovals
          ? `${context.pendingApprovals} application${context.pendingApprovals === 1 ? ' is' : 's are'} waiting for your approval in My Applications.`
          : 'Nothing is waiting for your approval right now.',
      ],
      suggestions: ['Open My Applications', 'Start a new application'],
    };
  }

  if (/fee|cost|price|how much/.test(lower) && session.step === 'idle') {
    const country = findCountry(text);
    const category = categoryFromText(text) ?? 'tourist';
    if (country) {
      const fees = estimateFees(country.name, category);
      const total = fees.agency + fees.government + fees.embassy + fees.additional;
      return {
        session,
        replies: [
          `Estimated fees for ${country.name} (${VISA_CATEGORY_LABEL[category]}):`,
          `• Agency service fee ${formatMoney(fees.agency)}`,
          `• Government visa fee ${formatMoney(fees.government)}`,
          `• Visa centre / biometrics ${formatMoney(fees.embassy)}`,
          `• Additional services ${formatMoney(fees.additional)}`,
          `Total estimate ${formatMoney(total)}`,
          'These are configured preview estimates, not a payment request.',
        ],
        suggestions: [`Start an application for ${country.name}`, 'Show my applications'],
      };
    }
  }

  if (/(document|checklist|requirement)/.test(lower) && session.step === 'idle') {
    const country = findCountry(text);
    const category = categoryFromText(text) ?? 'tourist';
    const checklist = buildChecklist(category);
    return {
      session,
      replies: [
        `${country ? `${country.name} — ` : ''}${VISA_CATEGORY_LABEL[category]} checklist (${checklist.length} items):`,
        ...checklist.map((item) => `• ${item.label}${item.required ? '' : ' (if applicable)'}`),
        'I can create a draft application so you can upload these documents.',
      ],
      suggestions: [country ? `Start an application for ${country.name}` : 'Start a new application'],
    };
  }

  /* ------------------------- guided intake ------------------------- */

  switch (session.step) {
    case 'idle': {
      const country = findCountry(text);
      const wantsApplication = /appl|visa|start|need|want|renew|apply/.test(lower) || Boolean(country);

      if (country && wantsApplication) {
        const category = categoryFromText(text);
        const nextSession = mergeDraft(session, {
          destination: country.name,
          visaCategory: category ?? undefined,
        });
        if (category) {
          const type = VISA_TYPE_BY_CATEGORY[category];
          return ask(
            'visaType',
            mergeDraft(nextSession, { visaType: type }),
            [
              `Great — ${country.name} for ${VISA_CATEGORY_LABEL[category].toLowerCase()}.`,
              countryBrief(country.name) ?? '',
              '',
              `I will prepare a **${type}** application. Would you like a different visa type?`,
            ].filter(Boolean),
            [type, 'Show me other types', 'Cancel']
          );
        }
        return ask(
          'category',
          nextSession,
          [
            `${country.name} — ${country.visaTypeSummary}.`,
            countryBrief(country.name) ?? '',
            '',
            'What is the purpose of your trip? (tourist, business, work, student, transit, medical, family)',
          ].filter(Boolean),
          ['Tourist', 'Business', 'Work', 'Student']
        );
      }

      if (wantsApplication) {
        return ask(
          'destination',
          mergeDraft(session, { applicant: context.defaultApplicant }),
          ['Happy to prepare this application with you. Which country are you travelling to?'],
          ['United States', 'United Kingdom', 'Schengen (France)', 'United Arab Emirates']
        );
      }

      return {
        session,
        replies: [
          'I can prepare a complete visa application with you: I collect your details, build the document checklist, check the documents, estimate the fees and produce a preview for your approval.',
          'Say something like “I need a UK tourist visa” to begin.',
        ],
        suggestions: [
          'I need a UK tourist visa',
          'Which documents do I need for Schengen?',
          'Show my applications',
        ],
      };
    }

    case 'destination': {
      const country = findCountry(text);
      if (!country) {
        return ask(
          'destination',
          session,
          ['I could not match that to a country in the VisaHOBe dataset. Which country will you visit?'],
          ['United States', 'United Kingdom', 'France', 'Japan']
        );
      }
      const category = categoryFromText(text);
      const next = mergeDraft(session, { destination: country.name, visaCategory: category ?? undefined });
      if (category) {
        const type = VISA_TYPE_BY_CATEGORY[category];
        return ask(
          'visaType',
          mergeDraft(next, { visaType: type }),
          [`${country.name} × ${VISA_CATEGORY_LABEL[category]} noted.`, `I suggest a **${type}**. Keep it?`],
          [type, 'Show me other types']
        );
      }
      return ask(
        'category',
        next,
        [`${country.name} it is. What is the purpose of the trip?`],
        ['Tourist', 'Business', 'Work', 'Student', 'Family visit']
      );
    }

    case 'category': {
      const category = categoryFromText(text);
      if (!category) {
        return ask(
          'category',
          session,
          ['Please choose a purpose: tourist, business, work, student, transit, medical or family visit.'],
          ['Tourist', 'Business', 'Work', 'Student']
        );
      }
      const type = VISA_TYPE_BY_CATEGORY[category];
      return ask(
        'visaType',
        mergeDraft(session, { visaCategory: category, visaType: type }),
        [`${VISA_CATEGORY_LABEL[category]} it is. I will prepare a **${type}**.`, 'Is that the right visa type?'],
        [type, 'Show me other types']
      );
    }

    case 'visaType': {
      if (/other|types|different|list/i.test(lower)) {
        const category = session.draft.visaCategory ?? 'tourist';
        return ask(
          'visaType',
          session,
          [
            `Common ${VISA_CATEGORY_LABEL[category].toLowerCase()} options:`,
            '• Standard processing',
            '• Priority / expedited processing',
            '• Multiple-entry where the post allows it',
            'Reply with the option you want, or type your own description.',
          ],
          ['Standard processing', 'Priority / expedited processing', 'Multiple entry']
        );
      }
      const expedited = /priority|expedited|fast|express/i.test(lower);
      const chosenType = /standard|same|keep|yes|ok/i.test(lower)
        ? session.draft.visaType ?? VISA_TYPE_BY_CATEGORY[session.draft.visaCategory ?? 'tourist']
        : text.replace(/^i (want|need) (a|an)\s+/i, '').trim() || VISA_TYPE_BY_CATEGORY[session.draft.visaCategory ?? 'tourist'];

      const next = mergeDraft(session, {
        visaType: chosenType,
        expedited,
        applicant: { ...context.defaultApplicant },
      });

      const fullName = session.draft.applicant.fullName ?? context.defaultApplicant.fullName;
      if (fullName) {
        return ask(
          'dateOfBirth',
          mergeDraft(next, { applicant: { ...context.defaultApplicant, fullName } }),
          [
            `Using **${chosenType}**${expedited ? ' with priority processing' : ''}.`,
            `I have your name as **${fullName}** — is that correct? If yes, send your date of birth (YYYY-MM-DD).`,
          ],
          ['Yes, correct']
        );
      }
      return ask(
        'fullName',
        next,
        ['Please tell me your full name exactly as printed in your passport.']
      );
    }

    case 'fullName': {
      if (text.length < 3) {
        return ask('fullName', session, ['Please enter your full name as printed in your passport.']);
      }
      return ask(
        'dateOfBirth',
        mergeDraft(session, { applicant: { fullName: text } }),
        [`Thank you, ${text}. What is your date of birth? (YYYY-MM-DD)`],
        ['1995-06-12']
      );
    }

    case 'dateOfBirth': {
      if (/^(yes|correct|ok)$/i.test(lower) && session.draft.applicant.fullName) {
        return ask('dateOfBirth', session, ['Please send your date of birth as YYYY-MM-DD.']);
      }
      const date = parseDate(text);
      if (!date || Date.parse(date) > Date.now()) {
        return ask('dateOfBirth', session, ['I need a valid past date, for example 1995-06-12.']);
      }
      return ask(
        'nationality',
        mergeDraft(session, { applicant: { dateOfBirth: date } }),
        ['Noted. What is your nationality (as on your passport)?'],
        [context.defaultApplicant.nationality ?? 'Bangladesh']
      );
    }

    case 'nationality': {
      if (text.length < 2) {
        return ask('nationality', session, ['Which nationality is printed in your passport?']);
      }
      return ask(
        'passportNumber',
        mergeDraft(session, {
          applicant: { nationality: text, passportIssueCountry: text },
        }),
        ['What is your passport number?']
      );
    }

    case 'passportNumber': {
      if (text.replace(/\s/g, '').length < 5) {
        return ask('passportNumber', session, [
          'Passport numbers are usually 6–9 characters. Please re-check and send it again.',
        ]);
      }
      return ask(
        'passportExpiry',
        mergeDraft(session, { applicant: { passportNumber: text.toUpperCase() } }),
        ['When does the passport expire? (YYYY-MM-DD — most posts need 6 months validity)']
      );
    }

    case 'passportExpiry': {
      const date = parseDate(text);
      if (!date) {
        return ask('passportExpiry', session, ['Please send the expiry date as YYYY-MM-DD.']);
      }
      const sixMonths = new Date();
      sixMonths.setMonth(sixMonths.getMonth() + 6);
      const warning =
        Date.parse(date) < sixMonths.getTime()
          ? '\n⚠️ This passport expires within 6 months — most embassies will not accept it. Consider renewing first.'
          : '';
      return ask(
        'email',
        mergeDraft(session, { applicant: { passportExpiry: date } }),
        [`Passport expiry recorded.${warning}`, 'Which email should the case team use?'],
        [context.defaultApplicant.email ?? '']
      );
    }

    case 'email': {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
        return ask('email', session, ['That does not look like a valid email address. Please re-enter it.']);
      }
      return ask(
        'purpose',
        mergeDraft(session, { applicant: { email: text } }),
        ['Noted. What is the main purpose of your trip? (for example: tourism, family visit, conference)'],
        ['Tourism', 'Business meetings', 'Family visit']
      );
    }

    case 'purpose': {
      if (text.length < 3) {
        return ask('purpose', session, ['In a few words, what is the purpose of the trip?']);
      }
      return ask(
        'travelDates',
        mergeDraft(session, { purpose: text }),
        [
          'What are your travel dates? Send the departure and return date, for example “2026-03-10 to 2026-03-24”.',
        ],
        [`${daysFromNow(45)} to ${daysFromNow(60)}`]
      );
    }

    case 'travelDates': {
      const dates = text.match(/\d{4}-\d{2}-\d{2}/g) ?? [];
      let from = dates[0] ?? null;
      let to = dates[1] ?? null;
      if (!from) from = parseDate(text);
      if (from && !to) {
        const plus = text.match(/(\d{1,3})\s*(day|night)/i);
        if (plus) {
          const end = new Date(from);
          end.setDate(end.getDate() + Number(plus[1]));
          to = end.toISOString().slice(0, 10);
        }
      }
      if (!from) {
        return ask('travelDates', session, [
          'I could not read the dates. Please send them as YYYY-MM-DD to YYYY-MM-DD.',
        ]);
      }
      const next = mergeDraft(session, { dateFrom: from, dateTo: to ?? from });
      return ask('review', next, [summaryOfDraft(next.draft).text], [
        'Create draft application',
        'Change travel dates',
        'Cancel',
      ]);
    }

    case 'review':
    default: {
      if (/cancel|stop|never mind/i.test(lower)) {
        return {
          session: emptyAgentSession(),
          replies: ['No problem — nothing was created. I am here whenever you are ready.'],
          suggestions: ['Start a new application', 'Show my applications'],
        };
      }
      if (/change|edit|correct|wrong/i.test(lower) && !/create|approve/i.test(lower)) {
        return ask(
          'travelDates',
          session,
          ['Sure — send the corrected travel dates (YYYY-MM-DD to YYYY-MM-DD), or tell me which detail to change.'],
          []
        );
      }
      if (/create|approve|confirm|yes|ok|proceed/i.test(lower)) {
        const draft = session.draft;
        if (!draft.destination) {
          return ask('destination', session, ['I still need the destination country to create the draft.']);
        }
        const input = buildInput(draft);
        return {
          session: emptyAgentSession(),
          replies: [
            `Draft created: ${input.destination} · ${input.visaType}.`,
            'It is in My Applications with the document checklist. Upload the documents there and I will run the preliminary check, prepare the form and generate the approval preview.',
            'Nothing has been submitted to any embassy or provider.',
          ],
          suggestions: ['Open My Applications', 'What documents do I need?'],
          createdApplication: input,
        };
      }
      return ask('review', session, [summaryOfDraft(session.draft).text], [
        'Create draft application',
        'Request a correction',
      ]);
    }
  }
};

export const AGENT_QUICK_PROMPTS = [
  'I need a US tourist visa',
  'Which documents do I need for Schengen?',
  'How much is a UK visa?',
  'Show my applications',
  'Talk to human support',
];
