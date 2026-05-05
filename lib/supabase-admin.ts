import "server-only";

import { createClient } from "@supabase/supabase-js";

function getSupabaseServerUrl(): string {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error("SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL is required.");
  }
  return url;
}

function getSupabaseServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required.");
  }
  return key;
}

export function createSupabaseAdminClient() {
  return createClient(getSupabaseServerUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
