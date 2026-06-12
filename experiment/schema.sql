-- BUMP-101 Stone Techno experiment schema. Current-state + experiment instrumentation only.
-- No IP, user agent, ad pixels, or behavioral analytics are stored.

create table if not exists members (
  id          text primary key,                 -- url slug (e.g. 'a','b','c')
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
  scan_id    text not null,                      -- random; threads scan -> about -> request
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

create table if not exists consent_versions (
  version    text primary key,
  body       text not null,
  created_at timestamptz not null default now()
);

create table if not exists bump_requests (
  id               uuid primary key default gen_random_uuid(),
  email            text not null unique,         -- unique => dedupes demand
  member_id        text references members(id),
  scan_id          text,
  consent_version  text references consent_versions(version),
  created_at       timestamptz not null default now()
);

-- Seed: consent text (keep in sync with the About form copy) and three members.
insert into consent_versions (version, body) values
  ('v1', 'We''ll only use your email to tell you where to find a future Bump. Leaving your email does not make you a member. You can ask us to delete it any time.')
  on conflict (version) do nothing;

insert into members (id, bump_name) values
  ('a', 'Founder A'), ('b', 'Founder B'), ('c', 'Founder C')
  on conflict (id) do nothing;
