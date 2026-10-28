# ADR-001 · TanStack Start, single deploy on Vercel

**Status:** Accepted · 2026-10-27

## Context
Requirement: full TypeScript, no separate backend, deploy once. Need SSR (shareable, SEO-able track pages), typed routing with search params, and server-side logic for quiz grading.

## Options
1. **TanStack Start v1** (Vite + Nitro, server functions, TanStack Router/Query)
2. Next.js App Router
3. SPA + separate Hono API

## Decision
TanStack Start. It's what the user asked for, and it fits: type-safe URL state for filters/scopes, server functions remove the API layer, TanStack Query integration handles optimistic ticks well, and Nitro presets keep hosting portable.

Host on **Vercel** (Nitro preset) with **Neon** Postgres and **Upstash** Redis. All three have free tiers and serverless drivers.

## Consequences
- One repo, one deploy, one language.
- Portable: switching to Cloudflare Workers means replacing `nitro()` with `@cloudflare/vite-plugin` and keeping HTTP-based DB/Redis drivers.
- Start's RSC support is still landing in v1.x. We don't depend on it.
