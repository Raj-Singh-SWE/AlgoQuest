/**
 * AlgoQuest Supabase Configuration & Client Manager
 * Handles Supabase v2 client initialization, credential persistence in localStorage,
 * database connectivity testing, and SQL schema export for setup.
 */

class SupabaseManager {
  constructor() {
    // Default / fallback credentials (can also be pasted into settings in-app)
    this.defaultUrl = "https://YOUR_PROJECT_ID.supabase.co";
    this.defaultAnonKey = "YOUR_SUPABASE_ANON_KEY";

    this.client = null;
    this.isReady = false;
    this.init();
  }

  init() {
    const creds = this.getCredentials();
    if (this.isValidUrl(creds.url) && this.isValidKey(creds.anonKey)) {
      try {
        if (window.supabase && typeof window.supabase.createClient === 'function') {
          this.client = window.supabase.createClient(creds.url, creds.anonKey, {
            auth: {
              persistSession: true,
              autoRefreshToken: true,
              detectSessionInUrl: true
            }
          });
          this.isReady = true;
          console.info('[Supabase] Initialized client for:', creds.url);
        }
      } catch (err) {
        console.warn('[Supabase] Initialization error:', err.message);
        this.isReady = false;
      }
    } else {
      this.isReady = false;
    }
  }

  getCredentials() {
    const savedUrl = localStorage.getItem('algoquest_supabase_url');
    const savedKey = localStorage.getItem('algoquest_supabase_anon_key');
    return {
      url: savedUrl || this.defaultUrl,
      anonKey: savedKey || this.defaultAnonKey
    };
  }

  saveCredentials(url, anonKey) {
    if (!this.isValidUrl(url)) {
      throw new Error('Please enter a valid Supabase project URL (e.g. https://your-project.supabase.co)');
    }
    if (!this.isValidKey(anonKey)) {
      throw new Error('Please enter a valid Supabase anon public API key.');
    }

    localStorage.setItem('algoquest_supabase_url', url.trim());
    localStorage.setItem('algoquest_supabase_anon_key', anonKey.trim());
    this.init();
    return true;
  }

  clearCredentials() {
    localStorage.removeItem('algoquest_supabase_url');
    localStorage.removeItem('algoquest_supabase_anon_key');
    this.client = null;
    this.isReady = false;
  }

  getClient() {
    if (!this.client && this.isConfigured()) {
      this.init();
    }
    return this.client;
  }

  isConfigured() {
    const creds = this.getCredentials();
    return this.isValidUrl(creds.url) && this.isValidKey(creds.anonKey);
  }

  isValidUrl(url) {
    return url && typeof url === 'string' && url.startsWith('https://') && url.includes('.supabase.co') && !url.includes('YOUR_PROJECT_ID');
  }

  isValidKey(key) {
    return key && typeof key === 'string' && key.length > 25 && !key.includes('YOUR_SUPABASE_ANON_KEY');
  }

  // Live test of database connectivity
  async testConnection() {
    if (!this.isConfigured()) {
      return { ok: false, message: 'Please enter your Supabase Project URL and Anon Key first.' };
    }
    const client = this.getClient();
    if (!client) {
      return { ok: false, message: 'Supabase client could not be instantiated.' };
    }

    try {
      // Query the profiles table (limit 1)
      const { data, error } = await client.from('profiles').select('id').limit(1);
      if (error) {
        // If table doesn't exist yet, connection is valid but table needs creation
        if (error.code === '42P01' || error.message.includes('relation "public.profiles" does not exist')) {
          return {
            ok: true,
            warning: true,
            message: 'Connected to Supabase! However, the "profiles" table is not created yet. Please run the SQL setup script.'
          };
        }
        return { ok: false, message: `Database error: ${error.message}` };
      }
      return { ok: true, message: 'Successfully connected to Supabase Database!' };
    } catch (err) {
      return { ok: false, message: `Network/connection error: ${err.message}` };
    }
  }

  // Complete SQL Schema script ready for the Supabase SQL Editor
  getSQLSchema() {
    return `-- =========================================================
-- ALGOQUEST: SUPABASE POSTGRESQL SCHEMA FOR USER PROFILES
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- =========================================================

-- 1. Create the profiles table
create table if not exists public.profiles (
  id text primary key,
  email text,
  display_name text,
  avatar_url text,
  xp integer default 0,
  level integer default 1,
  gold integer default 0,
  player_hp integer default 100,
  player_max_hp integer default 100,
  current_level_id text default 'level-1',
  completed_levels jsonb default '[]'::jsonb,
  relics jsonb default '[]'::jsonb,
  lang_completions jsonb default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Policy: Allow public read & write access for authenticated users & game sessions
create policy "Allow read access to profiles" 
  on public.profiles for select 
  using (true);

create policy "Allow insert & update to profiles" 
  on public.profiles for all 
  using (true) 
  with check (true);

-- 4. Enable real-time updates (Optional)
alter publication supabase_realtime add table public.profiles;
`;
  }
}

window.supabaseManager = new SupabaseManager();
