# ADR-003 · Leaderboard = Redis projection of a Postgres XP ledger

**Status:** Accepted · 2026-10-27

**Decision:** `xp_events` (append-only, unique per reason+ref) is the source of truth. `user_stats` is updated in the same transaction. Upstash Redis sorted sets (`lb:global`, `lb:week:{w}`, `lb:country:{cc}`, `lb:daily:{d}`) are projections, updated after commit. If Redis is unavailable, reads fall back to indexed SQL on `user_stats`. `scripts/rebuild-stats.ts` can rebuild both from the ledger.

**Consequences:** XP can never be double-counted; Redis loss is an inconvenience, not data loss. Unticking a title does not remove XP (append-only), which is a documented product rule.
