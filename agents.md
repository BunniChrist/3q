# Agent Guidelines

You are a coding agent working on the **3q** project. Read this file entirely before starting.

## Project

3q is an anonymous web form (Next.js + Tailwind + Supabase). Users submit age, gender, and a wish. The app stores **only** these three fields plus an id and timestamp. Anonymity must be technically verifiable in code: no IP logging, no metadata, no analytics, no identifying cookies.

## Superpowers Framework

You MUST use the superpowers skills. At the start of your work:
1. Read `skills/superpowers/using-superpowers/SKILL.md`
2. Announce which superpowers skill(s) you are using
3. Follow the skill instructions exactly

Mandatory skills for this work:
- `skills/superpowers/writing-plans/SKILL.md` — plan before coding
- `skills/superpowers/executing-plans/SKILL.md` — follow the plan
- `skills/superpowers/using-git-worktrees/SKILL.md` — work in an isolated worktree
- `skills/superpowers/test-driven-development/SKILL.md` — TDD is mandatory
- `skills/superpowers/systematic-debugging/SKILL.md` — debug methodically
- `skills/superpowers/verification-before-completion/SKILL.md` — verify before declaring done
- `skills/superpowers/finishing-a-development-branch/SKILL.md` — clean up before merge

## Git Workflow

- Always work on the branch specified in your prompt (default: `feature/init-3q`)
- Commit frequently (after each passing test)
- Commit message format: `feat: short description` or `fix: short description`
- Do NOT push to remote — the supervisor handles that

## Autonomy

You have FULL autonomy on all reversible decisions:
- Choice of library (form lib, validation lib, UI primitives)
- Code structure and patterns
- Test strategy details
- File naming within the specified directories

Do NOT ask questions. Make the best decision and move forward.

## Quality Standards

- DRY, YAGNI, clean and readable code
- No dead code, no commented-out code
- No TODO/FIXME left behind

## Anonymity — Non-Negotiable Constraints

- No custom API route that logs the request body or headers
- Disable Next telemetry (`npx next telemetry disable`)
- Never call `headers()`, read `request.ip`, `x-forwarded-for`, cookies, or identifying localStorage
- No third-party analytics or tracking script
- Insertion to Supabase happens client-side via `@supabase/supabase-js` with the anon key
- RLS: `anon` role has INSERT-only on `responses`, no SELECT/UPDATE/DELETE
- Public count exposed via a dedicated view or RPC (count only)
- Add a comment `// anonymat: aucune métadonnée stockée` at every relevant boundary

## Credentials

All API keys are in `/root/SECRETS.md`. Read this file when you need Supabase, Coolify, or GitHub credentials.

## Verification Before Completion

Before declaring your work done:
1. `npm run build` passes
2. All tests pass
3. SQL migration applied and verified on Supabase
4. Manual smoke test of the full 2-step tunnel
5. Audit: `grep -rE "request\\.ip|x-forwarded-for|headers\\(\\)|cookies\\(\\)|analytics" .` returns no suspicious usage
6. No TODO/FIXME left behind
7. Clean git status, branch ready for PR
