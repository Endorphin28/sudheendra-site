import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side (service role — bypasses RLS).
// Next.js 14 caches fetch() by default; database reads must always be fresh.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
});
