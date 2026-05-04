# 3q

Application web de formulaire **100% anonyme** (Next.js + Tailwind + Supabase). Aucune donnée d'identification stockée — l'anonymat doit être techniquement vérifiable dans le code.

## Project Structure

```
app/              — Next.js App Router (pages, layout)
components/       — React components (form, progress bar, etc.)
lib/              — Supabase client, helpers
supabase/
  migrations/     — SQL migrations (table responses, RLS policies, count view)
public/           — Static assets
Dockerfile        — Multi-stage Next.js standalone build for Coolify
.env.example      — NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
skills/           — Project-specific skills
agents.md         — Coding agent guidelines
workinprogress.md — Current status / WIP
```

## Skills

Project-specific skills are in `skills/`. Includes: `superpowers`, `_plugin-context-mode`, `GitHub`, `Coolify`.

## Agent Workflow

Coding agents must read `agents.md` before starting any work.

## Context Mode

This project uses the **context-mode** plugin to protect the context window. Rules:
- Use `ctx_batch_execute` for research (commands + queries in one call)
- Use `ctx_search` for follow-up questions
- Use `ctx_execute` / `ctx_execute_file` for data processing and analysis
- Do NOT use Bash for commands producing >20 lines of output — use context-mode instead
- Do NOT use Read for analysis — use `ctx_execute_file` instead (Read is only for files you intend to Edit)

## Coolify

Operational notes and gotchas: see `/root/COOLIFY.md`.

## Anonymity constraints (non-negotiable)

- No custom API route that logs the request
- Next telemetry disabled
- No use of `headers()`, `request.ip`, `x-forwarded-for`, cookies, identifying localStorage
- No third-party analytics
- RLS: `anon` can INSERT only on `responses`, never SELECT/UPDATE/DELETE
- Public count exposed via a dedicated view/RPC (count only, no row data)

## Work In Progress

See `workinprogress.md` for current status.
