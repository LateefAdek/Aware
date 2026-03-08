import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client — used in client components
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Singleton for convenience in client components
export const supabase = createClient();
