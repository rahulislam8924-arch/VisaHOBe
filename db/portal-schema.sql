-- =====================================================================
-- VisaHOBe — Client Portal data structures (non-destructive, additive)
--
-- Preview / safe-development mode only. This file is a *proposal* that can
-- be applied to a fresh Postgres/Supabase project. It only creates new
-- objects (CREATE TABLE IF NOT EXISTS) — no table is dropped or altered
-- destructively, and no existing row is touched.
--
-- Access model: every client-owned row carries client_id and is protected
-- by row-level security so one client can never read another client's rows.
-- Staff roles read through explicit policies; the anon key can only insert
-- into ai_conversations/ai_messages for its own client_id.
--
-- Run once against a fresh project file (policies are not IF NOT EXISTS in
-- PostgreSQL, so re-running this section will report duplicates).
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- clients
create table if not exists client_profiles (
  id                uuid primary key default gen_random_uuid(),
  auth_user_id      uuid unique not null,              -- links to auth.users
  client_ref        text unique not null,              -- e.g. client-vh-1001
  full_legal_name   text not null,
  date_of_birth     date,
  nationality       text,
  gender            text check (gender in ('Female','Male','Other','Not specified')),
  email             citext not null,
  phone             text,
  address_line1     text,
  city              text,
  region            text,
  postal_code       text,
  country           text,
  verification_status text not null default 'unverified'
                      check (verification_status in ('unverified','pending','verified')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists client_passports (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid not null references client_profiles(id) on delete cascade,
  passport_number   text not null,                     -- stored encrypted at rest
  issuing_country   text not null,
  issued_on         date,
  expires_on        date not null,
  encrypted_blob    bytea,                             -- KMS envelope-encrypted scan
  created_at        timestamptz not null default now()
);
create index if not exists client_passports_client_idx on client_passports(client_id);

-- ------------------------------------------------------------ catalogue
create table if not exists countries (
  code              text primary key,                  -- ISO-3166 alpha-2
  name              text not null,
  region            text,
  visa_required     boolean,
  submission_location text,
  processing_time   text,
  biometric_required boolean default false,
  interview_required boolean default false
);

create table if not exists visa_categories (
  id                uuid primary key default gen_random_uuid(),
  code              text unique not null,              -- tourist, business, work ...
  label             text not null,
  description       text
);

create table if not exists visa_types (
  id                uuid primary key default gen_random_uuid(),
  category_id       uuid references visa_categories(id) on delete set null,
  country_code      text references countries(code) on delete set null,
  code              text not null,
  label             text not null,
  agency_fee_usd    numeric(10,2) not null default 0,
  government_fee_usd numeric(10,2) not null default 0,
  embassy_fee_usd   numeric(10,2) not null default 0,
  additional_fee_usd numeric(10,2) not null default 0,
  unique (code, country_code)
);

create table if not exists document_requirements (
  id                uuid primary key default gen_random_uuid(),
  visa_type_id      uuid references visa_types(id) on delete cascade,
  document_key      text not null,
  label             text not null,
  is_required       boolean not null default true
);

-- ---------------------------------------------------------- applications
create table if not exists applications (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid not null references client_profiles(id) on delete cascade,
  public_ref        text unique not null,              -- VH-XXXXXX shown in the portal
  country_code      text references countries(code) on delete set null,
  visa_category_id  uuid references visa_categories(id) on delete set null,
  visa_type_id      uuid references visa_types(id) on delete set null,
  status            text not null default 'draft',
  version           integer not null default 1,
  submission_status text not null default 'not_submitted'
                      check (submission_status in ('not_submitted','ready_for_staff_review','submitted_simulated')),
  travel_purpose    text,
  travel_date_from  date,
  travel_date_to    date,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists applications_client_idx on applications(client_id, updated_at desc);

create table if not exists applicant_information (
  application_id    uuid primary key references applications(id) on delete cascade,
  full_name         text not null,
  date_of_birth     date,
  nationality       text,
  gender            text,
  email             citext,
  phone             text,
  passport_number   text,
  passport_expiry   date,
  passport_issue_country text
);

create table if not exists application_status_history (
  id                uuid primary key default gen_random_uuid(),
  application_id    uuid not null references applications(id) on delete cascade,
  status            text not null,
  source            text not null check (source in ('ai','staff','provider')),
  note              text,
  created_by        uuid,
  created_at        timestamptz not null default now()
);
create index if not exists status_history_application_idx on application_status_history(application_id, created_at);

create table if not exists application_versions (
  id                uuid primary key default gen_random_uuid(),
  application_id    uuid not null references applications(id) on delete cascade,
  version           integer not null,
  snapshot          jsonb not null,
  created_at        timestamptz not null default now(),
  unique (application_id, version)
);

-- -------------------------------------------------------------- documents
create table if not exists documents (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid not null references client_profiles(id) on delete cascade,
  application_id    uuid references applications(id) on delete cascade,
  document_key      text not null,
  label             text not null,
  is_required       boolean not null default true,
  storage_path      text,                               -- private bucket path
  file_name         text,
  mime_type         text,
  file_size         bigint,
  expiry_date       date,
  status            text not null default 'missing'
                      check (status in ('missing','uploaded','under_review','verified','rejected','expired')),
  uploaded_at       timestamptz,
  created_at        timestamptz not null default now()
);
create index if not exists documents_client_idx on documents(client_id);
create index if not exists documents_application_idx on documents(application_id);

create table if not exists document_verifications (
  id                uuid primary key default gen_random_uuid(),
  document_id       uuid not null references documents(id) on delete cascade,
  decision          text not null check (decision in ('verified','rejected')),
  reason            text,
  source            text not null default 'ai' check (source in ('ai','staff')),
  verified_by       uuid,
  created_at        timestamptz not null default now()
);

-- -------------------------------------------------------- AI conversations
create table if not exists ai_conversations (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid not null references client_profiles(id) on delete cascade,
  application_id    uuid references applications(id) on delete set null,
  started_at        timestamptz not null default now(),
  ended_at          timestamptz
);
create index if not exists ai_conversations_client_idx on ai_conversations(client_id);

create table if not exists ai_messages (
  id                uuid primary key default gen_random_uuid(),
  conversation_id   uuid not null references ai_conversations(id) on delete cascade,
  role              text not null check (role in ('client','agent','system')),
  content           text not null,
  created_at        timestamptz not null default now()
);

create table if not exists ai_tasks (
  id                uuid primary key default gen_random_uuid(),
  application_id    uuid not null references applications(id) on delete cascade,
  task              text not null,                      -- extract_fields, validate_documents ...
  status            text not null default 'queued'
                      check (status in ('queued','running','done','failed')),
  result            jsonb,
  created_at        timestamptz not null default now()
);

-- ------------------------------------------------------ client approvals
create table if not exists client_approvals (
  id                uuid primary key default gen_random_uuid(),
  application_id    uuid not null references applications(id) on delete cascade,
  client_id         uuid not null references client_profiles(id) on delete cascade,
  version           integer not null,
  status            text not null check (status in ('pending','approved','correction_requested')),
  summary           text,
  note              text,
  requested_at      timestamptz,
  approved_at       timestamptz,
  created_at        timestamptz not null default now()
);

-- --------------------------------------------------------------- payments
create table if not exists invoices (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid not null references client_profiles(id) on delete cascade,
  application_id    uuid references applications(id) on delete set null,
  invoice_ref       text unique not null,
  agency_fee_usd    numeric(10,2) not null default 0,
  government_fee_usd numeric(10,2) not null default 0,
  embassy_fee_usd   numeric(10,2) not null default 0,
  additional_fee_usd numeric(10,2) not null default 0,
  currency          text not null default 'USD',
  status            text not null default 'draft'
                      check (status in ('draft','preview','paid_simulated','refund_requested')),
  created_at        timestamptz not null default now()
);

create table if not exists payments (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid not null references client_profiles(id) on delete cascade,
  invoice_id        uuid references invoices(id) on delete set null,
  provider          text not null default 'sandbox',
  provider_ref      text,
  amount            numeric(10,2) not null,
  currency          text not null default 'USD',
  status            text not null default 'preview'
                      check (status in ('preview','authorised_simulated','captured_simulated','refunded_simulated','failed')),
  created_at        timestamptz not null default now()
);

create table if not exists refund_requests (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid not null references client_profiles(id) on delete cascade,
  payment_id        uuid references payments(id) on delete set null,
  reason            text not null,
  status            text not null default 'requested'
                      check (status in ('requested','acknowledged','declined','refunded_simulated')),
  created_at        timestamptz not null default now()
);

-- ----------------------------------------------------------- appointments
create table if not exists appointments (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid not null references client_profiles(id) on delete cascade,
  application_id    uuid references applications(id) on delete cascade,
  scheduled_for     timestamptz not null,
  location          text,
  status            text not null default 'scheduled'
                      check (status in ('scheduled','reschedule_requested','cancel_requested','completed','cancelled')),
  created_at        timestamptz not null default now()
);

create table if not exists service_requests (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid not null references client_profiles(id) on delete cascade,
  application_id    uuid references applications(id) on delete set null,
  type              text not null check (type in ('appointment_reschedule','appointment_cancel','cancellation','refund','correction')),
  note              text,
  status            text not null default 'requested' check (status in ('requested','acknowledged')),
  created_at        timestamptz not null default now()
);

-- --------------------------------------------------------- notifications
create table if not exists notifications (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid not null references client_profiles(id) on delete cascade,
  application_id    uuid references applications(id) on delete set null,
  kind              text not null,
  title             text not null,
  body              text not null,
  read_at           timestamptz,
  created_at        timestamptz not null default now()
);
create index if not exists notifications_client_idx on notifications(client_id, created_at desc);

create table if not exists notification_deliveries (
  id                uuid primary key default gen_random_uuid(),
  notification_id   uuid not null references notifications(id) on delete cascade,
  channel           text not null check (channel in ('email','sms','whatsapp','push')),
  status            text not null default 'queued'
                      check (status in ('queued','sent_simulated','suppressed','failed')),
  provider_ref      text,
  created_at        timestamptz not null default now()
);

-- --------------------------------------------------------------- support
create table if not exists support_conversations (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid not null references client_profiles(id) on delete cascade,
  application_id    uuid references applications(id) on delete set null,
  subject           text not null,
  status            text not null default 'open' check (status in ('open','awaiting_client','closed')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists support_messages (
  id                uuid primary key default gen_random_uuid(),
  conversation_id   uuid not null references support_conversations(id) on delete cascade,
  author_role       text not null check (author_role in ('client','support')),
  author_id         uuid,
  body              text not null,
  created_at        timestamptz not null default now()
);

-- ------------------------------------------------------------- auditing
create table if not exists client_activity_logs (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid not null references client_profiles(id) on delete cascade,
  application_id    uuid references applications(id) on delete set null,
  action            text not null,
  detail            text,
  ip_address        inet,
  created_at        timestamptz not null default now()
);

-- =====================================================================
-- Row-level security (one client can never see another client's rows)
-- =====================================================================
alter table client_profiles          enable row level security;
alter table client_passports         enable row level security;
alter table applications             enable row level security;
alter table applicant_information    enable row level security;
alter table application_status_history enable row level security;
alter table application_versions     enable row level security;
alter table documents                enable row level security;
alter table document_verifications   enable row level security;
alter table ai_conversations         enable row level security;
alter table ai_messages              enable row level security;
alter table ai_tasks                 enable row level security;
alter table client_approvals         enable row level security;
alter table invoices                 enable row level security;
alter table payments                 enable row level security;
alter table refund_requests          enable row level security;
alter table appointments             enable row level security;
alter table service_requests          enable row level security;
alter table notifications            enable row level security;
alter table support_conversations     enable row level security;
alter table support_messages          enable row level security;
alter table client_activity_logs      enable row level security;

-- helper: current client id from the auth token
create or replace function current_client_id() returns uuid
language sql stable as $$
  select id from client_profiles where auth_user_id = auth.uid()
$$;

-- client-owned tables: full access to own rows only
do $$
declare t text;
begin
  foreach t in array array[
    'client_passports','applications','documents','ai_conversations','invoices',
    'payments','refund_requests','appointments','service_requests','notifications',
    'support_conversations','client_activity_logs'
  ]
  loop
    execute format(
      'create policy %I_client_all on %I for all using (client_id = current_client_id()) with check (client_id = current_client_id())',
      t, t
    );
  end loop;
end $$;

create policy client_profiles_self on client_profiles
  for all using (id = current_client_id()) with check (auth_user_id = auth.uid());

-- child tables inherit access through their parent application
create policy applicant_information_owner on applicant_information
  for all using (exists (
    select 1 from applications a where a.id = application_id and a.client_id = current_client_id()
  ));

create policy status_history_owner on application_status_history
  for all using (exists (
    select 1 from applications a where a.id = application_id and a.client_id = current_client_id()
  ));

create policy versions_owner on application_versions
  for all using (exists (
    select 1 from applications a where a.id = application_id and a.client_id = current_client_id()
  ));

create policy document_verifications_owner on document_verifications
  for all using (exists (
    select 1 from documents d where d.id = document_id and d.client_id = current_client_id()
  ));

create policy ai_tasks_owner on ai_tasks
  for all using (exists (
    select 1 from applications a where a.id = application_id and a.client_id = current_client_id()
  ));

create policy approvals_owner on client_approvals
  for all using (client_id = current_client_id());

create policy ai_messages_owner on ai_messages
  for all using (exists (
    select 1 from ai_conversations c where c.id = conversation_id and c.client_id = current_client_id()
  ));

create policy support_messages_owner on support_messages
  for all using (exists (
    select 1 from support_conversations c where c.id = conversation_id and c.client_id = current_client_id()
  ));

-- staff role (read + status updates) — separate role, never the anon key
-- create policy staff_read on applications for select using (auth.jwt() ->> 'role' = 'staff');

-- =====================================================================
-- Private document storage
-- =====================================================================
-- insert into storage.buckets (id, name, public) values ('client-documents','client-documents', false);
-- create policy documents_owner_read on storage.objects for select
--   using (bucket_id = 'client-documents' and (storage.foldername(name))[1] = current_client_id()::text);
-- create policy documents_owner_write on storage.objects for insert
--   with check (bucket_id = 'client-documents' and (storage.foldername(name))[1] = current_client_id()::text);
