# ReponsesBunni Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a password-protected `/reponsesbunni` page that lists Supabase responses in arrival order for the owner only.

**Architecture:** A server-rendered App Router page checks an `httpOnly` signed cookie. A server action handles login/logout. Data is read through a server-only Supabase admin client that uses the service role key and keeps public RLS unchanged.

**Tech Stack:** Next.js 16 App Router, React Server Actions, `next/headers`, `next/navigation`, Supabase JS.

---

### Task 1: Authentication Helpers

**Files:**
- Create: `lib/reponsesbunni-auth.ts`
- Test: `__tests__/reponsesbunni-auth.test.ts`

**Step 1: Write the failing test**

- Assert the helper accepts the correct password.
- Assert it rejects the wrong password.
- Assert a generated session token validates.
- Assert a tampered session token is rejected.

**Step 2: Run test to verify it fails**

Run: `npm test -- --runTestsByPath __tests__/reponsesbunni-auth.test.ts`

**Step 3: Write minimal implementation**

- Add password comparison helper.
- Add deterministic signed session token helper.
- Add session validation helper.

**Step 4: Run test to verify it passes**

Run: `npm test -- --runTestsByPath __tests__/reponsesbunni-auth.test.ts`

### Task 2: Server Access Layer

**Files:**
- Create: `lib/supabase-admin.ts`

**Step 1: Implement server-only Supabase client**

- Read `SUPABASE_SERVICE_ROLE_KEY`.
- Read `SUPABASE_URL` or fallback to `NEXT_PUBLIC_SUPABASE_URL`.
- Disable auth session persistence.

### Task 3: Protected Route

**Files:**
- Create: `app/reponsesbunni/actions.ts`
- Create: `app/reponsesbunni/page.tsx`

**Step 1: Add login/logout server actions**

- Verify password on each login attempt.
- Set/delete the cookie from server actions.
- Redirect back to `/reponsesbunni`.

**Step 2: Add protected page**

- Await `cookies()` and `searchParams`.
- Show the login form when unauthenticated.
- Fetch rows ordered by `created_at` ascending when authenticated.
- Render a simple table with `created_at`, `age`, `gender`, and `wish`.

### Task 4: Verification

**Files:**
- Verify: `app/reponsesbunni/page.tsx`
- Verify: `app/reponsesbunni/actions.ts`
- Verify: `lib/reponsesbunni-auth.ts`
- Verify: `lib/supabase-admin.ts`

**Step 1: Run targeted tests**

Run: `npm test -- --runTestsByPath __tests__/reponsesbunni-auth.test.ts`

**Step 2: Run production build**

Run: `npm run build`

**Step 3: Inspect git diff**

Run: `git diff -- app/reponsesbunni app lib __tests__ docs/plans`
