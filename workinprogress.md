# 3q — Work In Progress

> Last updated: 2026-05-05

## Current status
- GitHub repo: BunniChrist/3q (private) — to be created on first push
- Stack: Next.js (App Router) + Tailwind + Supabase + Coolify
- Anonymity: technically enforced (no IP, no metadata, RLS INSERT-only)

## Completed

### Project setup (2026-05-05)
- [x] Project structure created (CLAUDE.md, agents.md, skills/)
- [x] Skills installed: superpowers, _plugin-context-mode, GitHub, Coolify
- [ ] GitHub repo created
- [ ] Initial commit pushed

## In progress
- Agent prompt prepared for `feature/init-3q` (Supabase schema + Next.js skeleton)

## Backlog
- Supabase migration: table `responses` + RLS + count view
- Next.js skeleton (App Router, Tailwind dark mode)
- Form tunnel (step 1 input, step 2 recap)
- Counter on home page (X / 500)
- Dockerfile + Coolify deployment config
- Tests (form validation, RLS policies, anonymity audit)
