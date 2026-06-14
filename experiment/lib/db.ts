import { neon, neonConfig } from '@neondatabase/serverless';

// Local/CI only: route the HTTP driver through a local Neon proxy sitting in front
// of a plain Postgres (see experiment/.ci/docker-compose.ci.yml). Activated by
// NEON_LOCAL_PROXY; never set in production, where Vercel talks to real Neon over HTTPS.
if (process.env.NEON_LOCAL_PROXY) {
  neonConfig.fetchEndpoint = (host) => {
    const local = host === 'db.localtest.me';
    return `${local ? 'http' : 'https'}://${host}:${local ? 4444 : 443}/sql`;
  };
}

// DATABASE_URL is injected by the Vercel Postgres (Neon) integration.
// Lazy: no connection is made until a query runs (build stays offline).
// The fallback is well-formed (so neon() doesn't throw at import during an
// offline build) but unroutable (so it only ever fails if a query actually runs).
export const sql = neon(process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? 'postgresql://u:p@db.invalid/db');
