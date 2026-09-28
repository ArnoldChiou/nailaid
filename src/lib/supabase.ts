import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** False until the Supabase project exists; the site then runs in demo mode. */
export const isConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (!isConfigured) throw new Error("Supabase 尚未設定");
  client ??= createClient(url!, anonKey!);
  return client;
}

export const PHOTO_BUCKET = "booking-photos";
