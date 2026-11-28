/**
 * DOM smoke test: bundles the app, runs it in jsdom and exercises the flows that
 * used to be broken (hero CTA, hash routing, country report tabs, portal, demo modal).
 *
 * Run with: npm run smoke:dom
 */
import { JSDOM } from 'jsdom';
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const tmp = await mkdtemp(path.join(tmpdir(), 'visahobe-smoke-'));
const bundlePath = path.join(tmp, 'app.js');

await build({
  entryPoints: ['src/main.tsx'],
  bundle: true,
  format: 'iife',
  outfile: bundlePath,
  loader: { '.css': 'empty' },
  define: { 'process.env.NODE_ENV': '"development"' },
  jsx: 'automatic',
  logLevel: 'error',
});

const bundle = await readFile(bundlePath, 'utf8');
await rm(tmp, { recursive: true, force: true });

const failures = [];
const check = (label, condition, detail = '') => {
  if (condition) console.log(`ok    ${label}`);
  else {
    failures.push(label);
    console.error(`FAIL  ${label} ${detail}`);
  }
};

const dom = new JSDOM('<!doctype html><html lang="en"><body><div id="root"></div></body></html>', {
  runScripts: 'outside-only',
  pretendToBeVisual: true,
  url: 'http://localhost:5173/',
});
const { window } = dom;
const { document: doc } = window;

const runtimeErrors = [];
window.addEventListener('error', (e) => runtimeErrors.push(e.error?.stack || e.message));
window.addEventListener('unhandledrejection', (e) => runtimeErrors.push(String(e.reason)));
window.console.error = (...args) => runtimeErrors.push(args.map(String).join(' ').slice(0, 300));

// Browser APIs jsdom does not implement but the app touches
window.scrollTo = () => {};
window.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
window.matchMedia =
  window.matchMedia ||
  ((query) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  }));
// lottie-web probes a 2d canvas context at import time
const ctxStub = new Proxy({}, { get: () => () => ctxStub, set: () => true });
window.HTMLCanvasElement.prototype.getContext = () => ctxStub;

const wait = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));
const text = (el) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
const findByText = (label, selector = 'button, a') =>
  [...doc.querySelectorAll(selector)].find((el) => text(el).includes(label));
const click = (el) => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));

window.eval(bundle);
await wait(300);

// Navigation bar
const mainNav = doc.querySelector('nav[aria-label="Main navigation"]');
check('desktop nav is present', Boolean(mainNav));
check(
  'nav marks the current page',
  mainNav?.querySelector('[aria-current="page"]') !== null,
  'no aria-current in nav'
);
const servicesTrigger = [...(mainNav?.querySelectorAll('button') ?? [])].find(
  (b) => text(b).startsWith('Visa Services')
);
click(servicesTrigger);
await wait(80);
const servicesMenu = doc.querySelector('[role="menu"][aria-label="Visa services"]');
check('nav dropdown opens on click', Boolean(servicesMenu));
check(
  'nav dropdown lists services',
  text(servicesMenu).includes('Document Attestation'),
  text(servicesMenu).slice(0, 80)
);
doc.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
await wait(80);
check('Escape closes the nav dropdown', !doc.querySelector('[role="menu"]'));

const menuToggle = doc.querySelector('button[aria-controls="mobile-navigation"]');
click(menuToggle);
await wait(120);
const drawer = doc.querySelector('#mobile-navigation');
check('mobile drawer opens', drawer?.className.includes('translate-x-0'));
check('open drawer locks page scroll', doc.body.style.overflow === 'hidden');
click(drawer?.querySelector('button[aria-label="Close navigation menu"]'));
await wait(120);
check('mobile drawer closes', drawer?.className.includes('-translate-x-full'));
check('closing the drawer restores page scroll', doc.body.style.overflow === '');

// Home page
check('home page renders', text(doc.querySelector('h1')).includes('Tap into'));
check('190 countries in the dataset label', text(doc.body).includes('All 190 countries'));
check('download QR asset is self-hosted', doc.querySelector('img[src*="visahobe-app-qr"]') !== null ||
  doc.body.innerHTML.includes('/visahobe-app-qr.png'));

// Hero CTA must book a consultation, not open the app-download dialog
click(findByText('Book a Consultation'));
await wait(200);
check('hero CTA routes to the appointment page', window.location.hash === '#appointment');
check('hero CTA does not open the download dialog', doc.querySelector('#download-modal-title') === null);
const dateInput = doc.querySelector('input[type=date]');
check('appointment default date is not in the past', dateInput && dateInput.value >= dateInput.min,
  `${dateInput?.value} < ${dateInput?.min}`);
check('appointment offers the full country list', doc.querySelectorAll('select')[0]?.options.length > 100);

