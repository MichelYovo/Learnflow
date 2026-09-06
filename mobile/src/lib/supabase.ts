import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? "";
const supabaseAnonKey = (
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  ""
).trim();

export const isSupabaseConfigured =
  /^https?:\/\//i.test(supabaseUrl) &&
  !supabaseUrl.includes("YOUR_PROJECT_REF") &&
  supabaseAnonKey.length > 0 &&
  !supabaseAnonKey.startsWith("sb_secret_");

function createSupabaseClient() {
  const url = isSupabaseConfigured ? supabaseUrl : "https://localhost.invalid";
  const key = isSupabaseConfigured ? supabaseAnonKey : "public-anon-key";

  return createClient(url, key, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Shared Supabase client. Auth session is persisted in AsyncStorage so
 * SyncManager can restore it silently when the device comes back online.
 */
export const supabase = createSupabaseClient();
