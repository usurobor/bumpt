import { neon } from '@neondatabase/serverless';

// DATABASE_URL is injected by the Vercel Postgres (Neon) integration.
// Lazy: no connection is made until a query runs (build stays offline).
export const sql = neon(process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? 'postgres://invalid/none');
