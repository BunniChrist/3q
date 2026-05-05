# 3q — Work In Progress

> Last updated: 2026-05-05

## Current status
- Branch: `feature/init-3q` — ready for review & merge
- Stack: Next.js 16 (App Router) + Tailwind + Supabase + Coolify
- Anonymity: technically enforced (no IP, no metadata, RLS INSERT-only)

## Completed

### Project setup (2026-05-05)
- [x] Project structure created (CLAUDE.md, agents.md, skills/)
- [x] Skills installed: superpowers, _plugin-context-mode, GitHub, Coolify
<<<<<<< HEAD
- [x] GitHub repo BunniChrist/3q created (private, default branch `main`)
- [x] Initial commit pushed
- [x] Agent prompt written to `PROMPT.md`

### Full implementation (2026-05-05) — branch feature/init-3q
- [x] Next.js 16 initialized (App Router, Tailwind, TypeScript)
- [x] Supabase migration applied: table `responses` + RLS policy `anon_insert` (INSERT only) + view `responses_count`
- [x] `lib/supabase.ts` — anonymous client (anon key only)
- [x] `app/layout.tsx` — dark mode, no analytics, no tracking
- [x] `app/page.tsx` — home page with anonymity guarantees + progress bar X/500 + CTA
- [x] `app/formulaire/page.tsx` — 2-step form tunnel (input → recap → thank you)
- [x] `Dockerfile` — multi-stage standalone build, NEXT_TELEMETRY_DISABLED
- [x] `next.config.ts` — output: standalone
- [x] `.env.example` + `.env.local` (gitignored)
- [x] Jest tests: 27/27 passing
  - validation.test.ts (14 tests — age, gender, wish)
  - anonymity.test.ts (7 tests — payload has no IP/cookie/fingerprint)
  - rls.test.ts (4 tests — anon INSERT ✓, anon SELECT blocked ✓, count view ✓, admin SELECT ✓)
- [x] Anonymity audit clean (no request.ip, x-forwarded-for, headers(), cookies(), analytics)
- [x] Build: `npm run build` succeeds

## Next steps
- Merge `feature/init-3q` into `main`
- Create GitHub repo (BunniChrist/3q)
- Push + deploy via Coolify
