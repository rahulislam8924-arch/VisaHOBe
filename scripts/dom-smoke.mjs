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
check('190 countries in the dataset label', text(doc.body).includes('Explore all 190 Countries'));
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
const japanCard = [...doc.querySelectorAll('div')].find(
  (el) => text(el.querySelector('h3')) === 'Japan' && text(el).includes('29-Point Guide')
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

// Portal + demo modal
window.location.hash = '#dashboard';
await wait(250);
check('portal view loads', doc.title === 'VisaHOBe Client Portal');
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
