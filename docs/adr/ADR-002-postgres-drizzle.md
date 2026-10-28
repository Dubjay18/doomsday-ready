# ADR-002 · Postgres (Neon) + Drizzle

**Status:** Accepted · 2026-10-27

**Decision:** Postgres on Neon, accessed with Drizzle ORM (`drizzle-orm/neon-serverless` with a pooled connection for transactions).

**Why:** relational data (users ↔ titles ↔ questions ↔ sessions), unique constraints do the idempotency work, Neon branches give per-preview databases, and Drizzle gives TS-first schema + SQL-like queries without codegen.

**Rejected:** SQLite/Turso (fine, but weaker on `FOR UPDATE`-style session locking), Firebase/Supabase realtime (more platform than needed).
