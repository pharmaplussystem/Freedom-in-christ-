import { 
  JournalEntry, 
  TriggerLog, 
  Habit, 
  HabitCompletion, 
  ProgressSummary, 
  StumbleLog, 
  AccountabilityContact, 
  FastingRecord, 
  AppSettings,
  MemoryVerseProgress,
  PrayerAltarWatch
} from '../types';

const DB_NAME = 'FreedomInChristDB';
const DB_VERSION = 2;

export interface SyncQueueItem {
  id: string;
  table_name: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: any;
  created_at: string;
}

class StorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB open error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('journal')) {
          const store = db.createObjectStore('journal', { keyPath: 'id' });
          store.createIndex('created_at', 'created_at', { unique: false });
        }

        if (!db.objectStoreNames.contains('triggers')) {
          const store = db.createObjectStore('triggers', { keyPath: 'id' });
          store.createIndex('date', 'date', { unique: false });
        }

        if (!db.objectStoreNames.contains('habits')) {
          db.createObjectStore('habits', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('habit_completions')) {
          const store = db.createObjectStore('habit_completions', { keyPath: 'id' });
          store.createIndex('date_habit', ['completion_date', 'habit_id'], { unique: false });
        }

        if (!db.objectStoreNames.contains('stumbles')) {
          db.createObjectStore('stumbles', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('contacts')) {
          db.createObjectStore('contacts', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('fasting')) {
          db.createObjectStore('fasting', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('memory_verses')) {
          db.createObjectStore('memory_verses', { keyPath: 'verse_id' });
        }

        if (!db.objectStoreNames.contains('favorites')) {
          db.createObjectStore('favorites', { keyPath: 'reference' });
        }

        if (!db.objectStoreNames.contains('sync_queue')) {
          db.createObjectStore('sync_queue', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('app_state')) {
          db.createObjectStore('app_state', { keyPath: 'key' });
        }

        if (!db.objectStoreNames.contains('prayer_altars')) {
          db.createObjectStore('prayer_altars', { keyPath: 'id' });
        }
      };
    });

    return this.dbPromise;
  }

  // Generic Transaction Helpers
  private async getStore(storeName: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
    const db = await this.initDB();
    const tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  // --- SETTINGS & STATE ---
  async getSettings(): Promise<AppSettings> {
    const store = await this.getStore('app_state', 'readonly');
    return new Promise((resolve) => {
      const req = store.get('settings');
      req.onsuccess = () => {
        if (req.result && req.result.value) {
          resolve(req.result.value);
        } else {
          // Defaults
          const defaultSettings: AppSettings = {
            app_name: 'Freedom in Christ',
            theme: 'dark',
            supabase_url: (import.meta as any).env?.VITE_SUPABASE_URL || '',
            supabase_anon_key: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '',
            notifications_enabled: false,
            morning_reminder_time: '07:00',
            evening_reminder_time: '21:30',
            armor_reminder_enabled: true
          };
          resolve(defaultSettings);
        }
      };
      req.onerror = () => resolve({
        app_name: 'Freedom in Christ',
        theme: 'dark',
        supabase_url: '',
        supabase_anon_key: '',
        notifications_enabled: false,
        morning_reminder_time: '07:00',
        evening_reminder_time: '21:30',
        armor_reminder_enabled: true
      });
    });
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    const store = await this.getStore('app_state', 'readwrite');
    store.put({ key: 'settings', value: settings });
  }

  // --- PROGRESS SUMMARY ---
  async getProgressSummary(): Promise<ProgressSummary> {
    const store = await this.getStore('app_state', 'readonly');
    return new Promise((resolve) => {
      const req = store.get('progress_summary');
      req.onsuccess = () => {
        if (req.result && req.result.value) {
          const summary = req.result.value as ProgressSummary;
          // Recalculate days based on current date
          const now = new Date();
          const startPorn = new Date(summary.pornography_free_start);
          const startMast = new Date(summary.masturbation_free_start);

          const diffPorn = Math.max(0, Math.floor((now.getTime() - startPorn.getTime()) / (1000 * 60 * 60 * 24)));
          const diffMast = Math.max(0, Math.floor((now.getTime() - startMast.getTime()) / (1000 * 60 * 60 * 24)));

          summary.streak_porn_days = diffPorn;
          summary.streak_masturbation_days = diffMast;
          resolve(summary);
        } else {
          const today = new Date().toISOString();
          const initial: ProgressSummary = {
            pornography_free_start: today,
            masturbation_free_start: today,
            total_temptations_resisted: 0,
            total_armor_prayers_completed: 0,
            total_scripture_reading_days: 1,
            total_prayer_days: 1,
            streak_porn_days: 1,
            streak_masturbation_days: 1
          };
          this.saveProgressSummary(initial);
          resolve(initial);
        }
      };
      req.onerror = () => {
        resolve({
          pornography_free_start: new Date().toISOString(),
          masturbation_free_start: new Date().toISOString(),
          total_temptations_resisted: 0,
          total_armor_prayers_completed: 0,
          total_scripture_reading_days: 0,
          total_prayer_days: 0,
          streak_porn_days: 0,
          streak_masturbation_days: 0
        });
      };
    });
  }

  async saveProgressSummary(summary: ProgressSummary): Promise<void> {
    const store = await this.getStore('app_state', 'readwrite');
    store.put({ key: 'progress_summary', value: summary });
  }

  async incrementStat(stat: 'temptations' | 'armor' | 'scripture' | 'prayer'): Promise<void> {
    const current = await this.getProgressSummary();
    if (stat === 'temptations') current.total_temptations_resisted += 1;
    if (stat === 'armor') current.total_armor_prayers_completed += 1;
    if (stat === 'scripture') current.total_scripture_reading_days += 1;
    if (stat === 'prayer') current.total_prayer_days += 1;
    await this.saveProgressSummary(current);
  }

  async recordStumble(log: StumbleLog): Promise<void> {
    // 1. Save stumble log
    const stumbleStore = await this.getStore('stumbles', 'readwrite');
    stumbleStore.put(log);

    // 2. Grace-based reset of starts
    const summary = await this.getProgressSummary();
    const nowIso = new Date().toISOString();
    summary.last_fall_date = nowIso;
    summary.pornography_free_start = nowIso;
    summary.masturbation_free_start = nowIso;
    summary.streak_porn_days = 0;
    summary.streak_masturbation_days = 0;
    await this.saveProgressSummary(summary);

    // Queue sync
    await this.enqueueSync('stumbles', 'INSERT', log);
  }

  async getStumbles(): Promise<StumbleLog[]> {
    const store = await this.getStore('stumbles', 'readonly');
    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result || []).reverse());
      req.onerror = () => resolve([]);
    });
  }

  // --- JOURNAL ---
  async getJournalEntries(): Promise<JournalEntry[]> {
    const store = await this.getStore('journal', 'readonly');
    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => {
        const sorted = (req.result || []).sort(
          (a: JournalEntry, b: JournalEntry) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        resolve(sorted);
      };
      req.onerror = () => resolve([]);
    });
  }

  async saveJournalEntry(entry: JournalEntry): Promise<void> {
    const store = await this.getStore('journal', 'readwrite');
    store.put(entry);
    await this.enqueueSync('journal', 'INSERT', entry);
  }

  async deleteJournalEntry(id: string): Promise<void> {
    const store = await this.getStore('journal', 'readwrite');
    store.delete(id);
    await this.enqueueSync('journal', 'DELETE', { id });
  }

  // --- TRIGGERS ---
  async getTriggers(): Promise<TriggerLog[]> {
    const store = await this.getStore('triggers', 'readonly');
    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => {
        const sorted = (req.result || []).sort(
          (a: TriggerLog, b: TriggerLog) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        resolve(sorted);
      };
      req.onerror = () => resolve([]);
    });
  }

  async saveTrigger(trigger: TriggerLog): Promise<void> {
    const store = await this.getStore('triggers', 'readwrite');
    store.put(trigger);
    if (trigger.resisted) {
      await this.incrementStat('temptations');
    }
    await this.enqueueSync('triggers', 'INSERT', trigger);
  }

  // --- HABITS ---
  async getHabits(): Promise<Habit[]> {
    const store = await this.getStore('habits', 'readonly');
    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => {
        if (req.result && req.result.length > 0) {
          resolve(req.result);
        } else {
          // Default initial habits
          const defaults: Habit[] = [
            {
              id: 'habit-bible',
              name: 'Scripture Meditation',
              description: 'Read and soak your mind in God’s Word daily.',
              frequency: 'daily',
              category: 'spiritual',
              icon: 'book',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 'habit-prayer',
              name: 'Morning & Evening Prayer',
              description: 'Surrender your day and guard your night.',
              frequency: 'daily',
              category: 'spiritual',
              icon: 'pray',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 'habit-armor',
              name: 'Put on the Armor of God',
              description: 'Fasten the belt of truth and lift the shield of faith.',
              frequency: 'daily',
              category: 'spiritual',
              icon: 'shield',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 'habit-sleep-boundary',
              name: 'Device-Free Bedroom',
              description: 'Charge phone outside the bedroom overnight.',
              frequency: 'daily',
              category: 'physical',
              icon: 'moon',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 'habit-exercise',
              name: 'Physical Exercise',
              description: 'Channel bodily energy into physical health.',
              frequency: 'daily',
              category: 'physical',
              icon: 'activity',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 'habit-accountability',
              name: 'Accountability Check-In',
              description: 'Stay in the light with a trusted brother/partner.',
              frequency: 'weekly',
              category: 'accountability',
              icon: 'users',
              active: true,
              created_at: new Date().toISOString()
            }
          ];
          this.initHabits(defaults);
          resolve(defaults);
        }
      };
      req.onerror = () => resolve([]);
    });
  }

  private async initHabits(habits: Habit[]): Promise<void> {
    const store = await this.getStore('habits', 'readwrite');
    for (const h of habits) {
      store.put(h);
    }
  }

  async saveHabit(habit: Habit): Promise<void> {
    const store = await this.getStore('habits', 'readwrite');
    store.put(habit);
    await this.enqueueSync('habits', 'INSERT', habit);
  }

  async getHabitCompletions(dateStr: string): Promise<HabitCompletion[]> {
    const store = await this.getStore('habit_completions', 'readonly');
    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => {
        const matches = (req.result || []).filter((c: HabitCompletion) => c.completion_date === dateStr);
        resolve(matches);
      };
      req.onerror = () => resolve([]);
    });
  }

  async toggleHabitCompletion(habitId: string, dateStr: string): Promise<boolean> {
    const completions = await this.getHabitCompletions(dateStr);
    const existing = completions.find(c => c.habit_id === habitId);
    const store = await this.getStore('habit_completions', 'readwrite');

    if (existing) {
      store.delete(existing.id);
      await this.enqueueSync('habit_completions', 'DELETE', { id: existing.id });
      return false;
    } else {
      const newCompletion: HabitCompletion = {
        id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        habit_id: habitId,
        completion_date: dateStr,
        created_at: new Date().toISOString()
      };
      store.put(newCompletion);
      await this.enqueueSync('habit_completions', 'INSERT', newCompletion);
      return true;
    }
  }

  // --- ACCOUNTABILITY CONTACTS ---
  async getContacts(): Promise<AccountabilityContact[]> {
    const store = await this.getStore('contacts', 'readonly');
    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async saveContact(contact: AccountabilityContact): Promise<void> {
    const store = await this.getStore('contacts', 'readwrite');
    store.put(contact);
    await this.enqueueSync('accountability_contacts', 'INSERT', contact);
  }

  async deleteContact(id: string): Promise<void> {
    const store = await this.getStore('contacts', 'readwrite');
    store.delete(id);
    await this.enqueueSync('accountability_contacts', 'DELETE', { id });
  }

  // --- FASTING ---
  async getFastingRecords(): Promise<FastingRecord[]> {
    const store = await this.getStore('fasting', 'readonly');
    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result || []).reverse());
      req.onerror = () => resolve([]);
    });
  }

  async saveFastingRecord(record: FastingRecord): Promise<void> {
    const store = await this.getStore('fasting', 'readwrite');
    store.put(record);
    await this.enqueueSync('fasting', 'INSERT', record);
  }

  // --- SCRIPTURE FAVORITES ---
  async getFavorites(): Promise<string[]> {
    const store = await this.getStore('favorites', 'readonly');
    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result || []).map((f: any) => f.reference));
      req.onerror = () => resolve([]);
    });
  }

  async toggleFavorite(reference: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    const store = await this.getStore('favorites', 'readwrite');
    if (favorites.includes(reference)) {
      store.delete(reference);
      return false;
    } else {
      store.put({ reference, created_at: new Date().toISOString() });
      return true;
    }
  }

  // --- MEMORY VERSES ---
  async getMemoryProgress(): Promise<Record<string, MemoryVerseProgress>> {
    const store = await this.getStore('memory_verses', 'readonly');
    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => {
        const map: Record<string, MemoryVerseProgress> = {};
        for (const item of (req.result || [])) {
          map[item.verse_id] = item;
        }
        resolve(map);
      };
      req.onerror = () => resolve({});
    });
  }

  async saveMemoryProgress(progress: MemoryVerseProgress): Promise<void> {
    const store = await this.getStore('memory_verses', 'readwrite');
    store.put(progress);
  }

  // --- SYNC QUEUE ---
  private async enqueueSync(tableName: string, operation: 'INSERT' | 'UPDATE' | 'DELETE', payload: any): Promise<void> {
    try {
      const store = await this.getStore('sync_queue', 'readwrite');
      const item: SyncQueueItem = {
        id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        table_name: tableName,
        operation,
        payload,
        created_at: new Date().toISOString()
      };
      store.put(item);
    } catch (e) {
      console.warn('Sync queue error:', e);
    }
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    const store = await this.getStore('sync_queue', 'readonly');
    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async removeSyncQueueItem(id: string): Promise<void> {
    const store = await this.getStore('sync_queue', 'readwrite');
    store.delete(id);
  }

  // --- PRAYER ALTAR & ALARMS ---
  async getPrayerAltars(): Promise<PrayerAltarWatch[]> {
    const store = await this.getStore('prayer_altars', 'readonly');
    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => {
        if (req.result && req.result.length > 0) {
          const sorted = req.result.sort((a: PrayerAltarWatch, b: PrayerAltarWatch) => a.time.localeCompare(b.time));
          resolve(sorted);
        } else {
          // Pre-seed 3 Biblical Altar Watches
          const defaults: PrayerAltarWatch[] = [
            {
              id: 'altar_dawn',
              title: 'Dawn Consecration Watch',
              time: '06:30',
              scripture_ref: 'Psalm 5:3',
              scripture_text: 'In the morning, LORD, You hear my voice; in the morning I lay my requests before You and wait expectantly.',
              focus: 'First fruits of the day: surrendering your body, eyes, and thought life as a living altar to Jesus Christ.',
              alarm_enabled: true,
              sound_type: 'cathedral-bell',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 'altar_midday',
              title: 'Midday Shield Check-In',
              time: '12:30',
              scripture_ref: 'Psalm 55:17',
              scripture_text: 'Evening and morning and at noon I utter my complaint and moan, and He hears my voice.',
              focus: 'Midday warfare check: soaking the Shield of Faith, repelling workplace or stress triggers, and realigning with peace.',
              alarm_enabled: true,
              sound_type: 'temple-chime',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 'altar_evening',
              title: 'Evening Cleansing & Night Watch',
              time: '21:30',
              scripture_ref: 'Psalm 141:2',
              scripture_text: 'Let my prayer be counted as incense before You, and the lifting up of my hands as the evening sacrifice.',
              focus: 'Nighttime perimeter protection: charging devices outside the room, confessing any daily missteps, and sleeping in grace.',
              alarm_enabled: true,
              sound_type: 'sacred-harp',
              active: true,
              created_at: new Date().toISOString()
            }
          ];
          this.initAltars(defaults);
          resolve(defaults);
        }
      };
      req.onerror = () => resolve([]);
    });
  }

  private async initAltars(altars: PrayerAltarWatch[]): Promise<void> {
    const store = await this.getStore('prayer_altars', 'readwrite');
    for (const a of altars) {
      store.put(a);
    }
  }

  async savePrayerAltar(altar: PrayerAltarWatch): Promise<void> {
    const store = await this.getStore('prayer_altars', 'readwrite');
    store.put(altar);
    await this.enqueueSync('prayer_altars', 'INSERT', altar);
  }

  async deletePrayerAltar(id: string): Promise<void> {
    const store = await this.getStore('prayer_altars', 'readwrite');
    store.delete(id);
    await this.enqueueSync('prayer_altars', 'DELETE', { id });
  }

  async togglePrayerAltarAlarm(id: string): Promise<boolean> {
    const altars = await this.getPrayerAltars();
    const altar = altars.find(a => a.id === id);
    if (!altar) return false;
    const updated = { ...altar, alarm_enabled: !altar.alarm_enabled };
    await this.savePrayerAltar(updated);
    return updated.alarm_enabled;
  }

  async togglePrayerAltarActive(id: string): Promise<boolean> {
    const altars = await this.getPrayerAltars();
    const altar = altars.find(a => a.id === id);
    if (!altar) return false;
    const updated = { ...altar, active: !altar.active };
    await this.savePrayerAltar(updated);
    return updated.active;
  }

  // --- EXPORT ALL DATA ---
  async exportAllData(): Promise<any> {
    const settings = await this.getSettings();
    const progress = await this.getProgressSummary();
    const journal = await this.getJournalEntries();
    const triggers = await this.getTriggers();
    const habits = await this.getHabits();
    const stumbles = await this.getStumbles();
    const contacts = await this.getContacts();
    const fasting = await this.getFastingRecords();
    const favorites = await this.getFavorites();
    const altars = await this.getPrayerAltars();

    return {
      exported_at: new Date().toISOString(),
      app: 'Freedom in Christ',
      settings,
      progress,
      journal,
      triggers,
      habits,
      stumbles,
      contacts,
      fasting,
      favorites,
      altars
    };
  }

  async clearAllData(): Promise<void> {
    const db = await this.initDB();
    const storeNames = Array.from(db.objectStoreNames);
    const tx = db.transaction(storeNames, 'readwrite');
    for (const name of storeNames) {
      tx.objectStore(name).clear();
    }
  }
}

export const storage = new StorageService();
