import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Cookie-free, read-only Supabase client for PUBLIC catalog data (categories,
 * products, images). It acts as the anonymous role, so Row Level Security
 * decides what it can see. Safe to use inside "use cache" functions, because
 * it never reads cookies or headers. Never use it for guest chat or admin.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill them in.",
    );
  }
  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}