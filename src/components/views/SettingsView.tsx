import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Cloud, 
  Database, 
  Lock, 
  Bell, 
  Moon, 
  Sun, 
  Laptop,
  Palette,
  Download, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  LogOut,
  LogIn,
  Key,
  Info
} from 'lucide-react';
import { AppSettings } from '../../types';
import { storage } from '../../services/storage';
import { getSupabaseClient, getCurrentUser, syncOfflineQueue } from '../../services/supabase';
import { applyTheme } from '../../services/theme';

interface SettingsViewProps {
  onSettingsUpdated: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onSettingsUpdated }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Auth inputs
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const s = await storage.getSettings();
    setSettings(s);
    const u = await getCurrentUser();
    setUserEmail(u ? u.email || 'Local User' : null);
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    await storage.saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    onSettingsUpdated();
  };

  const handleThemeChange = async (newTheme: AppSettings['theme']) => {
    if (!settings) return;
    const updated = { ...settings, theme: newTheme };
    setSettings(updated);
    applyTheme(newTheme);
    await storage.saveSettings(updated);
    onSettingsUpdated();
  };

  const handleTestSync = async () => {
    setIsSyncing(true);
    setSyncStatusMsg(null);
    try {
      const res = await syncOfflineQueue();
      setSyncStatusMsg(res.message);
    } catch (e: any) {
      setSyncStatusMsg('Unable to synchronize. Your local information is safe and will be retried later.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSignUp = async () => {
    if (!authEmail || !authPassword) {
      setAuthError('Please enter email and password.');
      return;
    }
    setIsAuthLoading(true);
    setAuthError(null);
    setAuthSuccess(null);
    try {
      const client = await getSupabaseClient();
      if (!client) {
        // Fallback local account
        localStorage.setItem('fic_local_user', JSON.stringify({ email: authEmail, id: `local_${Date.now()}` }));
        setUserEmail(authEmail);
        setAuthSuccess('Local account created and signed in.');
        return;
      }
      const { data, error } = await client.auth.signUp({
        email: authEmail,
        password: authPassword
      });
      if (error) throw error;
      setAuthSuccess('Account registered successfully! Check your email for verification.');
      setUserEmail(data.user?.email || authEmail);
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!authEmail || !authPassword) {
      setAuthError('Please enter email and password.');
      return;
    }
    setIsAuthLoading(true);
    setAuthError(null);
    setAuthSuccess(null);
    try {
      const client = await getSupabaseClient();
      if (!client) {
        localStorage.setItem('fic_local_user', JSON.stringify({ email: authEmail, id: `local_${Date.now()}` }));
        setUserEmail(authEmail);
        setAuthSuccess('Signed in with local profile.');
        return;
      }
      const { data, error } = await client.auth.signInWithPassword({
        email: authEmail,
        password: authPassword
      });
      if (error) throw error;
      setAuthSuccess('Signed in successfully!');
      setUserEmail(data.user?.email || authEmail);
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const client = await getSupabaseClient();
      if (client) {
        await client.auth.signOut();
      }
      localStorage.removeItem('fic_local_user');
      setUserEmail(null);
      setAuthSuccess('Signed out.');
    } catch (err: any) {
      console.error(err);
    }
  };

  const handlePasswordReset = async () => {
    if (!authEmail) {
      setAuthError('Enter your email to receive a password reset link.');
      return;
    }
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const client = await getSupabaseClient();
      if (client) {
        const { error } = await client.auth.resetPasswordForEmail(authEmail);
        if (error) throw error;
        setAuthSuccess('Password reset link sent to your email.');
      } else {
        setAuthSuccess('Offline mode active. Reset not needed for local demo profile.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Password reset error');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleExportJSON = async () => {
    const data = await storage.exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freedom-in-christ-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleExportCSV = async () => {
    const data = await storage.exportAllData();
    // Convert journal to CSV
    const headers = 'ID,Date,Title,Mood,Trigger,Content\n';
    const rows = (data.journal || []).map((j: any) => 
      `"${j.id}","${j.created_at}","${(j.title || '').replace(/"/g, '""')}","${j.mood}","${j.trigger || ''}","${(j.content || '').replace(/"/g, '""')}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freedom-journal-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleClearData = async () => {
    if (confirm('Are you sure you want to clear all locally stored data? This cannot be undone.')) {
      await storage.clearAllData();
      alert('Local data cleared. Reloading page...');
      window.location.reload();
    }
  };

  if (!settings) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Header with Quick Theme Toggle */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
            <SettingsIcon className="w-4 h-4" />
            <span>Application Preferences</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Settings & Customization
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Manage your visual theme, prayer alarms, cloud synchronization, and private backups.
          </p>
        </div>

        {/* Quick Theme Toggle Button in Header */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleThemeChange(settings.theme === 'dark' ? 'light' : 'dark')}
            className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center gap-2"
            title="Click to quickly toggle between Dark and Light mode"
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>Theme: {settings.theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}</span>
          </button>
        </div>
      </div>

      {/* APPEARANCE & THEME BUTTONS (FEATURED PROMINENTLY AT TOP) */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Palette className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Visual Theme Selection
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-amber-300 capitalize">
            Current: {settings.theme}
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Choose your visual ambiance. Tap any button below to switch themes immediately across all screens and views.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Dark Mode Button */}
          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-3 cursor-pointer ${
              settings.theme === 'dark'
                ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md ring-2 ring-amber-400/30'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
                <Moon className="w-4 h-4" />
              </div>
              {settings.theme === 'dark' && (
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Active
                </span>
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">Midnight Dark</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Deep obsidian and navy tones with warm golden accents. Peaceful for night reflection.
              </p>
            </div>
          </button>

          {/* Light Mode Button */}
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-3 cursor-pointer ${
              settings.theme === 'light'
                ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md ring-2 ring-amber-400/30'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600">
                <Sun className="w-4 h-4" />
              </div>
              {settings.theme === 'light' && (
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Active
                </span>
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">Sanctuary Light</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Crisp parchment and alabaster with slate typography. Reverent and clear in daylight.
              </p>
            </div>
          </button>

          {/* System Adaptive Button */}
          <button
            type="button"
            onClick={() => handleThemeChange('system')}
            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-3 cursor-pointer ${
              settings.theme === 'system'
                ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md ring-2 ring-amber-400/30'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400">
                <Laptop className="w-4 h-4" />
              </div>
              {settings.theme === 'system' && (
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Active
                </span>
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">System Adaptive</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatically synchronizes with your device's light or dark mode schedule.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* ACCOUNT & CLOUD AUTHENTICATION */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Account & Security
            </h3>
          </div>
          {userEmail && (
            <span className="text-xs text-emerald-400 font-medium">
              Signed In: {userEmail}
            </span>
          )}
        </div>

        {userEmail ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-200">Current User: {userEmail}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Your entries and progress are secured to your account.</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              The app functions completely offline without an account. Sign in or register below to enable cloud backup across all your devices.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Email</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Password</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                disabled={isAuthLoading}
                onClick={handleSignIn}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                disabled={isAuthLoading}
                onClick={handleSignUp}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition cursor-pointer"
              >
                Register New Account
              </button>
              <button
                disabled={isAuthLoading}
                onClick={handlePasswordReset}
                className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs transition cursor-pointer ml-auto"
              >
                Forgot Password?
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SUPABASE CLOUD DATABASE CONFIGURATION */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Cloud className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Supabase Configuration
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {settings.supabase_url ? 'Configured' : 'Offline / Local Mode'}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          To synchronize with your own Supabase project, enter your project credentials here. They are saved in your local browser IndexedDB only.
        </p>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-300 mb-1 block">SUPABASE_URL</label>
            <input
              type="text"
              value={settings.supabase_url}
              onChange={(e) => setSettings({ ...settings, supabase_url: e.target.value })}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 mb-1 block">SUPABASE_ANON_KEY (Public Key Only)</label>
            <input
              type="password"
              value={settings.supabase_anon_key}
              onChange={(e) => setSettings({ ...settings, supabase_anon_key: e.target.value })}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none font-mono"
            />
          </div>
        </div>

        {syncStatusMsg && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{syncStatusMsg}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleSaveSettings}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
          >
            {savedSuccess ? 'Settings Saved ✓' : 'Save Cloud Settings'}
          </button>
          <button
            disabled={isSyncing}
            onClick={handleTestSync}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS & REMINDERS */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-lg">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Bell className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Daily Reminders
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="font-semibold text-slate-200 block">Encouraging Reminders</span>
              <span className="text-[11px] text-slate-400">Gentle prompts to refocus your heart on Jesus.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications_enabled}
              onChange={(e) => setSettings({ ...settings, notifications_enabled: e.target.checked })}
              className="accent-amber-400 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 mb-1 block">Morning Prayer Prompt</label>
              <input
                type="time"
                value={settings.morning_reminder_time}
                onChange={(e) => setSettings({ ...settings, morning_reminder_time: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 mb-1 block">Evening Protection Reflection</label>
              <input
                type="time"
                value={settings.evening_reminder_time}
                onChange={(e) => setSettings({ ...settings, evening_reminder_time: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* DATA EXPORT & PRIVACY CONTROLS */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-lg">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Download className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Data Portability & Privacy
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          You own 100% of your data. Export your private journal reflections, trigger records, and habits at any time.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export All Data (JSON)</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export Journal (CSV)</span>
          </button>
          <button
            onClick={handleClearData}
            className="px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-800/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Clear Local Data</span>
          </button>
        </div>
      </div>

      {/* ABOUT & THEOLOGICAL SOURCE */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-2 text-xs text-slate-400 leading-relaxed">
        <h4 className="font-bold text-slate-200 text-sm">{settings.app_name}</h4>
        <p>A Biblical Journey Toward Purity, Self-Control, and Spiritual Victory in Jesus Christ.</p>
        <p className="text-[11px] text-slate-400 pt-1">
          Based on the biblical teaching manuscript <em>"Fighting the Battle of Sexual Sin with the Armour of God."</em> Built for offline-first PWA, GitHub, Netlify, and Android deployment.
        </p>
      </div>

    </div>
  );
};
