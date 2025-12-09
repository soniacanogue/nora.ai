import { createClient } from '@supabase/supabase-js';

// Singleton Supabase client for the frontend.
// Import this instead of creating multiple clients across the app to avoid
// multiple GoTrueClient instances sharing the same storage key.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase client created without URL/ANON key. Check VITE_ env vars.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
