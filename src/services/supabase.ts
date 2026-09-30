import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { storage } from './storage';

let supabaseClient: SupabaseClient | null = null;
let currentSupabaseUrl = '';
let currentSupabaseKey = '';

export async function getSupabaseClient(): Promise<SupabaseClient | null> {
  const settings = await storage.getSettings();
  const url = settings.supabase_url || (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const key = settings.supabase_anon_key || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  if (!url || !key) {
    return null;
  }

  if (!supabaseClient || currentSupabaseUrl !== url || currentSupabaseKey !== key) {
    try {
      supabaseClient = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      currentSupabaseUrl = url;
      currentSupabaseKey = key;
    } catch (e) {
      console.warn('Could not initialize Supabase client:', e);
      return null;
    }
  }

  return supabaseClient;
}

export async function getCurrentUser(): Promise<User | null> {
  const client = await getSupabaseClient();
  if (!client) {
    // Check if we have a local guest user profile stored in localStorage
    const localUser = localStorage.getItem('fic_local_user');
    if (localUser) {
      try {
        return JSON.parse(localUser);
      } catch {
        return null;
      }
    }
    return null;
  }

  try {
    const { data: { user } } = await client.auth.getUser();
    return user;
  } catch (err) {
    console.warn('Error fetching Supabase user:', err);
    return null;
  }
}

export async function syncOfflineQueue(): Promise<{ success: boolean; message: string; syncedCount: number }> {
  const client = await getSupabaseClient();
  if (!client) {
    return {
      success: true,
      message: 'Running in Local Offline Mode. Data is safely stored in your browser.',
      syncedCount: 0
    };
  }

  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    return {
      success: true,
      message: 'Signed in locally. Connect an account to enable cloud synchronization.',
      syncedCount: 0
    };
  }

  const queue = await storage.getSyncQueue();
  if (queue.length === 0) {
    return {
      success: true,
      message: 'All records are up to date.',
      syncedCount: 0
    };
  }

  let processedCount = 0;
  try {
    for (const item of queue) {
      const payload = { ...item.payload, user_id: user.id };
      
      let error = null;
      if (item.operation === 'INSERT' || item.operation === 'UPDATE') {
        const res = await client.from(item.table_name).upsert(payload);
        error = res.error;
      } else if (item.operation === 'DELETE') {
        const res = await client.from(item.table_name).delete().eq('id', item.payload.id);
        error = res.error;
      }

      if (!error) {
        await storage.removeSyncQueueItem(item.id);
        processedCount++;
      } else {
        console.warn(`Sync failed for ${item.table_name}:`, error.message);
      }
    }

    const settings = await storage.getSettings();
    settings.last_synced_at = new Date().toISOString();
    await storage.saveSettings(settings);

    return {
      success: true,
      message: `Sync completed. ${processedCount} items synchronized.`,
      syncedCount: processedCount
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'Unable to synchronize. Your local information is safe and will be retried later.',
      syncedCount: processedCount
    };
  }
}
