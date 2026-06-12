-- BUMP-101 Stone Techno experiment schema. Current-state + experiment instrumentation only.
-- No personal data: no email, no IP, no fingerprinting. want-ins dedupe by an anonymous id.

create table if not exists members (
  id          text primary key,
  bump_name   text not null,
  pic_url     text,
  static_line text not null default 'Bump · here at Stone Techno'
);

create table if not exists exposure_sessions (
  id         uuid primary key default gen_random_uuid(),
  member_id  text not null references members(id),
  context    text not null,                      -- unprompted | after_conversation | member_directed | test
  started_at timestamptz not null default now(),
  ended_at   timestamptz
);

create table if not exists scan_events (
  id         uuid primary key default gen_random_uuid(),
  scan_id    text not null,                      -- random; threads scan -> about -> want-in
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

create table if not exists want_ins (
  id         uuid primary key default gen_random_uuid(),
  device_id  text not null unique,               -- anonymous first-party id; dedupes repeat taps; NO PII
  member_id  text references members(id),
  scan_id    text,
  created_at timestamptz not null default now()
);

-- Seed three members (edit bump_name / pic_url before the event).
insert into members (id, bump_name) values
  ('a', 'Founder A'), ('b', 'Founder B'), ('c', 'Founder C')
  on conflict (id) do nothing;
