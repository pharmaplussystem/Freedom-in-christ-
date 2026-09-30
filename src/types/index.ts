export type ViewMode = 
  | 'home' 
  | 'daily-battle' 
  | 'emergency' 
  | 'scripture' 
  | 'prayer' 
  | 'armor' 
  | 'journal' 
  | 'triggers' 
  | 'progress' 
  | 'habits' 
  | 'accountability' 
  | 'resources' 
  | 'settings';

export type TriggerCategory = 
  | 'Loneliness'
  | 'Stress'
  | 'Boredom'
  | 'Anger'
  | 'Anxiety'
  | 'Social media'
  | 'Being alone'
  | 'Late-night phone use'
  | 'Certain websites'
  | 'Certain thoughts'
  | 'Fatigue'
  | 'Rejection'
  | 'Other';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id?: string;
  title: string;
  content: string;
  mood: 'peaceful' | 'struggling' | 'victorious' | 'grieving' | 'hopeful' | 'anxious';
  trigger?: TriggerCategory | string;
  scripture?: string;
  prayer?: string;
  what_learned?: string;
  next_step?: string;
  is_favorite?: boolean;
  created_at: string;
  updated_at: string;
  synced?: boolean;
}

export interface TriggerLog {
  id: string;
  user_id?: string;
  trigger_type: TriggerCategory | string;
  description: string;
  location?: string;
  device?: string;
  emotion?: string;
  intensity?: number; // 1 to 5
  action_taken?: string;
  resisted: boolean;
  date: string;
  created_at: string;
  synced?: boolean;
}

export interface Habit {
  id: string;
  user_id?: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly';
  category: 'spiritual' | 'physical' | 'mental' | 'accountability';
  icon: string;
  active: boolean;
  created_at: string;
}

export interface HabitCompletion {
  id: string;
  user_id?: string;
  habit_id: string;
  completion_date: string; // YYYY-MM-DD
  created_at: string;
  synced?: boolean;
}

export interface ProgressSummary {
  pornography_free_start: string; // ISO date string
  masturbation_free_start: string; // ISO date string
  last_fall_date?: string;
  total_temptations_resisted: number;
  total_armor_prayers_completed: number;
  total_scripture_reading_days: number;
  total_prayer_days: number;
  streak_porn_days: number;
  streak_masturbation_days: number;
}

export interface StumbleLog {
  id: string;
  user_id?: string;
  date: string;
  trigger: string;
  location: string;
  feeling: string;
  what_happened_before: string;
  what_to_change_next_time: string;
  recovery_plan: string;
  confession_made: boolean;
  received_grace: boolean;
  created_at: string;
  synced?: boolean;
}

export interface ScriptureVerse {
  id: string;
  reference: string;
  text: string;
  translation: string;
  category: 
    | 'purity' 
    | 'self-control' 
    | 'temptation' 
    | 'renewal-of-mind' 
    | 'identity-in-christ' 
    | 'grace-and-forgiveness' 
    | 'spiritual-warfare';
  summary: string;
  application: string;
  is_sword_rhema?: boolean;
  sword_attack_target?: string;
}

export interface MemoryVerseProgress {
  verse_id: string;
  memorized: boolean;
  review_count: number;
  last_reviewed?: string;
  next_review?: string;
}

export interface PrayerItem {
  id: string;
  title: string;
  category: 
    | 'morning' 
    | 'temptation' 
    | 'repentance' 
    | 'strength' 
    | 'renewal' 
    | 'self-control' 
    | 'sleep' 
    | 'after-fall' 
    | 'thanksgiving' 
    | 'armor'
    | 'custom';
  content: string;
  scripture_anchor?: string;
  is_custom?: boolean;
  created_at: string;
}

export interface ArmorPiece {
  id: 'truth' | 'righteousness' | 'peace' | 'faith' | 'salvation' | 'sword' | 'prayer';
  name: string;
  roman_parallel: string;
  greek_term: string;
  scripture_ref: string;
  scripture_text: string;
  meaning: string;
  battle_function: string;
  enemy_strategy: string;
  theological_depth: string;
  christological_fulfillment?: string;
  anatomical_engineering?: {
    material: string;
    design_details: string;
    vulnerability_if_missing: string;
  };
  battleground_scenarios?: {
    title: string;
    trigger_context: string;
    counter_strategy: string;
    declaration: string;
  }[];
  lies_and_counter_truths?: { lie: string; counter_scripture: string; truth: string }[];
  rhema_arsenal?: { attack: string; verse: string; declaration: string }[];
  practical_drills: { phase: string; title: string; action: string }[];
  daily_practice: string[];
  prayer_text: string;
}

export interface AccountabilityContact {
  id: string;
  user_id?: string;
  name: string;
  phone: string;
  email: string;
  relationship: string;
  notes?: string;
  created_at: string;
  synced?: boolean;
}

export interface FastingRecord {
  id: string;
  user_id?: string;
  start_time: string;
  end_time?: string;
  intention: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  synced?: boolean;
}

export interface PrayerAltarWatch {
  id: string;
  user_id?: string;
  title: string;
  time: string; // HH:MM in 24h
  scripture_ref: string;
  scripture_text: string;
  focus: string;
  alarm_enabled: boolean;
  sound_type: 'cathedral-bell' | 'temple-chime' | 'sacred-harp' | 'gentle-gong';
  active: boolean;
  days_of_week?: number[];
  created_at: string;
  synced?: boolean;
}

export interface AppSettings {
  app_name: string;
  theme: 'dark' | 'light' | 'system';
  supabase_url: string;
  supabase_anon_key: string;
  notifications_enabled: boolean;
  morning_reminder_time: string;
  evening_reminder_time: string;
  armor_reminder_enabled: boolean;
  last_synced_at?: string;
}