// Hash based routing
window.location.hash = '#countries';
await wait(250);
check('hash routing opens the country guides', text(doc.querySelector('h1')).includes('Global Visa Guides'));

// Country report tabs now filter content
const japanCard = [...doc.querySelectorAll('div, button')].find(
  (el) => text(el.querySelector('h3')) === 'Japan' && /29-point guide/i.test(text(el))
);
check(
  'country cards render bundled flags',
  [...doc.querySelectorAll('img[src^="/flags/"]')].length > 0,
  'no /flags/ images found'
);
check('country card exists', Boolean(japanCard));
if (japanCard) {
  click(japanCard);
  await wait();
  const dialog = [...doc.querySelectorAll('[role="dialog"]')].find((el) =>
    text(el).includes('Country Overview')
  );
  const before = text(dialog).length;
  click(findByText('Document Checklist', '[role="dialog"] button'));

  await wait();
  const after = text(dialog);
  check('report tab filters the report', after.length < before);
  check('checklist tab keeps the document checklist', after.includes('Master Document Checklist'));
  check('checklist tab hides the step-by-step process', !after.includes('Step-by-Step Application Process'));
  check('dialog CTA labels are clean', !/2[0-9]\. (Open Client Portal|Book Consultation)/.test(after));
}

// Portal (client-side preview mode)
window.location.hash = '#dashboard';
await wait(350);
check('portal view loads', doc.title === 'VisaHOBe Client Portal');

const portalKey = 'visahobe.portal.v2';
const readState = () => JSON.parse(window.localStorage.getItem(portalKey) || '{}');
check('portal state is persisted locally', Boolean(window.localStorage.getItem(portalKey)));

const sidebarLabels = ['Dashboard', 'AI Visa Agent', 'My Applications', 'Payments', 'My Profile'];
const sidebarText = text(doc.body);
check(
  'client sidebar shows the final five items',
  sidebarLabels.every((label) => sidebarText.includes(label)),
  sidebarLabels.filter((label) => !sidebarText.includes(label)).join(', ')
);

const asideText = text(doc.querySelector('aside'));
check(
  'sidebar holds only the five main items plus log out',
  !asideText.includes('Consular support') && !asideText.includes('Feedback') && asideText.includes('Log out'),
  asideText.slice(0, 120)
);

check('dashboard greets the saved applicant', text(doc.body).includes('Welcome back, Alexander'));
check(
  'dashboard shows derived application totals',
  text(doc.body).includes('Total applications') &&
    text(doc.body).includes('Missing documents') &&
    text(doc.body).includes('Pending payments')
);
check('dashboard lists recent activity and appointments', text(doc.body).includes('Recent application activity'));
check('dashboard flags demo records', text(doc.body).includes('Demo records.'));

// Notifications in the top bar
const bell = doc.querySelector('[aria-label^="Notifications"]');
check('top bar has a notifications bell', Boolean(bell));
if (bell) {
  click(bell);
  await wait(150);
  check('notification panel opens', text(doc.body).includes('Mark all read'));
  const markAll = [...doc.querySelectorAll('button')].find((el) => text(el) === 'Mark all read');
  if (markAll) {
    click(markAll);
    await wait(200);
    check(
      'notifications can be marked as read',
      (readState().notifications || []).every((n) => n.read)
    );
  }
  click(bell);
  await wait(120);
}

// ---- AI agent: full application intake ----
click(findByText('AI Visa Agent'));
await wait(250);
check('AI visa agent view opens', text(doc.body).includes('AI Visa Agent'));

const typeInto = (input, value) => {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(input, value);
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
  input.dispatchEvent(new window.Event('change', { bubbles: true }));
};
const typeTextArea = (area, value) => {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
  setter.call(area, value);
  area.dispatchEvent(new window.Event('input', { bubbles: true }));
};

