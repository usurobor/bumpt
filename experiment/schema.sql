-- BUMP-101 Stone Techno experiment schema. Current-state + experiment instrumentation only.
-- No contact data: no email, no phone, no IP, no UA, no fingerprinting. Bump requests
-- dedupe per (device, member) by one random first-party online identifier.

create table if not exists members (
  id          text primary key,
  bump_name   text not null,
  pic_url     text,
  static_line text not null default 'Bump · here at Stone Techno'
);

create table if not exists exposure_sessions (
  id         uuid primary key default gen_random_uuid(),
  member_id  text not null references members(id),
  context    text not null,                      -- unprompted | after_conversation | member_directed | test | unknown
  started_at timestamptz not null default now(),
  ended_at   timestamptz
);

create table if not exists scan_events (
  id         uuid primary key default gen_random_uuid(),
  scan_id    text not null,                      -- random; threads scan -> about -> bump request
  member_id  text not null references members(id),
  context    text not null default 'unknown',    -- inherited from the member's active window
  created_at timestamptz not null default now()
);

create table if not exists about_events (
  id         uuid primary key default gen_random_uuid(),
  scan_id    text,
  member_id  text references members(id),
  created_at timestamptz not null default now()
);

-- A bump request ("ask to bump") — an AdmissionRequest, never membership.
-- Unique people = count(distinct device_id); per-member demand = count(*) by member_id.
-- Repeat taps from one device to the same member dedupe via unique(device_id, member_id);
-- the same device to a different member counts for that member.
create table if not exists bump_request_events (
  id         uuid primary key default gen_random_uuid(),
  device_id  text not null,                      -- anonymous first-party id; NO contact data
  member_id  text not null references members(id),
  scan_id    text not null,
  created_at timestamptz not null default now(),
  unique (device_id, member_id)
);

-- Context value guards: only the five legal exposure/scan contexts.
alter table exposure_sessions drop constraint if exists exposure_context_check;
alter table exposure_sessions add constraint exposure_context_check
  check (context in ('unprompted', 'after_conversation', 'member_directed', 'test', 'unknown'));
alter table scan_events drop constraint if exists scan_context_check;
alter table scan_events add constraint scan_context_check
  check (context in ('unprompted', 'after_conversation', 'member_directed', 'test', 'unknown'));

-- A scan_id is minted once per scan and threads the funnel; it must be unique.
create unique index if not exists scan_events_scan_id_unique on scan_events(scan_id);

-- Seed three members (edit bump_name / pic_url before the event).
insert into members (id, bump_name) values
  ('a', 'Founder A'), ('b', 'Founder B'), ('c', 'Founder C')
  on conflict (id) do nothing;

-- A dedicated test member, excluded from demand metrics (used by the live post-deploy smoke).
insert into members (id, bump_name) values
  ('test', 'QA Test Member')
  on conflict (id) do nothing;
