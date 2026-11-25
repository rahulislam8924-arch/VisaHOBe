# VisaHOBe — Global Visa Support Website & Client Portal

Marketing site plus a demo client portal for VisaHOBe: visa service directory, 190-country
visa guide database, work-visa information, articles, consultation booking, and a digital
portal that holds visa/pass "cards" and consular fee transactions.

Built with **React 19 + TypeScript + Vite 7 + Tailwind CSS 4**. The production build is emitted
as a single self-contained `dist/index.html` (via `vite-plugin-singlefile`) plus static assets
from `public/`.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server bound to `0.0.0.0` (works behind preview proxies) |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run smoke` | Server-renders every page/portal view and fails on runtime errors |
| `npm run smoke:dom` | Runs the app in jsdom and asserts the main user flows still work |
| `npm run qr` | Regenerates `public/visahobe-app-qr.png` (points at `https://visahobe.com/download`) |

## Routes

The site uses hash-based routing, so it can be hosted as static files without rewrite rules:

| URL | Page |
| --- | --- |
| `/` | Home (hero, destination picker, 8 feature sections, FAQ) |
| `/#about` | About & ethics |
| `/#services` | Services directory |
| `/#countries` | 190-country visa guides |
| `/#work-visa` | Work visa & overseas employment |
| `/#blog` | Visa guides & research |
| `/#appointment` | Consultation booking |
| `/#contact` | Contact & support desks |
| `/#business-network` | B2B partner network |
| `/#legal` | Policies, disclaimer, privacy, refunds |
| `/#dashboard` (or `?view=dashboard`) | Client portal demo |

## Project layout

```
index.html                 App shell, fonts, meta
src/App.tsx                Routing (hash + history), page orchestration, modals
src/components/            Marketing sections, header/footer, QR widget, dialogs
src/components/dashboard/  Client portal (layout, home, passes, payments, receipts, settings)
src/pages/                 Standalone pages
src/data/                  Country database, services, articles, FAQ, mock portal data
src/types/                 Shared TypeScript types
scripts/                   QR generator + smoke tests
public/                    Static assets (app-download QR code)
```

## Deployment

The repo is a standard Vite project at the repository root, so Vercel's **Vite** preset works
without extra configuration: build command `npm run build`, output directory `dist`.
Because all routing is hash-based, no SPA rewrites are required.

## Notes

- The portal is a front-end demo: cards, passes and transactions are local mock data
  (`src/data/dashboardMockData.ts`) and nothing is sent to a backend.
- Country guide counts in the UI are derived from `src/data/allCountriesData.ts`, so adding a
  country automatically updates every counter.
- Lottie illustrations load from Google's marketing CDN; when the network blocks them the
  components fall back to lightweight local graphics.