const agentInput = doc.querySelector('input[aria-label="Message the AI visa agent"]');
const chat = async (value) => {
  typeInto(agentInput, value);
  await wait(80);
  agentInput.closest('form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await wait(750);
};

const applicationsBefore = (readState().applications || []).length;

if (agentInput) {
  await chat('I need a US tourist visa');
  check('agent answers with the visa type question', text(doc.body).includes('US') || text(doc.body).includes('United States'));
  await chat('Standard processing');
  await chat('1990-05-14');
  await chat('Bangladesh');
  await chat('P1234567');
  await chat('2032-01-01');
  await chat('riyad@example.com');
  await chat('Tourism');
  await chat('2026-05-01 to 2026-05-20');
  check('agent produces the application preview', text(doc.body).includes('Create draft application'));
  await chat('Create draft application');
  await wait(500);
  check(
    'agent creates a draft application',
    (readState().applications || []).length === applicationsBefore + 1,
    `applications ${(readState().applications || []).length}`
  );
  check('new application opens on its document checklist', text(doc.body).includes('Run AI check & prepare'));
  const closeDetail = doc.querySelector('[aria-label="Close"]');
  if (closeDetail) {
    click(closeDetail);
    await wait(200);
  }
}

// ---- My Applications ----
click(findByText('My Applications'));
await wait(250);
check('applications view opens with status filters', text(doc.body).includes('All applications') && text(doc.body).includes('Cancelled'));

const reviewButton = findByText('Review & approve');
if (reviewButton) {
  click(reviewButton);
  await wait(350);

  const approvalTab = [...doc.querySelectorAll('button')].find((el) => text(el).includes('Approval'));
  if (approvalTab && !text(doc.body).includes('Application preview')) {
    click(approvalTab);
    await wait(250);
  }
  check(
    'approval tab shows the application preview',
    text(doc.body).includes('Application preview'),
    text(doc.body).slice(0, 120)
  );

  const approveButton = [...doc.querySelectorAll('button')].find((el) => text(el).includes('Approve preview'));
  const appPending = (readState().applications || []).find((app) => app.status === 'client_approval_required');
  if (approveButton && appPending) {
    click(approveButton);
    await wait(300);
    const updated = (readState().applications || []).find((app) => app.id === appPending.id);
    check('client can approve the preview', updated?.approval?.status === 'approved', JSON.stringify(updated?.approval));
    check('approval records the version and timestamp', Boolean(updated?.approval?.approvedAt) && updated?.approval?.version >= 1);
  }

  const correctionButton = [...doc.querySelectorAll('button')].find((el) => text(el).includes('Request correction'));
  if (correctionButton) {
    click(correctionButton);
    await wait(200);
    const textarea = doc.querySelector('textarea[placeholder^="What should be corrected"]');
    if (textarea) {
      typeTextArea(textarea, 'Please correct the travel date to 2026-06-02');
      await wait(80);
      const sendRequest = [...doc.querySelectorAll('button')].find((el) => text(el).includes('Send request'));
      if (sendRequest) {
        click(sendRequest);
        await wait(300);
        const anyCorrection = (readState().applications || []).some((app) => (app.corrections || []).length > 0);
        check('client can request a correction', anyCorrection);
      }
    }
  }
}

// Document upload is exercised through the file input
const fileInput = doc.querySelector('input[type="file"]');
if (fileInput) {
  const file = new window.File(['x'.repeat(60000)], 'bank-statement.pdf', { type: 'application/pdf' });
  Object.defineProperty(fileInput, 'files', { value: [file] });
  fileInput.dispatchEvent(new window.Event('change', { bubbles: true }));
  await wait(900);
  check(
    'document upload is recorded',
    (readState().applications || []).some((app) =>
      (app.documents || []).some((doc2) => doc2.fileName === 'bank-statement.pdf')
    )
  );
}

const closeAfterUpload = doc.querySelector('[aria-label="Close"]');
if (closeAfterUpload) {
  click(closeAfterUpload);
  await wait(200);
}

// Cancellation request
const cancelInList = [...doc.querySelectorAll('button')].find((el) => text(el) === 'View details');
if (cancelInList) {
  click(cancelInList);
  await wait(300);
  const cancelButton = [...doc.querySelectorAll('button')].find((el) => text(el) === 'Request cancellation');
  if (cancelButton) {
    click(cancelButton);
    await wait(200);
    const reason = doc.querySelector('textarea[placeholder^="Reason for cancellation"]');
    if (reason) {
      typeTextArea(reason, 'Plans changed');
      await wait(80);
      const confirmCancel = [...doc.querySelectorAll('button')]
        .filter((el) => text(el) === 'Request cancellation')
        .pop();
      if (confirmCancel) {
        click(confirmCancel);
        await wait(300);
        check(
          'cancellation request is recorded',
          (readState().applications || []).some((app) => app.status === 'cancelled')
        );
      }
    }
  }
  const closeCancel = doc.querySelector('[aria-label="Close"]');
  if (closeCancel) {
    click(closeCancel);
    await wait(200);
  }
}

// ---- Payments ----
click(findByText('Payments'));
await wait(250);
check('payments view opens', text(doc.body).includes('Invoices by application'));
check('payment view explains the disabled gateway', text(doc.body).includes('no real charge'));

const invoiceButton = [...doc.querySelectorAll('button')].find((el) => text(el) === 'Invoice');
if (invoiceButton) {
  click(invoiceButton);
  await wait(200);
  check('invoice preview opens', text(doc.body).includes('Invoice preview'));
  const payButton = [...doc.querySelectorAll('button')].find((el) => text(el).includes('Pay (disabled)'));
  if (payButton) {
    click(payButton);
    await wait(200);
    check('payment is blocked in preview mode', text(doc.body).includes('disabled in preview mode'));
  }
  const closeInvoice = [...doc.querySelectorAll('button')].find((el) => text(el) === 'Close');
  if (closeInvoice) {
    click(closeInvoice);
    await wait(150);
  }
}

const refundButton = [...doc.querySelectorAll('button')].find((el) => text(el).includes('Request refund review'));
if (refundButton) {
  click(refundButton);
  await wait(250);
  check('refund review becomes a support ticket', (readState().support || []).length > 0);
}

// ---- Support ----
const supportTextarea = doc.querySelector('textarea[placeholder^="Describe the issue"]');
if (supportTextarea) {
  typeTextArea(supportTextarea, 'My bank statement upload was rejected and I need advice.');
  await wait(80);
  const createRequest = [...doc.querySelectorAll('button')].find((el) => text(el).includes('Create request'));
  const beforeTickets = (readState().support || []).length;
  if (createRequest) {
    click(createRequest);
    await wait(300);
    check('support request is created from the portal', (readState().support || []).length > beforeTickets);
    check('support shows a simulated acknowledgement', text(doc.body).includes('simulated acknowledgement'));
  }
  const closeSupport = [...doc.querySelectorAll('button')].find((el) => el.getAttribute('aria-label') === 'Close');
  if (closeSupport) {
    click(closeSupport);
    await wait(200);
  }
}

// ---- Payment history ----
const historyButton = [...doc.querySelectorAll('button')].find((el) => text(el).includes('Payment history'));
click(findByText('Payments'));
await wait(200);
const openHistory = [...doc.querySelectorAll('button')].find((el) => text(el) === 'Payment history' || text(el).includes('Payment history'));
if (openHistory) {
  click(openHistory);
  await wait(250);
  check('payment history offers a CSV export', text(doc.body).includes('Export CSV'));
  const firstTransaction = doc.querySelector('[class*="divide-y"] [class*="cursor-pointer"]');
  if (firstTransaction) {
    click(firstTransaction);
    await wait(250);
    check('receipt downloads instead of alerting', text(doc.body).includes('Download receipt'));
    const doneBtn = [...doc.querySelectorAll('button')].find((el) => text(el) === 'Done');
    if (doneBtn) click(doneBtn);
    await wait(150);
  }
}
check('payment history is reachable from payments', Boolean(historyButton));

// ---- My Profile ----
click(findByText('My Profile'));
await wait(300);
check('profile shows personal and passport details', text(doc.body).includes('Personal information') && text(doc.body).includes('Passport details'));
check('profile shows security and activity', text(doc.body).includes('Security') && text(doc.body).includes('Account activity'));

const nameInput = doc.querySelector('input[aria-label="Full legal name"]');
if (nameInput) {
  typeInto(nameInput, 'Riyad Hossain');
  await wait(120);
  const saveProfile = [...doc.querySelectorAll('button')].find((el) => text(el).includes('Save profile'));
  if (saveProfile) {
    click(saveProfile);
    await wait(300);
    check('profile changes are saved', readState().profile?.fullName === 'Riyad Hossain', readState().profile?.fullName);
  }
}

const statusSwitch = doc.querySelector('input[aria-label="Application status updates"]');
if (statusSwitch) {
  click(statusSwitch);
  await wait(250);
  check('notification preference persists', readState().preferences?.statusAlerts === false);
  click(statusSwitch);
  await wait(200);
}

// ---- Data controls ----
const clearButton = [...doc.querySelectorAll('button')].find((el) => text(el) === 'Clear all records');
if (clearButton) {
  click(clearButton);
  await wait(200);
  const confirmClear = [...doc.querySelectorAll('button')].find((el) => text(el) === 'Clear records');
  if (confirmClear) {
    click(confirmClear);
    await wait(350);
    check('client can clear the sample records', (readState().applications || []).length === 0);
    const loadDemo = [...doc.querySelectorAll('button')].find((el) => text(el) === 'Load demo records');
    if (loadDemo) {
      click(loadDemo);
      await wait(350);
      check('demo records can be loaded back', (readState().applications || []).length > 0);
    }
  }
}

window.location.hash = '';
await wait(250);
const demoButton = findByText('Preview a live digital visa pass demo');
check('demo launch button exists', Boolean(demoButton));
if (demoButton) {
  click(demoButton);
  await wait(200);
  check('digital pass demo opens', text(doc.body).includes('Tap at Consular Terminal'));
}

// Brand links must not point at Google properties
const socials = [...doc.querySelectorAll('footer a[target="_blank"]')].map((a) => a.getAttribute('href'));
check('footer social links are VisaHOBe branded', socials.every((href) => href.includes('visahobe')));
check('no uncaught runtime errors', runtimeErrors.length === 0, runtimeErrors.slice(0, 3).join(' | '));

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log('\nall DOM smoke checks passed');
