/**
 * Renders every page/portal view on the server to catch runtime errors.
 * Run with: npm run smoke
 */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import App from '../src/App';
import { GoogleWalletDashboard } from '../src/components/dashboard/GoogleWalletDashboard';
import { AboutPage } from '../src/pages/AboutPage';
import { ServicesPage } from '../src/pages/ServicesPage';
import { CountriesPage } from '../src/pages/CountriesPage';
import { WorkVisaPage } from '../src/pages/WorkVisaPage';
import { BlogPage } from '../src/pages/BlogPage';
import { AppointmentPage } from '../src/pages/AppointmentPage';
import { ContactPage } from '../src/pages/ContactPage';
import { BusinessNetworkPage } from '../src/pages/BusinessNetworkPage';
import { LegalPage } from '../src/pages/LegalPage';

const noop = () => {};

const cases: [string, React.ReactElement][] = [
  ['home', <App />],
  ['portal', <GoogleWalletDashboard onExit={noop} />],
  ['about', <AboutPage onOpenConsultation={noop} onOpenPortal={noop} />],
  ['services', <ServicesPage onBookConsultation={noop} />],
  ['countries', <CountriesPage onBookConsultation={noop} onOpenPortal={noop} />],
  ['countries (deep link)', <CountriesPage initialCountryName="Japan" onBookConsultation={noop} onOpenPortal={noop} />],
  ['work-visa', <WorkVisaPage onBookConsultation={noop} />],
  ['blog', <BlogPage onBookConsultation={noop} />],
  ['appointment', <AppointmentPage onBookingSuccess={noop} />],
  ['contact', <ContactPage />],
  ['business-network', <BusinessNetworkPage onOpenPortal={noop} />],
  ['legal', <LegalPage />],
];

let failed = 0;
for (const [name, element] of cases) {
  try {
    const html = renderToStaticMarkup(element);
    console.log(`ok    ${name.padEnd(22)} ${html.length} bytes`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL  ${name}`, error);
  }
}
if (failed > 0) process.exit(1);
