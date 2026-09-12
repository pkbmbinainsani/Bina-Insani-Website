import { createClient } from '@supabase/supabase-js';

// Default project configuration specified by the user
const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env || {};

export const SUPABASE_URL =
  env.VITE_SUPABASE_URL || 'https://xinbrgiingzhdcbdoirv.supabase.co';

export const SUPABASE_ANON_KEY =
  env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_3pKDpXxjoAK8heQI-6x-Lg_BG69JFF7';

// Initialize the Supabase client with realtime enabled
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export const SUPABASE_SQL_SETUP_SCRIPT = `-- =======================================================
-- SQL SETUP UNTUK DATABASE SUPABASE PKBM BINA INSANI SUMOWONO
-- Jalankan di: https://supabase.com/dashboard/project/xinbrgiingzhdcbdoirv/sql
-- =======================================================

-- 1. Buat tabel utama pkbm_records untuk seluruh data realtime
CREATE TABLE IF NOT EXISTS public.pkbm_records (
    key TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.pkbm_records ENABLE ROW LEVEL SECURITY;

-- 3. Berikan izin akses penuh (Baca & Tulis) untuk publik dan admin
DROP POLICY IF EXISTS "Allow all access to pkbm_records" ON public.pkbm_records;
CREATE POLICY "Allow all access to pkbm_records" ON public.pkbm_records
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 4. Aktifkan Supabase Realtime Replication pada tabel
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'pkbm_records'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.pkbm_records;
  END IF;
END $$;
`;

export interface SupabaseRecord {
  key: string;
  data: any;
  updated_at?: string;
}

/**
 * Fetch a single record by key from Supabase
 */
export async function fetchRecordFromSupabase(key: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('pkbm_records')
      .select('data')
      .eq('key', key)
      .maybeSingle();

    if (error) {
      // If table doesn't exist yet, return null quietly
      if (error.code === 'PGRST205' || error.message.includes('not find')) {
        return null;
      }
      console.warn(`[Supabase] Error fetching ${key}:`, error.message);
      return null;
    }

    return data ? data.data : null;
  } catch (err) {
    console.warn(`[Supabase] Network/fetch error for ${key}:`, err);
    return null;
  }
}

/**
 * Fetch all records at once from Supabase
 */
export async function fetchAllRecordsFromSupabase(): Promise<{
  records: Record<string, any>;
  tableExists: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('pkbm_records')
      .select('key, data, updated_at');

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('not find')) {
        return { records: {}, tableExists: false, error: error.message };
      }
      return { records: {}, tableExists: true, error: error.message };
    }

    const records: Record<string, any> = {};
    if (data && Array.isArray(data)) {
      for (const row of data) {
        records[row.key] = row.data;
      }
    }

    return { records, tableExists: true };
  } catch (err: any) {
    return { records: {}, tableExists: false, error: err?.message || String(err) };
  }
}

/**
 * Upsert a record to Supabase
 */
export async function saveRecordToSupabase(key: string, value: any): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('pkbm_records')
      .upsert(
        {
          key,
          data: value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

/**
 * Broadcast a real-time event to all open devices immediately
 */
export function broadcastRealtimeUpdate(channel: any, key: string, data: any) {
  if (channel) {
    try {
      channel.send({
        type: 'broadcast',
        event: 'pkbm_sync_event',
        payload: {
          key,
          data,
          timestamp: Date.now(),
        },
      });
    } catch (e) {
      console.warn('[Supabase Realtime] Broadcast failed:', e);
    }
  }
}
