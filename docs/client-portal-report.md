# VisaHOBe — Client Portal update report

**Mode:** read-only / safe development (preview). No visa submission, payment, refund,
e-mail, SMS, WhatsApp message or external document transfer is produced by any code path
in this build.

**Scope:** the client portal only (`src/components/dashboard/*`, `src/lib/portal*`,
`src/lib/aiAgent.ts`). The public marketing site, admin/staff areas and other modules were
not touched.

---

## 1. What is implemented

| Area | State | Notes |
|---|---|---|
| 5-button sidebar | ✅ | Dashboard · AI Visa Agent · My Applications · Payments · My Profile |
| Notifications in top bar | ✅ | Unread badge, panel, mark-one / mark-all read |
| Log out | ✅ | Bottom of the sidebar and in the profile menu |
| Dashboard | ✅ | All 11 required blocks, every figure derived from the client's own records |
| AI Visa Agent | ✅ | Natural-language intake, country data, checklist, fee estimate, preview, approval hand-off |
| Application workflow (13 steps) | ✅ | Intake → checklist → documents → AI check → form preview → fees → approval |
| Client approval system | ✅ | Versioned approval record with timestamp + summary; correction requests |
| My Applications | ✅ | 6 status filters, 8 record fields per application, 7 actions |
| Document management | ✅ (metadata) | Upload validation, categories, dates, verification, rejection reason, expiry, history |
| Payments | ✅ preview | Fee breakdown, invoices, receipts, refund review via support; gateway disabled |
| Application tracking | ✅ | 14 statuses with AI / staff / provider source labels |
| My Profile | ✅ | Personal, passport, contact, address, verification, security, activity, preferences |
| Notifications & communication architecture | ✅ | In-app delivery live; e-mail/SMS/WhatsApp prepared and disabled |
| Appointments | ✅ preview | View, reschedule request, cancellation request (recorded only) |
| Support | ✅ | Create request, threads, statuses, simulated acknowledgement, close |
| Security | ✅ | Client-ID namespacing, masked passport data, activity log, session info, error boundary |
| Database structures | ✅ proposal | `db/portal-schema.sql` (tables, FKs, checks, RLS) |

## 2. Read-only guarantees enforced in code

- `estimateFees()` is a configured fee table — no provider call.
- `actions.approvePreview()` writes a **local approval record**; `submissionStatus` stays
  `not_submitted` / `ready_for_staff_review`. Nothing is sent anywhere.
- Payment buttons call `notify('Payment gateway is disabled in preview mode…')`.
- Document upload keeps **metadata only** (name, MIME, size) — no file body is uploaded.
- Support/notification copy states that e-mail/SMS/WhatsApp are suppressed.
- Every status chip carries its source: `AI-generated`, `VisaHOBe staff (simulated)` or
  `Provider status (simulated)`. No simulated status is presented as a government update.

## 3. Test results (automated)

`npm run smoke:dom` — 65 checks, all passing in jsdom against the production bundle:

- portal loads, five sidebar items, no extra sidebar menus, log out present
- dashboard greeting, derived totals, recent activity, demo flag
- notifications bell, panel, mark-all-read
- AI agent: 10-turn intake → preview → **draft application created**, checklist opens
- applications filters, approval preview, **client approval recorded with version + timestamp**,
  correction request recorded
- document upload recorded and auto-validated
- cancellation request recorded
- payments: invoices, invoice preview, disabled gateway, refund → support ticket
- support: ticket created with simulated acknowledgement
- payment history: CSV export, receipt download
- profile: personal + passport + security sections, **profile change persisted**
- notification preference persisted, clear demo records, reload demo records

Also green: `npx tsc --noEmit`, `npm run build`, `npm run smoke` (12 public pages).

## 4. Incomplete / deliberately stubbed

1. **No real backend.** All client data lives in `localStorage` under
   `visahobe.portal.v2`. Nothing is shared between devices or browsers.
2. **Authentication** is not implemented (explicit product direction: no sign-up/sign-in
   screens). `clientId` namespacing is prepared but not enforced cryptographically.
3. **File bodies** are not stored — only metadata, so document preview shows a placeholder.
4. **AI extraction** is rule-based (file type/size validation, deterministic answers);
   there is no OCR/LLM call.
5. **Payments/refunds** are preview-only; no gateway tokenization.
6. **E-mail/SMS/WhatsApp** delivery is modelled (`notification_deliveries` table,
   channel preferences) but no provider is connected.
7. **Staff/admin review** steps are simulated in the client's local timeline.
8. **Appointment slots** are not read from a real scheduling system.

## 5. Requirements before live operation

1. **Backend + auth**: Supabase (or equivalent) with `auth.users`, `client_profiles`,
   the RLS policies in `db/portal-schema.sql`, and a JWT-based session.
2. **Private storage**: encrypted bucket for documents, signed URLs, virus scanning,
   KMS-enveloped passport data.
3. **AI provider**: server-side LLM with per-client authorization checks, plus OCR for
   document extraction; log prompts/responses in `ai_conversations` / `ai_messages`.
4. **Payment gateway**: tokenized card storage (PCI-DSS), server-side fee capture,
   idempotency keys, webhook reconciliation, refund workflow.
5. **Messaging providers**: e-mail (SES/Postmark), SMS, WhatsApp Business API with
   template approval and opt-in records.
6. **Case-management integration**: staff review queue, status webhooks from VAC/embassy
   partners, and an authorised-submission audit trail.
7. **Compliance**: GDPR/DPA data-retention policy, consent capture at submission,
   audit log retention, penetration test.
8. **Operational controls**: kill switch for submissions, rate limiting, alerting,
   and a staging environment seeded from `db/portal-schema.sql`.

## 6. Where things live

```
src/lib/portalTypes.ts        status model, document model, fee + checklist config
src/lib/portalStore.ts        persisted client state + all actions (preview mode)
src/lib/aiAgent.ts            deterministic visa agent (intake, answers, summary)
src/lib/portalMetrics.ts      dashboard/derived metrics
src/components/dashboard/     DashboardHome, DashboardAgent, DashboardApplications,
                              ApplicationDetail, DashboardPayments, DashboardSettings,
                              SupportPanel, NotificationsPanel, portalUi, error boundary
db/portal-schema.sql          proposed Postgres/Supabase schema + RLS policies
scripts/dom-smoke.mjs         portal regression suite (65 checks)
```
